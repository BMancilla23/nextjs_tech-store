import { getCurrentUser } from "@/actions/getCurrentUser";
import { getProducts } from "@/actions/getProducts";
import { ManageProductsClient } from "@/components/admin/manage-products/ManageProductsClient";
import { Container } from "@/components/Container";
import { NullData } from "@/components/products/NullData";

export default async function ManageProductsPage() {

  const products = await getProducts({category: null})
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied"/>
  }

  return (

      <Container>
      <ManageProductsClient products= {products}/>
    </Container>
 
  );
}
