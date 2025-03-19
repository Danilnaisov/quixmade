import { Container, Footer, Header, LoginPage } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Авторизация",
  description: "Войдите или зарегистрируйтесь в QuixMade",
};

export default async function AuthPage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Container className="flex justify-center items-center flex-grow py-14">
        <LoginPage />
      </Container>
      <Footer />
    </div>
  );
}
