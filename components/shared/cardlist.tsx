"use client";

import React, { useEffect, useState } from "react";
import { Card } from "./card";
import { Container, SelectCard, CardSkeleton } from "./index";
import {
  getHotProducts,
  getProducts,
  getProductsByCategory,
} from "@/app/api/api_utils";

interface Product {
  _id?: string;
  category_id: string;
  slug: string;
  name: string;
  price: number;
  short_description: string;
  description: string;
  features: Record<string, string | number | boolean>;
  images: string[];
  stock_quantity: number;
  isDiscount: boolean;
  discountedPrice: number;
  isHotHit: boolean;
  category: {
    _id?: string;
    name: string;
  };
}

interface Props {
  category?: string;
  count?: number;
  text?: string;
  type?: string;
}

export const CardList: React.FC<Props> = ({
  category,
  text,
  count = 0,
  type,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data;
        if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getProducts();
        }
        if (type === "hot") {
          data = await getHotProducts();
        }

        const shuffledProducts = [...data].sort(() => Math.random() - 0.5);
        const filteredProducts =
          count > 0 ? shuffledProducts.slice(0, count) : shuffledProducts;

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, count, type]);

  const renderCards = () => {
    if (type === "help") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SelectCard
            text="Полноразмерные клавиатуры"
            ptext="100-90%"
            link=""
            image="/fullsize.png"
          />
          <SelectCard
            text="Компактные варианты"
            ptext="TKL, 60-80%"
            link=""
            image="/compact.png"
          />
          <SelectCard
            text="Дополнительные блоки"
            ptext="Нумпады и макропады"
            link=""
            image="/macro.png"
          />
          <SelectCard
            text="Нестандартные"
            ptext="Сплит, Эрго и другое"
            link=""
            image="/notstandart.png"
          />
        </div>
      );
    }

    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: count || 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <Container className="flex flex-col p-5 gap-4 bg-white rounded-[20px] mt-6 shadow-md">
      {text && (
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          {text}
          {type === "hot"}
        </h1>
      )}
      {renderCards()}
    </Container>
  );
};
