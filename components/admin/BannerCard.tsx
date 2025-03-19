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
import { Badge } from "@/components/ui/badge";

interface BannerCardProps {
  banner: {
    _id: string;
    image: string;
    link: string;
    status: "active" | "inactive" | "advertising";
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <Image
        src={banner.image || "/default-image.jpg"}
        alt="Banner"
        width={300}
        height={150}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate">Баннер</h3>
        <p className="text-sm text-gray-500 truncate">Ссылка: {banner.link}</p>
        <Badge
          className={
            banner.status === "advertising"
              ? "bg-yellow-500 text-white"
              : banner.status === "active"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }
        >
          {banner.status === "advertising"
            ? "Реклама"
            : banner.status === "active"
            ? "Активен"
            : "Неактивен"}
        </Badge>
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
                <AlertDialogTitle>Удалить баннер?</AlertDialogTitle>
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
