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

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    images: string[];
    onEdit: () => void;
    onDelete: () => void;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md ">
      {/* Изображение */}
      <Image
        src={product.images[0] || "/default-image.jpg"}
        alt={product.name}
        width={1000}
        height={1000}
        className="w-full h-48 object-cover"
      />

      {/* Информация о товаре */}
      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
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
                  Это действие удалит товар. Вы не сможете отменить это
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
