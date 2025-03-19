import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import Image from "next/image";

interface NewsCardProps {
  news: {
    _id: string;
    short_name: string;
    image: string;
    date: string;
    tags: [];
    onEdit: () => void;
    onDelete: () => void;
  };
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(news.date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Image
        src={news.image || "/default-image.jpg"}
        alt={news.short_name}
        width={1000}
        height={1000}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold">{news.short_name}</h3>
        <p className="text-xs text-gray-400">{formattedDate}</p>
        <div className="flex justify-between mt-4">
          <Button onClick={onEdit}>Редактировать</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Удалить</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие удалит новость. Вы не сможете отменить это
                  действие.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-400"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
