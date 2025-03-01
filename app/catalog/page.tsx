import {
  Banner,
  CardList,
  Container,
  Footer,
  Header,
  Filters,
} from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Каталог",
  description: "QuixMade: Каталог",
};

export default async function Home() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Header />
      <Banner count={5} pageName="Каталог" />
      <Container className="pb-14 flex justify-between w-full">
        <Filters />
        <CardList count={4} />
      </Container>
      <Footer />
    </div>
  );
}
