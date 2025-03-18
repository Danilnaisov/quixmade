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

interface Props {
  className?: string;
  pageName: string;
  count: number;
}
export const Banner: React.FC<Props> = ({ className, count }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Container className={cn("p-4 select-none mx-auto w-full", className)}>
      <Carousel
        className="max-w-[1420px] max-h-[480px]"
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {Array.from({ length: count }).map((_, index) => (
            <CarouselItem key={index}>
              <div>
                <Card className="bg-[#717171] bg-[url('/Frame5.png')] w-full bg-cover aspect-[71/24] "></Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};
