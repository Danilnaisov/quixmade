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
  });

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <Image
        src={news.image || "/default-image.jpg"}
        alt={news.short_name}
        width={300}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate">{news.short_name}</h3>
        <p className="text-sm text-gray-500">{formattedDate}</p>
        <div className="flex justify-between mt-4 gap-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Редактировать
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1">
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены? Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600"
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
