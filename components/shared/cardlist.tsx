"use client";

import React, { useEffect, useState } from "react";
import { Card } from "./card";
import { Container, SelectCard, CardSkeleton } from "./index";
import {
  getHotProducts,
  getProducts,
  getProductsByCategory,
} from "@/app/api/api_utils";

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
  const [products, setProducts] = useState<any[]>([]);
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
        let filteredProducts = data;

        // Ограничение количества товаров (если указано)
        if (count > 0) {
          filteredProducts = filteredProducts.slice(0, count);
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, count]);

  const renderCards = () => {
    if (type === "help") {
      // Рендерим SelectCard, если тип "help"
      return (
        <>
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
        </>
      );
    } else if (type === "hot") {
    }
    if (loading) {
      // Если данные еще загружаются, показываем скелетоны
      return Array.from({ length: count || 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ));
    }

    // Рендерим карточки товаров
    return products.map((product) => (
      <Card key={product.id} product={product} />
    ));
  };

  return (
    <Container className="flex flex-col p-[20px] gap-[10px] bg-[#f5f5f5] justify-left rounded-[20px] mt-6">
      {text && <h1 className="text-[32px] font-extrabold">{text}</h1>}
      <div className="flex flex-wrap m-auto gap-[10px] justify-left">
        {renderCards()}
      </div>
    </Container>
  );
};
