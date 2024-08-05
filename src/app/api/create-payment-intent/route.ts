import { getCurrentUser } from "@/actions/getCurrentUser"
import { CartProductType } from "@/components/products/ProductDetails"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import prisma from "@/libs/prismadb"


// Inicializa la instancia de Stripe con la clave secreta y la versión de la API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

// Función para calcular el monto total de la orden basado en los items del carrito
const calculateOrderAmount = (items: CartProductType[]) => {

  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity
    
    return acc + itemTotal
  }, 0)

  // Convertir a centavos
  const priceInCents = Math.round(totalPrice * 100)
  return priceInCents
}

export async function POST(request: Request){

  // Obtiene el usuario actual
  const currentUser = await getCurrentUser()

  // Si no hay usuario, retorna un error de autorización
  if (!currentUser) {
    return NextResponse.json({
      error: 'Unauthorized'
    },
  {
    status: 401
  })
  }

  // Obtiene el cuerpo de la solicitud y extrae los items y el ID del intento de pago
  const body = await request.json()
  const {items, payment_intent_id} = body

  // Calcula el monto total de la orden en centavos
  const total = calculateOrderAmount(items)

  // Datos de la orden a crear o actualizar
  const orderData = {
    user: {connect: {id: currentUser.id}},
    amount: total,
    currency: 'usd',
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items
  }

  try {
    if (payment_intent_id) {
      // Si hay un intento de pago existente, actualiza el intento de pago con el nuevo monto
      const currentIntent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      )
  
      if (currentIntent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: total
          }
        )

        // Busca la orden existente
        const existingOrder = await prisma.order.findFirst({
          where: {
            paymentIntentId: payment_intent_id
          }
        })

        if (!existingOrder) {
          return NextResponse.json({error: 'Invalid Payment Intent'}, {
            status: 400
          })
        }

        // Actualiza la orden existente
        await prisma.order.update({
          where: {
            paymentIntentId: payment_intent_id
          },
          data: {amount: total, products: items}
        })

      /* // Actualiza la orden en la base de datos
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: {paymentIntentId: payment_intent_id}
        }),
        prisma.order.update({
          where: {paymentIntentId: payment_intent_id},
          data: {
            amount: total,
            products: items
          }
        })
      ])
  
      // Si no se encuentra una orden existente, retorna un error
      if (!existing_order) {
        return NextResponse.json({error: 'Invalid Payment Intent'}, {status: 400})
      } */


  
      // Retorna el intento de pago actualizado
      return NextResponse.json({paymentIntent: updated_intent})
      }
  
    }else{
      // Si no hay un intento de pago existente, crea un nuveo intento de pago
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        automatic_payment_methods: {enabled: true}
      })
      
      // Asigna el ID del intento de pago a los datos de la orden
      orderData.paymentIntentId = paymentIntent.id
  
      // Crea la orden en la base de datos
      await prisma.order.create({
        data: orderData
      })
  
      // Retorna el nuevo intento de pago
      return NextResponse.json({paymentIntent})
    }
  } catch (error) {
    console.error("Error processing payment intent:", error)
    return NextResponse.json({error: 'Internal Server Error'}, {
      status: 500
    })
  }
}
