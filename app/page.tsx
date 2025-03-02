import {
  Banner,
  CardList,
  Footer,
  Header,
  ProductPhotos,
} from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Главная",
  description: "QuixMade: Главная",
};

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Header />
      <Banner count={5} pageName="Главная" />
      <CardList text="Горячие хиты 🔥" count={5} type="hot" />
      <CardList count={10} />
      <CardList text="Поможем вам с выбором" type="help" />
      <CardList count={15} />
      <Footer />
    </div>
  );
}
