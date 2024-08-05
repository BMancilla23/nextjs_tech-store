import { Container } from "@/components/Container";
import { ListRating } from "@/components/products/ListRating";
import { ProductDetails } from "@/components/products/ProductDetails";
import { products } from "@/data/products";
/* import { product } from "@/data/product"; */

interface IParams{
  productId?: string;
}

export default function ProductPage({params}: {params: IParams}) {
  console.log("params", params);

  const product = products.find((item) => item.id === params.productId)

  if (!product) {
    return <div className="p-8">Product not found</div>;
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product}/>
        <div className="flex flex-col ml-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product}/>
        </div>
      </Container>
    </div>
  );
}