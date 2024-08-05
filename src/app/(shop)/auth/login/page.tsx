import { getCurrentUser } from "@/actions/getCurrentUser";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { Container } from "@/components/Container";
import { FormWrap } from "@/components/FormWrap";

export default async function LoginPage() {
  const currentUser = await getCurrentUser()
  return (
    <Container>
      <FormWrap>
        <LoginForm currentUser={currentUser}/>
      </FormWrap>
    </Container>
  );
}