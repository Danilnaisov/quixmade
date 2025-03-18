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
      <div className="select_card flex flex-col items-left w-[336.5px] h-[430px] bg-[#fff] p-[10px] justify-between rounded-[10px]">
        <div className="flex flex-col items-left gap-[5px]">
          <div>
            {image && !imageError ? (
              <Image
                src={image}
                alt="image"
                width={318}
                height={318}
                onError={() => setImageError(true)}
                className="rounded-[10px]"
              />
            ) : (
              <Skeleton className="w-[318px] h-[318px] rounded-[10px] flex justify-center items-center">
                <Images color="#333" size={64} />
              </Skeleton>
            )}
          </div>
          <h2 className="text-[20px] font-bold text-[#274C5B]">{text}</h2>
        </div>
        <div className="flex flex-col gap-[5px] text-[16px] font-medium">
          <p>{ptext}</p>
        </div>
      </div>
    </Link>
  );
};
