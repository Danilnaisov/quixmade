import React from "react";
import { Button } from "@/components/ui/button";

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
    <div className="border rounded-lg overflow-hidden shadow-md">
      {/* Изображение */}
      <img
        src={product.images[0] || "/default-image.jpg"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      {/* Информация о товаре */}
      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <div className="flex justify-between mt-4">
          <Button onClick={onEdit}>Редактировать</Button>
          <Button variant="destructive" onClick={onDelete}>
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};
