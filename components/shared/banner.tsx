"use client";

import * as React from "react";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Container } from "./container";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  pageName: string;
  count: number;
}
export const Banner: React.FC<Props> = ({ className, pageName, count }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Container className={cn("p-4 select-none", className)}>
      <Carousel
        className="mx-auto max-w-[1420px] max-h-[480px]"
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {Array.from({ length: count }).map((_, index) => (
            <CarouselItem key={index}>
              <div>
                <Card className="bg-[#717171] bg-[url('/Frame5.png')] w-full bg-center">
                  <CardContent className="w-full aspect-[71/24] flex flex-col gap-[50px] items-center justify-center p-6 mx-auto">
                    <div className="flex flex-col gap-1 items-center text-white">
                      <h1 className="text-4xl font-extrabold">Akko MU01</h1>
                      <p className="text-xl font-medium text-center max-w-[70%]">
                        Эта клавиатура, вдохновленная сезонными пейзажами, имеет
                        глубокую текстуру древесины, которая дополняет тонкие
                        оттенки, обеспечивая теплое визуальное восприятие.
                        Идеально подходит для дома или офиса, он привносит
                        осенний спокойствие и уют в вашу работу и жизнь.
                      </p>
                    </div>
                    <Button className="bg-white h-[45px] text-[#274C5B] text-[15px] font-[700] hover:bg-[#274C5B] hover:text-white">
                      Посмотреть
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};
