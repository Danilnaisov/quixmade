import { CardList, Container, Footer, Header } from "@/components/shared";
import type { Metadata } from "next";
import { getCategoryByName, getProductsByCategory } from "@/app/api/api_utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>; // params теперь Promise
}): Promise<Metadata> {
  const { category } = await params; // Дожидаемся params
  const cat = await getCategoryByName(category);
  return {
    title: cat
      ? `${cat.name_ru} | QuixMade`
      : "Категория не найдена | QuixMade",
    description:
      cat?.description || "Исследуйте товары в этой категории на QuixMade.",
    keywords: [
      cat?.name_ru || "категория",
      "товары",
      "купить",
      "QuixMade",
      "электроника",
      "гаджеты",
    ],
    openGraph: {
      title: cat
        ? `${cat.name_ru} | QuixMade`
        : "Категория не найдена | QuixMade",
      description:
        cat?.description || "Исследуйте товары в этой категории на QuixMade.",
      url: `https://www.quixmade.ru/catalog/${category}`, // Используем category после await
      siteName: "QuixMade",
      images: [
        {
          url: "https://made.quixoria.ru/logo_min.jpg",
          width: 1200,
          height: 630,
          alt: cat?.name_ru || "Категория | QuixMade",
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cat
        ? `${cat.name_ru} | QuixMade`
        : "Категория не найдена | QuixMade",
      description:
        cat?.description || "Исследуйте товары в этой категории на QuixMade.",
      images: ["https://made.quixoria.ru/logo_min.jpg"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>; // params теперь Promise
}) {
  const { category } = await params; // Дожидаемся params
  const cat = await getCategoryByName(category);
  const products = await getProductsByCategory(category);

  if (!cat) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center text-2xl mt-10">Категория не найдена</div>
        <Button className="text-center text-2xl mx-auto">
          <Link href={"/"}>На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        {/* Заголовок категории */}
        <h1 className="text-3xl font-bold text-center mb-6">{cat.name_ru}</h1>

        {/* Вывод товаров категории */}
        <Container className="pb-14 flex justify-between w-full">
          {products && products.length > 0 ? (
            <CardList count={products.length} category={cat.name} />
          ) : (
            <p>В данной категории пока нет товаров.</p>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
