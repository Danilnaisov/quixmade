// components/shared/NewsCard.tsx
import Image from "next/image";
import { Title } from "@/components/shared";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  date: string;
  className?: string;
}

export const NewsCard = ({
  title,
  description,
  imageUrl,
  slug,
  date,
  className = "",
}: NewsCardProps) => {
  // Форматируем дату без секунд
  const formattedDate = new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/news/${slug}`} className="px-4 max-w-[1000px]">
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
      >
        <div className="relative w-full h-[400px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="p-4">
          <Title
            text={title}
            size="sm"
            className="font-bold text-gray-800 mb-2 line-clamp-2"
          />
          <p className="text-gray-600 text-sm line-clamp-3 mb-2">
            {description}
          </p>
          <div className="text-xs text-gray-400">{formattedDate}</div>
        </div>
      </div>
    </Link>
  );
};
