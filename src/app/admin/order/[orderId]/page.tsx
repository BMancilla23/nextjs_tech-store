import { getOrderById } from "@/actions/getOderById";
import { Container } from "@/components/Container";
import { OrderDetails } from "@/components/admin/order/OrderDetails";
import { NullData } from "@/components/products/NullData";
/* import { product } from "@/data/product"; */

interface IParams{
  orderId?: string;
}

export default async function OrderPage({params}: {params: IParams}) {

  const order = await getOrderById(params)

  if (!order) {
    return <NullData title="No order"/>
  }

  return (
    <div className="">
      <Container>
        <OrderDetails order={order}/>
      </Container>
    </div>
  );
}