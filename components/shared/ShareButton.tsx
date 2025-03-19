"use client"; // Клиентский компонент

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  slug: string;
  type: "news" | "product";
  category?: string; // Опционально для продуктов
}

export const ShareButton = ({ slug, type, category }: ShareButtonProps) => {
  const handleShare = () => {
    const origin = window.location.origin;
    const link =
      type === "news"
        ? `${origin}/news/${slug}`
        : `${origin}/catalog/${category}/${slug}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Ссылка скопирована!", {
          description: "Ссылка успешно скопирована в буфер обмена.",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Ошибка копирования: ", err);
        toast.error("Ошибка", {
          description: "Не удалось скопировать ссылку.",
          duration: 3000,
        });
      });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share2 size={16} />
      Поделиться
    </Button>
  );
};
