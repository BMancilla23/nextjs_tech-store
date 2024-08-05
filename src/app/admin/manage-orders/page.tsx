import { getCurrentUser } from "@/actions/getCurrentUser";
import { getOrders } from "@/actions/getOrders";
import { ManageOrdersClient } from "@/components/admin/manage-orders/ManageOrdersClient";
import { Container } from "@/components/Container";
import { NullData } from "@/components/products/NullData";

export default async function ManageOrdersPage() {

  const orders = await getOrders()
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied"/>
  }

  return (

      <Container>
      <ManageOrdersClient orders={orders}/>
    </Container>
 
  );
}
