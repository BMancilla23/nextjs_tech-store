/* import { getCurrentUser } from "@/actions/getCurrentUser"; */
import { Footer } from "@/components/common/footer/Footer";
import { Navbar } from "@/components/common/nav/Navbar";
import { CartProvider } from "@/providers/CartProvider";

export default async function ShopLayout({
 children
}: {
 children: React.ReactNode;
}) {

  // Prueba de obtención de usuario
/*   const currentUser = await getCurrentUser()

  console.log("User<<<", currentUser); */

  return (
    
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar/>
          <main className="flex-grow">
          {children}
          </main>
          <Footer/>
        </div>
      </CartProvider>

   
  );
}