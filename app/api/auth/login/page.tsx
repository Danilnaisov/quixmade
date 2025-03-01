import { Container, Footer, Header, LoginPage } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Авторизация",
  description: "QuixMade: Авторизация",
};

export default async function Home() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Header />
      <Container className="p-14 flex justify-center w-full">
        <LoginPage />
      </Container>
      <Footer />
    </div>
  );
}
