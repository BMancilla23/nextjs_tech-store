import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ToastProvider } from "@/providers/ToastProvider";


const poppins = Poppins({ subsets: ["latin"], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: "Tech-Store",
  description: "Ecommerce app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true} className={`${poppins.className} text-slate-700` }>
        <ToastProvider/>
        {children}
      </body>
    </html>
  );
}
