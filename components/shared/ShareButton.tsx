"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  slug: string;
}

export const ShareButton = ({ slug }: ShareButtonProps) => {
  const handleShare = () => {
    const url = `${window.location.origin}/news/${slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast("Ссылка скопирована!", {
          description: "Ссылка на новость успешно скопирована в буфер обмена.",
          duration: 3000,
        });
      })
      .catch((err) => {
        toast("Ошибка", {
          description: "Не удалось скопировать ссылку.",
        });
        console.error("Ошибка при копировании:", err);
      });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 size={16} className="mr-2" />
      Поделиться
    </Button>
  );
};
