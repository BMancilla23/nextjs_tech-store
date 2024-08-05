import { getCurrentUser } from "@/actions/getCurrentUser";
import { getOrdersByUserId } from "@/actions/getOrdersByUserId";
import { Container } from "@/components/Container";
import { OrdersClient } from "@/components/orders/OrdersClient";
import { NullData } from "@/components/products/NullData";

export default async function OrdersPage() {

  const currentUser = await getCurrentUser()

  const orders = await getOrdersByUserId(currentUser!.id)

  if (!orders) {
    return <NullData title="No orders yet..."/>    
  }
  
  return (

      <Container>
      <OrdersClient orders={orders}/>
    </Container>
 
  );
}
