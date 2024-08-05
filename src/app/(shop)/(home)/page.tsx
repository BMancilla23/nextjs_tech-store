import { Container } from "@/components/Container";
import { Banner } from "@/components/home/banner/Banner";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { Product } from "@/interfaces/products.interface";
import { truncateText } from "@/utils/truncateText";

export default function Home() {
  return (
    <div className="p-8">
      <Container>
        <div>
          <Banner/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {
            products.map((product: Product) => (
              <ProductCard key={product.id} data={product}/>
            ))
          }
        </div>
      </Container>
    </div>
  );
}
