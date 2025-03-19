import { CardList, Container, Footer, Header } from "@/components/shared";
import type { Metadata } from "next";
import { getCategoryByName, getProductsByCategory } from "@/app/api/api_utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = await getCategoryByName(params.category);
  return {
    title: cat ? `${cat.name_ru}` : "Категория не найдена",
    description: cat?.description || "Категория не найдена",
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
  console.log(cat?.name); // Server  cable

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
