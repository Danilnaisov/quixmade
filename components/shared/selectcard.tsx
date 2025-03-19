"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  text?: string;
  ptext?: string;
  image?: string;
  link: string;
}

export const SelectCard: React.FC<Props> = ({ text, ptext, link, image }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={link} passHref>
      <div className="select-card flex flex-col items-start bg-white p-4 rounded-[10px] shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full">
        <div className="relative w-full aspect-[4/3]">
          {image && !imageError ? (
            <Image
              src={image}
              alt={text || "image"}
              fill
              className="rounded-[10px] object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Skeleton className="w-full h-full rounded-[10px] flex justify-center items-center">
              <Images color="#333" size={64} />
            </Skeleton>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <h2 className="text-lg font-bold text-gray-900">{text}</h2>
          <p className="text-sm text-gray-600">{ptext}</p>
        </div>
      </div>
    </Link>
  );
};
