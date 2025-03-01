import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Images, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number; // Цена со скидкой (опционально)
  images?: string[]; // Массив ссылок на изображения (опционально)
  isDiscount: boolean; // Есть ли скидка
}

interface CardProps {
  product: Product;
}

export function Card({ product }: CardProps) {
  const {
    category,
    slug,
    name,
    price,
    features,
    discountedPrice,
    images,
    isDiscount,
    stock_quantity,
  } = product;
  return (
    <Link href={`/catalog/${category.name}/${slug}`}>
      <div className="flex flex-col items-left w-[268px] h-[400px] bg-[#fff] p-[10px] justify-between rounded-[10px]">
        <div className="flex flex-col items-left gap-[10px]">
          <div>
            <div className="absolute flex flex-col items-start justify-between w-[248px] h-[248px] p-[10px]">
              <div className="flex flex-col items-start gap-[5px]">
                {features.wireless && (
                  <Badge className="rounded-[15px] w-[auto] h-[27px] text-center p-[6px] bg-[#274c5b] text-[#fff] cursor-default text-[15px] outline-none">
                    Wireless
                  </Badge>
                )}
                {stock_quantity <= 0 && (
                  <Badge className="rounded-[15px] w-[auto] h-[27px] text-center p-[12px] bg-[#f5f5f5] text-[#274c5b] cursor-default text-[15px] outline-none">
                    Нет в наличии
                  </Badge>
                )}
              </div>
              {isDiscount && (
                <Badge className="absolute top-2 right-2 rounded-[15px] px-[7px] py-[4px] bg-[#efd372] text-[#274c5b] font-medium">
                  Sale
                </Badge>
              )}
            </div>
            {images && images.length > 0 ? (
              <img
                src={images[0]}
                alt={name}
                className="w-[248px] h-[248px] rounded-[10px] object-cover"
              />
            ) : (
              <Skeleton className="w-[248px] h-[248px] rounded-[10px] flex justify-center items-center">
                <Images color="#333" size={64} />
              </Skeleton>
            )}
          </div>
          <div className="flex gap-[8px] text-[18px] font-medium">
            {isDiscount ? (
              <>
                <h2 className="text-[18px] font-[700] text-[#F20D0D]">
                  {discountedPrice.toLocaleString()} ₽
                </h2>
                <h2 className="line-through text-[13px] font-[700] text-[#274C5B]">
                  {price.toLocaleString()} ₽
                </h2>
              </>
            ) : (
              <h2 className="text-[18px] font-[700] text-[#F20D0D]">
                {price.toLocaleString()} ₽
              </h2>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[5px] text-[18px] font-medium">
          <h2>{name}</h2>
          <div className="flex gap-[5px] text-[18px] font-medium">
            <Star color="#ff9d00" fill="#ff9d00" />
            <h2>4.4</h2>
          </div>
        </div>
      </div>
    </Link>
  );
}
