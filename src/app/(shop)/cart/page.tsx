import { getCurrentUser } from "@/actions/getCurrentUser";
import { Container } from "@/components/Container";
import { CartClient } from "@/components/cart/CartClient";

export default async function CartPage() {

  const currentUser = await getCurrentUser()

  return (
    <div className="pt-8">
      <Container>
        <CartClient currentUser={currentUser}/>
      </Container>
    </div>
  );
}