import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image"; // Импортируем Image из next/image
import { getProductBySlug } from "@/app/api/api_utils";
import { Skeleton } from "../ui/skeleton";
import { Images } from "lucide-react";

interface Props {
  className?: string;
  slug: string;
}

export const ProductPhotos: React.FC<Props> = async ({ className, slug }) => {
  const product = await getProductBySlug(slug);
  // Если изображений нет, показываем заглушку
  if (!product || !product.images || product.images.length === 0) {
    return (
      <Skeleton className="w-[584px] h-[329px] rounded-[10px] flex justify-center items-center">
        <Images color="#333" size={64} />
      </Skeleton>
    );
  }

  return (
    <Carousel
      className={`w-[584px]`}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {product.images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="bg-[#717171] w-full h-full overflow-hidden">
                <CardContent className="w-full aspect-[16/9] relative">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
