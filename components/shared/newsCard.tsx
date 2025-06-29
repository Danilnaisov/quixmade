import Image from "next/image";
import { Title } from "@/components/shared";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  date: string;
  tags: string[];
  className?: string;
}

export const NewsCard = ({
  title,
  description,
  imageUrl,
  slug,
  date,
  tags,
  className = "",
}: NewsCardProps) => {
  const formattedDate = new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/news/${slug}`} className="group block px-4 max-w-[1000px]">
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      >
        <div className="relative w-full h-[300px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            title={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <Badge className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white">
            Новости
          </Badge>
        </div>
        <div className="p-5">
          <Title
            text={title}
            size="lg"
            className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200"
          />
          <p className="text-gray-700 text-sm line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:underline">
              <span>Читать далее</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
