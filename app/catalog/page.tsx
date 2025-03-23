import {
  Banner,
  CardList,
  Container,
  Footer,
  Header,
} from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог | QuixMade — большой выбор товаров",
  description:
    "Исследуйте наш каталог на QuixMade. Большой выбор товаров, доступные цены и быстрая доставка по всей России.",
  keywords: [
    "каталог",
    "товары",
    "купить",
    "QuixMade",
    "электроника",
    "гаджеты",
  ],
  openGraph: {
    title: "Каталог | QuixMade — большой выбор товаров",
    description:
      "Исследуйте наш каталог на QuixMade. Большой выбор товаров, доступные цены и быстрая доставка по всей России.",
    url: "https://www.quixmade.ru/catalog",
    siteName: "QuixMade",
    images: [
      {
        url: "https://made.quixoria.ru/logo_min.jpg",
        width: 1200,
        height: 630,
        alt: "Каталог | QuixMade",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог | QuixMade — большой выбор товаров",
    description:
      "Исследуйте наш каталог на QuixMade. Большой выбор товаров, доступные цены и быстрая доставка по всей России.",
    images: ["https://made.quixoria.ru/logo_min.jpg"],
  },
};

export default async function Home() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Header />
      <Banner />
      <Container className="pb-14 flex justify-between w-full">
        <CardList />
      </Container>
      <Footer />
    </div>
  );
}
