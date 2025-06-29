import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { getProductBySlug } from "@/app/api/api_utils";
import { Skeleton } from "../ui/skeleton";
import { Images } from "lucide-react";

interface Props {
  className?: string;
  slug: string;
}

export const ProductPhotos: React.FC<Props> = async ({ slug }) => {
  const product = await getProductBySlug(slug);
  // Если изображений нет, показываем заглушку
  if (!product || !product.images || product.images.length === 0) {
    return (
      <Skeleton className="ProductPhotosSkeleton w-[620px] h-[620px] rounded-[10px] flex justify-center items-center">
        <Images color="#333" size={64} />
      </Skeleton>
    );
  }

  return (
    <Carousel
      className={`ProductPhotosCarousel w-[620px]`}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {product.images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="bg-[#fff] w-full h-full overflow-hidden">
                <CardContent className="w-full aspect-[1/1] relative">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    title={`Product image ${index + 1}`}
                    width={1000}
                    height={1000}
                    className="object-contain w-full h-full"
                  />
                </CardContent>
              </Card>
            </div>
            <p className="text-center font-semibold">
              {index + 1} / {product.images.length}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
