import { getCurrentUser } from "@/actions/getCurrentUser";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { Container } from "@/components/Container";
import { FormWrap } from "@/components/FormWrap";

export default async function RegisterPage() {

  const currentUser = await getCurrentUser()

  return (
    <Container>
      <FormWrap>
        <RegisterForm currentUser={currentUser}/>
      </FormWrap>
    </Container>
  );
  
}