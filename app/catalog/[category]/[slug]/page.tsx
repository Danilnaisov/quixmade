import { Metadata } from "next";
import { getProductBySlug } from "@/app/api/api_utils";
import {
  Footer,
  Header,
  Container,
  ProductPhotos,
  Title,
  AddToCartButton,
} from "@/components/shared";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name}` : "QuixMade: Товар не найден",
    description: product?.short_description || "Описание товара",
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div className="text-center text-2xl mt-10">Товар не найден</div>;
  }

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <Container className="mt-[15px] w-full flex flex-col gap-[15px] items-center">
        <div className="flex flex-col gap-3">
          <Breadcrumb className="breadcrumb">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/catalog">Каталог</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/catalog/${product.category.name}`}>
                    {product.category.name_ru}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="item_block flex items-center justify-center gap-4">
            <div className="ProductPhotos w-[710px] flex items-center justify-center">
              <ProductPhotos slug={product.slug} />
            </div>
            <div className="ProductDesc flex flex-col w-[710px]">
              <h1>{product.name}</h1>
              <p>Отзывы</p>
              <p>Описание</p>
              <p>{product.short_description}</p>
              {product.isDiscount ? (
                <>
                  <h2 className="text-[18px] font-[700] text-[#F20D0D]">
                    {product.discountedPrice} ₽
                  </h2>
                  <h2 className="line-through text-[13px] font-[700] text-[#274C5B]">
                    {product.price} ₽
                  </h2>
                  <p>Или {product.discountedPrice / 4} ₽ × 4 платежа в сплит</p>
                </>
              ) : (
                <>
                  <h2 className="text-[18px] font-[700] text-[#F20D0D]">
                    {product.price} ₽
                  </h2>
                  <p>Или {product.price / 4} ₽ × 4 платежа в сплит</p>
                </>
              )}
              {/* Кнопка "Добавить в корзину" */}
              {product.stock_quantity >= 2 && product.stock_quantity <= 4 ? (
                <div className="flex gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                  <p className="text-[#EE1919]">
                    Осталась мало, скоро может закончиться
                  </p>
                </div>
              ) : product.stock_quantity == 1 ? (
                <div className="flex gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                  <p className="text-[#EE1919]">
                    Осталась 1 шт, завтра может закончиться{" "}
                  </p>
                </div>
              ) : product.stock_quantity == 0 ? (
                <div className="flex gap-2 items-center">
                  <p className="text-[#EE1919]"> Нет в наличии </p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Container className="bg-[#F9F8F8] rounded-[40px] p-10 w-full">
        <Title text="Описание" className="text-[32px] font-bold" />
        {product.description.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </Container>
      <Container className="bg-[#F9F8F8] rounded-[40px] p-10 w-full">
        <Title text="Отзывы" className="text-[32px] font-bold" />
        <p></p>
      </Container>
      <Footer />
    </div>
  );
}
