/* eslint-disable prefer-const */
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Banner {
  _id: string;
  image: string;
  link: string;
  status: "active" | "inactive" | "advertising";
}

interface Props {
  className?: string;
}

export const Banner: React.FC<Props> = ({ className }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/banners");
        if (!response.ok) {
          throw new Error("Не удалось загрузить баннеры");
        }
        const data: Banner[] = await response.json();

        // Фильтруем баннеры: показываем только active и advertising
        const filteredBanners = data.filter(
          (banner) =>
            banner.status === "active" || banner.status === "advertising"
        );

        // Разделяем баннеры на advertising и остальные
        const advertisingBanners = filteredBanners.filter(
          (banner) => banner.status === "advertising"
        );
        const otherBanners = filteredBanners.filter(
          (banner) => banner.status !== "advertising"
        );

        // Выбираем случайный баннер с типом advertising (если есть)
        let selectedBanners: Banner[] = [];
        let used: number[] = [];
        if (advertisingBanners.length > 0) {
          while (used.length < advertisingBanners.length) {
            const randInd = Math.floor(
              Math.random() * advertisingBanners.length
            );
            if (!used.includes(randInd)) {
              selectedBanners.push(advertisingBanners[randInd]);
              used.push(randInd);
            }
          }
        }

        // Выбираем остальные баннеры (до 4, чтобы общее количество было не больше 5)
        const remainingSlots = 5 - selectedBanners.length;
        const shuffledOtherBanners = otherBanners.sort(
          () => Math.random() - 0.5
        );
        const additionalBanners = shuffledOtherBanners.slice(0, remainingSlots);

        selectedBanners = [...selectedBanners, ...additionalBanners];

        setBanners(selectedBanners);
      } catch (error) {
        console.error("Ошибка при загрузке баннеров:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <Container className={cn("p-4 select-none mx-auto w-full", className)}>
      {isLoading ? (
        <Carousel
          className="max-w-[1420px] max-h-[480px]"
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <div>
                  <Card className="w-full aspect-[71/24] bg-gray-200 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : banners.length > 0 ? (
        <Carousel
          className="max-w-[1420px] max-h-[480px]"
          plugins={[plugin.current]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner._id}>
                <div className="relative">
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="w-full aspect-[71/24] overflow-hidden">
                      <Image
                        src={banner.image}
                        alt="Banner"
                        width={1420}
                        height={480}
                        className="w-full h-full object-cover"
                      />
                    </Card>
                  </a>
                  {banner.status === "advertising" && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold">
                      Реклама
                    </Badge>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="text-center text-gray-500">
          Нет доступных баннеров для отображения
        </div>
      )}
    </Container>
  );
};
