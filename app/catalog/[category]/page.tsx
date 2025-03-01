import { CardList, Container, Footer, Header } from "@/components/shared";
import type { Metadata } from "next";
import { getCategoryByName, getProductsByCategory } from "@/app/api/api_utils";

// Генерация метаданных
export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = await getCategoryByName(params.category);

  return {
    title: cat ? `${cat.name_ru}` : "QuixMade: Категория не найдена",
    description: cat?.description || "Описание категории",
  };
}

// Основной компонент страницы
export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = await getCategoryByName(params.category);
  const products = await getProductsByCategory(params.category);

  if (!cat) {
    return (
      <div className="text-center text-2xl mt-10">Категория не найдена</div>
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
            <CardList count={products.length} category={cat} />
          ) : (
            <p>В данной категории пока нет товаров.</p>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
