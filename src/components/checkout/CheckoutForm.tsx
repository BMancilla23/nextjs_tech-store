"use client"

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FC, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heading } from "../ui/Heading";
import { Button } from "../ui/Button";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void
}

export const CheckoutForm:FC<CheckoutFormProps> = ({clientSecret, handleSetPaymentSuccess}) => {

  const {cartTotalPrice, handleClearCart, handleSetPaymentIntent} = useCart()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const formattedPrice = formatPrice(cartTotalPrice)

  // Restablecer el estado de éxito del pago cuando se carga el componente
  useEffect(() => {
    
    if (!stripe || !clientSecret) {
      return
    }

    handleSetPaymentSuccess(false)

  }, [stripe, clientSecret, handleSetPaymentIntent])
  

  // Manejar la presentación del formulario de pago
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return 
    }

    setIsLoading(true)

    /* stripe.confirmPayment({
      elements, redirect: 'if_required'
    }).then(result => {
      if (!result.error) {
        toast.success('Checkout Success')

        handleClearCart()
        handleSetPaymentSuccess(true)
        handleSetPaymentIntent(null)
      }

      setIsLoading(false)
    }) */

      // Confirmar el pago usando Stripe
      try {
        const result = await stripe.confirmPayment({
          elements, redirect: 'if_required'
        })

        if (!result.error) {
          toast.success('Checkout Success')
          handleClearCart()
          handleSetPaymentSuccess(true)
          handleSetPaymentIntent(null)
        }else{
          toast.error(result.error.message || "An error occurred during payment.")
        }
      } catch (error) {
        console.error("Payment failed:", error)
        toast.error("Payment failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
  }

 return (
  <form onSubmit={handleSubmit} id="payment-form">
    <div className="mb-6">
      <Heading title="Enter your details to complete checkout"/>
    </div>
    <h2 className="font-semibold mb-2">
      Address Information
    </h2>
    <AddressElement options={{
      mode: "shipping",
      allowedCountries: ["US", "PE"]
    }}/>
    <h2 className="font-semibold mt-4 mb-2">
      Payment Information
    </h2>
    <PaymentElement id="paymeny-element" options={
      {
        layout: "tabs"
      }
    }/>
    <div className="py-4 text-center text-slate-700 text-xl font-bold">
      Total: {formattedPrice}
    </div>
    <Button label={isLoading ? 'Processing' : 'Pay now'} disabled={isLoading || !stripe || !elements} onClick={() => {}}/>
  </form>
 )
}