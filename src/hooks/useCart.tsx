import { CartProductType } from "@/components/products/ProductDetails";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type CartContextType = {
  cartTotalQuantity: number;
  cartTotalPrice: number;
  cartItems: CartProductType[] | undefined;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
}

interface Props {
  children: ReactNode
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartContextProvider = ({children}: Props) => {

  const [cartTotalQuantity, setCartTotalQuantity] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartItems, setCartItems] = useState<CartProductType[]>([])
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)

  console.log('qty', cartTotalQuantity) 
  console.log('amount', cartTotalPrice)

  useEffect(() => {
    const storedCartItems = localStorage.getItem('eShopCartItems')
    const storedPaymentIntent = localStorage.getItem("eShopPaymentIntent")
    if (storedCartItems) {
      try {
        const parsedCartItems: CartProductType[] = JSON.parse(storedCartItems)
      
        const parsedPaymentIntent: string | null = JSON.parse(storedPaymentIntent || "null")

      setCartItems(parsedCartItems)
      setPaymentIntent(parsedPaymentIntent)
      } catch (error) {
        console.error("Failed to parse cart items", error)
        setCartItems([])
      }
    }
    
  }, [])


  useEffect(() => {
    const calculateCartTotals = () => {

      if (cartItems) {
        const {totalPrice, totalQuantity} = cartItems.reduce((acc, item) => {
          const itemTotalPrice = item.price * item.quantity
  
          acc.totalPrice += itemTotalPrice
          acc.totalQuantity += item.quantity
  
          return acc
        }, {totalPrice: 0, totalQuantity: 0})


        setCartTotalQuantity(totalQuantity)
        setCartTotalPrice(totalPrice)
      }
    }
    calculateCartTotals()
  }, [cartItems])
  
  
  const updateLocalStorage = (updatedCart: CartProductType[]) => {
    localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
  };

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartItems((prev) => {
      const updatedCart = prev ? [...prev, product] : [product];
      
      updateLocalStorage(updatedCart)
      return updatedCart;
    } )
    toast.success('Product added to cart');
  }, [])

  const handleRemoveProductFromCart = useCallback((product: CartProductType) => {

    if (cartItems) {
      const filteredProducts = cartItems.filter((item) => {
        return item.id !== product.id
      })

      setCartItems(filteredProducts)
      updateLocalStorage(filteredProducts)
      toast.success("Product removed")

    }

  }, [cartItems])


  const handleCartQtyIncrease = useCallback((product: CartProductType) => {
    let updatedCart;

    if (product.quantity === 99) {
      return toast.error("Oops! Maximum reached");
    }

    if (cartItems) {
      updatedCart = [...cartItems];
      const existingIndex = cartItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity + 1;
      }

      setCartItems(updatedCart);
      updateLocalStorage(updatedCart)
    }
  }, [cartItems]);

  const handleCartQtyDecrease = useCallback((product: CartProductType) => {
    let updatedCart;

    if (product.quantity === 1) {
      return toast.error("Oops! Minimum reached");
    }

    if (cartItems) {
      updatedCart = [...cartItems];
      const existingIndex = cartItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity - 1;
      }

      setCartItems(updatedCart);
      updateLocalStorage(updatedCart)
    }
  }, [cartItems]);

  const handleClearCart = useCallback(() => {

    const updatedCart: CartProductType[] = [];

    setCartItems(updatedCart)
    setCartTotalQuantity(0)
    updateLocalStorage(updatedCart)

  }, [])

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val)
    localStorage.setItem("eShopPaymentIntent", JSON.stringify(val))
  }, [paymentIntent])

  const value = {
    cartTotalQuantity,
    cartTotalPrice,
    cartItems,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartContextProvider")
  }

  return context
}