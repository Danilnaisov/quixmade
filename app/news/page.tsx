import { Footer, Header, NewsList } from "@/components/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новости | QuixMade — свежие новости и обзоры гаджетов",
  description:
    "Читайте свежие новости и обзоры гаджетов на QuixMade. Узнавайте первыми о новинках гаджетов, электроники и инноваций.",
  keywords: [
    "новости технологий",
    "обзоры гаджетов",
    "новинки электроники",
    "технологии",
    "QuixMade",
  ],
  openGraph: {
    title: "Новости | QuixMade — свежие новости и обзоры гаджетов",
    description:
      "Читайте свежие новости и обзоры гаджетов на QuixMade. Узнавайте первыми о новинках гаджетов, электроники и инноваций.",
    url: "https://www.quixmade.ru/news",
    siteName: "QuixMade",
    images: [
      {
        url: "https://made.quixoria.ru/logo_min.jpg",
        width: 1200,
        height: 630,
        alt: "Новости | QuixMade",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Новости | QuixMade — свежие новости и обзоры гаджетов",
    description:
      "Читайте свежие новости и обзоры гаджетов на QuixMade. Узнавайте первыми о новинках гаджетов, электроники и инноваций.",
    images: ["https://made.quixoria.ru/logo_min.jpg"],
  },
};

export default async function ProductPage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6">Новости</h1>
      <NewsList />
      <Footer />
    </div>
  );
}
