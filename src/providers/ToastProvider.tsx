import { Toaster } from "react-hot-toast"


export const ToastProvider = () => {
  return (
    <Toaster toastOptions={{
      style: {
        background: "rgb(51 65 85)",
        color: "#fff"
      }
    }}/>
  )
}