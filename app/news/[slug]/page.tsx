import { getNewsBySlug } from "@/app/api/api_utils";
import { Container, Footer, Header, Title } from "@/components/shared";
import { Metadata } from "next";
import Image from "next/image";
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
  const product = await getNewsBySlug(slug);

  return {
    title: product ? `${product.short_name}` : "QuixMade: Новость не найдена",
    description: product?.short_desc || "Описание Новости",
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await getNewsBySlug(slug);

  if (!product) {
    return <div className="text-center text-2xl mt-10">Новость не найдена</div>;
  }

  const formattedDate = new Date(product.date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <Container className="max-w-3xl mx-auto px-4">
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
                <Link href="/news">Новости</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.short_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Title
            text={product.short_name}
            size="md"
            className="font-extrabold text-gray-800 mb-4"
          />
          <div className="relative w-full h-96 mb-4">
            <Image
              src={product.image}
              alt={product.short_name}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <p className="text-gray-600 text-base font-medium mb-4">
            {product.desc}
          </p>
          <div className="text-xs text-gray-400">{formattedDate}</div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
