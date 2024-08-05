import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { Container } from "@/components/Container";
import { FormWrap } from "@/components/FormWrap";

export default function CheckoutPage() {
  return (
    <div className="p-8">
      <Container>

        <FormWrap>
          <CheckoutClient/>
        </FormWrap>
      </Container>
    </div>
  );
}