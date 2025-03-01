"use client";

import React from "react";
import { Input } from "../ui/input";
import { RangeSlider, CheckboxFiltersGroup, Title } from "./";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Верхние чекбоксы */}

      <CheckboxFiltersGroup
        title="Беспроводной режим"
        name="itemWireless"
        items={[
          { text: "2.4 ГГц", value: "1" },
          { text: "Bluetooth", value: "2" },
          { text: "Нет", value: "3" },
        ]}
        className="mb-5"
      />
      <CheckboxFiltersGroup
        title="Состояние"
        name="itemState"
        items={[
          { text: "Новое", value: "1" },
          { text: "Б/у", value: "2" },
          { text: "Под заказ", value: "3" },
        ]}
        className="mb-5"
      />
      {/* Фильтр цен */}
      {/* <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={100}
            max={1000}
            placeholder="1000"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[
            filters.prices.priceFrom || 0,
            filters.prices.priceTo || 1000,
          ]}
          onValueChange={updatePrices}
        />
      </div>

      <CheckboxFiltersGroup
        title="Ингредиенты"
        name="ingredients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
      /> */}
    </div>
  );
};
