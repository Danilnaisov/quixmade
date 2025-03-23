/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/shared/ShareButton";
import Script from "next/script";
import { Star } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ClientReviewSection } from "@/components/shared/ClientReviewSection";
import { cookies } from "next/headers";

async function getReviews(productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?productId=${productId}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return [];
  }
  return res.json();
}

async function checkPurchase(userId: string, productId: string) {
  try {
    const cookieStore = cookies();
    const cookieHeader = (await cookieStore)
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
      headers: {
        "x-user-id": userId,
        Cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch orders:", res.status, res.statusText);
      return false;
    }

    const orders = await res.json();
    const hasPurchased = orders.some((order: any) =>
      order.items.some((item: any) => {
        const itemProductId = item.product_id.toString();
        const targetProductId = productId.toString();
        return itemProductId === targetProductId;
      })
    );
    return hasPurchased;
  } catch (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product
      ? `${product.name} | QuixMade`
      : "Товар не найден | QuixMade",
    description:
      product?.short_description || "Подробное описание товара на QuixMade.",
    keywords: [
      product?.name || "товар",
      "купить",
      "QuixMade",
      "электроника",
      "гаджеты",
    ],
    openGraph: {
      title: product
        ? `${product.name} | QuixMade`
        : "Товар не найден | QuixMade",
      description:
        product?.short_description || "Подробное описание товара на QuixMade.",
      url: `https://www.quixmade.ru/catalog/${product?.category.name}/${slug}`,
      siteName: "QuixMade",
      images: [
        {
          url: product?.image || "https://made.quixoria.ru/logo_min.jpg",
          width: 1200,
          height: 630,
          alt: product?.name || "Товар | QuixMade",
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product
        ? `${product.name} | QuixMade`
        : "Товар не найден | QuixMade",
      description:
        product?.short_description || "Подробное описание товара на QuixMade.",
      images: [product?.image || "https://made.quixoria.ru/logo_min.jpg"],
    },
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
    return (
      <div className="text-center text-2xl mt-10 text-gray-500">
        Товар не найден
      </div>
    );
  }

  const reviews = await getReviews(product.id.toString());
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const hasPurchased = userId
    ? await checkPurchase(userId, product.id.toString())
    : false;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.stars, 0) /
        reviews.length
      : 0;

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-6 bg-gray-50">
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.short_description,
            image: product.image,
            sku: product.sku || product.id,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "RUB",
              availability:
                product.stock_quantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `https://www.quixmade.ru/catalog/${product.category.name}/${slug}`,
            },
            aggregateRating:
              reviews.length > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: averageRating.toFixed(1),
                    reviewCount: reviews.length,
                  }
                : undefined,
          }),
        }}
      />
      <Header />
      <Container className="mt-4 w-full flex flex-col gap-4 items-center">
        <div className="flex flex-col gap-3 w-full max-w-6xl">
          <Breadcrumb className="mb-4">
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
                  <Link
                    href="/catalog"
                    className="text-blue-600 hover:underline"
                  >
                    Каталог
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/catalog/${product.category.name}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.category.name_ru}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-800 truncate">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="item_block flex flex-col lg:flex-row items-start justify-center gap-6 bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-shadow duration-300 hover:shadow-xl">
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <ProductPhotos slug={product.slug} />
            </div>
            <div className="ProductDesc flex flex-col w-full lg:w-1/2 gap-4">
              <div className="ml-auto">
                <ShareButton
                  slug={product.slug}
                  category={product.category.name}
                  type={"product"}
                />
              </div>
              <div className="flex justify-between items-center">
                <Title
                  text={product.name}
                  size="lg"
                  className="font-extrabold text-gray-900 text-xl sm:text-2xl lg:text-3xl"
                />
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={20} fill="#ff9d00" color="#ff9d00" />
                    <span className="text-lg font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({reviews.length})
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {product.short_description}
              </p>
              {product.isDiscount ? (
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg sm:text-xl font-bold text-[#F20D0D]">
                    {product.discountedPrice.toLocaleString()} ₽
                  </h2>
                  <h2 className="line-through text-sm font-bold text-[#274C5B]">
                    {product.price.toLocaleString()} ₽
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Или {(product.discountedPrice / 4).toLocaleString()} ₽ × 4
                    платежа в сплит
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg sm:text-xl font-bold text-[#F20D0D]">
                    {product.price.toLocaleString()} ₽
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Или {(product.price / 4).toLocaleString()} ₽ × 4 платежа в
                    сплит
                  </p>
                </div>
              )}
              {product.stock_quantity >= 2 && product.stock_quantity <= 4 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                  <Badge variant="destructive" className="text-xs sm:text-sm">
                    Осталось мало
                  </Badge>
                </div>
              ) : product.stock_quantity === 1 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                  <Badge variant="destructive" className="text-xs sm:text-sm">
                    Осталась 1 шт
                  </Badge>
                </div>
              ) : product.stock_quantity === 0 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="destructive" className="text-xs sm:text-sm">
                    Нет в наличии
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  <AddToCartButton productId={product.id.toString()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Container className="bg-[#F9F8F8] rounded-3xl p-6 sm:p-8 w-full max-w-6xl">
        <Title
          text="Описание"
          className="text-2xl sm:text-3xl font-bold mb-4"
        />
        {product.description.split("\n").map((line: string, index: number) => (
          <p
            key={index}
            className="text-gray-700 text-sm sm:text-base leading-relaxed"
          >
            {line}
          </p>
        ))}

        {Object.keys(product.features).length > 0 && (
          <div className="mt-6">
            <Title
              text="Характеристики"
              className="text-2xl sm:text-3xl font-bold mb-4"
            />
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.features).map(
                    ([key, value]: [string, any], index: number) => {
                      const displayKey =
                        key === "wireless" ? "Беспроводная" : key;
                      const displayValue =
                        key === "wireless" ? (value ? "Да" : "Нет") : value;

                      return (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-2 text-sm sm:text-base text-gray-600 font-medium">
                            {displayKey}
                          </td>
                          <td className="py-2 text-sm sm:text-base text-gray-900 text-right">
                            {displayValue}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
      <ClientReviewSection
        productId={product.id.toString()}
        reviews={reviews}
        hasPurchased={hasPurchased}
        userId={userId}
      />
      <Footer />
    </div>
  );
}
