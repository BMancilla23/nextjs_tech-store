"use client"

import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"

import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "./CheckoutForm"
import { Button } from "../ui/Button"

// Cargar la clave pública de Stripe para inicializar Stripe.js
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export const CheckoutClient = () => {
  const {cartItems, paymentIntent, handleSetPaymentIntent} = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const router = useRouter()


  // Logs de depuración
  useEffect(() => {
    console.log("paymentIntent", paymentIntent)
    console.log("clientSecret", clientSecret)
  }, [paymentIntent, clientSecret])

  
  // Función para obtener el Payment Intent desde el servidor
  const fetchPaymentIntent = async () => {
    setIsLoading(true);
    setHasError(false)

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: cartItems,
          payment_intent_id: paymentIntent
        })
      });

      setIsLoading(false);

      // Redirigir al login si el usuario no está autenticado
      if (response.status === 401) {
        router.push('/login');
        return
      }

      const data = await response.json()

      // Actualizar el clientSecret y el Payment Intent ID si existen
      if (data.paymentIntent) {
        setClientSecret(data.paymentIntent.client_secret);
        handleSetPaymentIntent(data.paymentIntent.id)
      }else{
        throw new Error('Payment Intent not found'
        )
      }

    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      console.log("Error fetching payment intent:", error);
      toast.error('Something went wrong')
    }
  }

  // Obtener el Payment Intent cuando hay artículos en el carríto
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      fetchPaymentIntent();
    }
  }, [cartItems, paymentIntent])

  // Configuraciones de apariencia de Stripe Elements
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating"
    }
  }

  // Manejar el éxito del pago
  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value)
  }, [])


/*   if (isLoading) {
    return <div className="text-center">Loading Checkout...</div>
  }

  if (hasError) {
    return <p>An error occurred during checkout. Please try again.</p>
  } */

  return (
    <div className="w-full">
      {/* Renderizar el formulario de pago solo si el pago no ha sido exitoso */}
      {!paymentSuccess && clientSecret && cartItems && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements>
      )}

      {/* Mostrar mensaje de carga si está cargando */}
      {
        isLoading && (
          <div className="text-center">
            Loading Checkout...
          </div>
        )
      }
      {/* Mostrar mensaje de error si hubo un error */}
      {
        hasError && (
          <div className="text-center text-rose-500">
            Something went wrong...
          </div>
        )
      }

      {/* Mostrar mensaje de éxito y botón para ver órdenes si el pago fue exitoso */}
      {
        paymentSuccess && (
          <div className="flex items-center flex-col gap-4">
            <div className="text-teal-500 text-center">Payment Success</div>
            
            <div className="max-[220px] w-full">
              <Button label="View Your Orders" onClick={() => router.push('/order')}/>
            </div>
          </div>
        )
      }
    </div>
  )
}