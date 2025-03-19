import { getNewsBySlug, getAllNews } from "@/app/api/api_utils";
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { NewsCard } from "@/components/shared/newsCard";
import { ShareButton } from "@/components/shared/ShareButton";

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

async function getRelatedNews(currentSlug: string, currentTags: string[]) {
  const allNews = await getAllNews();
  const filteredNews = allNews.filter((news) => news.slug !== currentSlug);

  const relatedByTags = filteredNews
    .filter((news) => news.tags.some((tag) => currentTags.includes(tag)))
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (relatedByTags.length < 4) {
    const remaining = filteredNews
      .filter((news) => !relatedByTags.some((r) => r.slug === news.slug))
      .sort(() => 0.5 - Math.random())
      .slice(0, 4 - relatedByTags.length);
    return [...relatedByTags, ...remaining];
  }

  return relatedByTags;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await getNewsBySlug(slug);
  const relatedNews = await getRelatedNews(slug, product?.tags || []);

  if (!product) {
    return (
      <div className="text-center text-2xl mt-10 text-gray-500">
        Новость не найдена
      </div>
    );
  }

  const formattedDate = new Date(product.date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-6 bg-gray-50">
      <Header />
      <Container className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb className="mb-4 w-full overflow-hidden">
          <BreadcrumbList className="flex flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-blue-600 hover:underline">
                  Главная
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/news" className="text-blue-600 hover:underline">
                  Новости
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-800 truncate text-wrap">
                {product.short_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <Title
              text={product.short_name}
              size="lg"
              className="font-extrabold text-gray-900 leading-tight text-xl sm:text-2xl lg:text-3xl"
            />
            <ShareButton slug={slug} />
          </div>
          <div className="relative w-full h-64 sm:h-80 lg:h-[500px] mb-4 sm:mb-6 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.short_name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
            />
            <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-xs sm:text-sm">
              Новости
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-gray-600 text-xs sm:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
            {product.desc}
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 italic">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {relatedNews.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {relatedNews.map((item) => (
                <NewsCard
                  key={item.slug}
                  title={item.short_name}
                  description={item.short_desc}
                  imageUrl={item.image}
                  slug={item.slug}
                  date={item.date}
                  tags={item.tags}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
}
