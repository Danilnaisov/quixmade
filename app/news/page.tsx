/* eslint-disable react/jsx-key */
import { getAllNews } from "@/app/api/api_utils";
import { Container, Footer, Header } from "@/components/shared";
import { NewsCard } from "@/components/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Новости",
  description: "QuixMade: Новости",
};

export default async function ProductPage() {
  const news = await getAllNews();

  if (!news) {
    return <div className="text-center text-2xl mt-10">Новости не найдена</div>;
  }

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <Container className="flex flex-col gap-6">
        {news.map(
          (item: {
            short_name: string;
            image: string;
            short_desc: string;
            slug: string;
            date: string;
          }) => (
            <NewsCard
              title={item.short_name}
              description={item.short_desc}
              imageUrl={item.image}
              slug={item.slug}
              date={item.date}
            />
          )
        )}
      </Container>
      <Footer />
    </div>
  );
}
