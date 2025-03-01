"use client";

import React, { useEffect, useState } from "react";
import { Card } from "./card";
import { Container, SelectCard, CardSkeleton } from "./index";
import { getProducts } from "@/app/api/api_utils";

interface Props {
  category?: string; // Категория (необязательное)
  count?: number; // Количество элементов (необязательное)
  text?: string; // Заголовок (необязательный)
  type?: string; // Тип карточек (необязательный)
}

export const CardList: React.FC<Props> = ({
  category,
  text,
  count = 0,
  type,
}) => {
  const [products, setProducts] = useState<any[]>([]); // Состояние для хранения товаров
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Загружаем товары при монтировании компонента
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
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
    }

    // Если данные еще загружаются, показываем скелетоны
    if (loading) {
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
      {/* Условное отображение заголовка */}
      {text && <h1 className="text-[32px] font-extrabold">{text}</h1>}
      <div className="flex flex-wrap m-auto gap-[10px] justify-left">
        {/* Рендерим карточки */}
        {renderCards()}
      </div>
    </Container>
  );
};
