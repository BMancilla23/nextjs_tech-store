import { getCurrentUser } from "@/actions/getCurrentUser";
import { AddProductForm } from "@/components/admin/add-products/AddProductForm";


import { Container } from "@/components/Container";
import { FormWrap } from "@/components/FormWrap";
import { NullData } from "@/components/products/NullData";

export default async function AddProductsPage() {

  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData title="Oops! Access denied"/>
  }

  return (
    <div className="">
      <Container>
        <FormWrap>
          <AddProductForm/>
        </FormWrap>
      </Container>
    </div>
  );
}

