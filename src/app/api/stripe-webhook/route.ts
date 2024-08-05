import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

async function readBody(request: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Failed to get reader from request body');
  let done = false;
  while (!done) {
    const { done: doneReading, value } = await reader.read();
    if (doneReading) {
      done = true;
    } else {
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  console.log('Handling Stripe webhook event');

  try {
    // Leer el buffer del cuerpo de la solicitud
    const buf = await readBody(req);
    const sig = req.headers.get('stripe-signature');

    console.log('Received signature:', sig);

    // Verificar que la firma del webhook de Stripe esté presente
    if (!sig) {
      console.error('Missing the stripe signature');
      return NextResponse.json({ error: 'Missing the stripe signature' }, { status: 400 });
    }

    // Verificar el evento del webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
      console.log('Stripe event constructed successfully');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
      } else {
        console.error('⚠️  Webhook signature verification failed: Unknown error');
        return NextResponse.json({ error: 'Webhook signature verification failed: Unknown error' }, { status: 400 });
      }
    }

    // Manejar diferentes tipos de eventos de Stripe
    switch (event.type) {
      case 'charge.succeeded':
        // Manejar el evento de éxito de una carga
        const charge = event.data.object as Stripe.Charge;

        // Verificar que `payment_intent` es una cadena y que hay una dirección de envío
        if (typeof charge.payment_intent === 'string' && charge.shipping?.address) {
          const { address } = charge.shipping;
          // Actualizar la orden en la base de datos
          await prisma?.order.update({
            where: {
              paymentIntentId: charge.payment_intent,
            },
            data: {
              status: 'complete',
              address: {
                city: address.city || '',
                country: address.country || '',
                line1: address.line1 || '',
                line2: address.line2 || '',
                postal_code: address.postal_code || '',
                state: address.state || '',
              },
            },
          });
          console.log('Order updated successfully');
        }
        break;

      default:
        // Manejar eventos no gestionados
        console.log('Unhandled event type:', event.type);
    }

    // Responder a Stripe con un estado 200 para confirmar la recepción del evento
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    // Manejar errores durante el manejo del webhook
    if (error instanceof Error) {
      console.error('Error handling Stripe webhook:', error.message);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } else {
      console.error('Error handling Stripe webhook: Unknown error');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}
