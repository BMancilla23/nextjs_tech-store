'use client'

import { CartContextProvider } from "@/hooks/useCart"
import { FC, ReactNode } from "react"

interface CartProviderProps{
  children: ReactNode
}

export const CartProvider: FC<CartProviderProps> = ({children}) => {
  return (
    <CartContextProvider>{children}</CartContextProvider>
  )
}