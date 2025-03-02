import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

interface Feature {
  label: string;
  value: string | number | boolean;
  type: "string" | "int" | "bool";
}

interface Category {
  _id: string;
  name_ru: string;
}

interface EditProductFormProps {
  product: any;
  categories: Category[];
  onSave: (updatedProduct: any) => void;
  onCancel: () => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  categories,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    _id: product._id || "",
    category_id:
      typeof product.category === "object"
        ? product.category?._id || ""
        : product.category_id || "",
    slug: product.slug || "",
    name: product.name || "",
    price: product.price,
    short_description: product.short_description || "",
    description: product.description || "",
    features: Array.isArray(product.features)
      ? product.features
      : Object.entries(product.features || {}).map(([key, value]) => ({
          label: key,
          value: value,
          type:
            typeof value === "boolean"
              ? "bool"
              : typeof value === "number"
              ? "int"
              : "string",
        })),
    images: Array.isArray(product.images) ? product.images : [],
    stock_quantity: product.stock_quantity || 0,
    isDiscount: product.isDiscount || false,
    discountedPrice: product.discountedPrice || 0,
    isHotHit: product.isHotHit || false,
  });

  const [openCategory, setOpenCategory] = useState(false);

  const handleFeatureChange = (index: number, field: string, value: any) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field as keyof Feature] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        { label: "", value: "", type: "string" },
      ],
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async () => {
    try {
      // Преобразуем массив features обратно в объект
      const formattedFeatures = formData.features.reduce((acc, feature) => {
        acc[feature.label] = feature.value;
        return acc;
      }, {} as Record<string, string | number | boolean>);

      const updatedProduct = {
        ...formData,
        category_id: formData.category_id, // Используем category_id
        features: formattedFeatures,
      };

      let response;

      if (updatedProduct._id) {
        // Исключаем _id из данных перед отправкой
        const { _id, ...productData } = updatedProduct;

        // Обновление существующего товара
        response = await fetch(`/api/products/id/${updatedProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Добавление нового товара
        const { _id, ...newProductData } = updatedProduct; // Исключаем _id, если он пустой

        response = await fetch("/api/products/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProductData),
        });

        // Получаем сгенерированный _id из ответа сервера
        const responseData = await response.json();
        if (responseData.success) {
          updatedProduct._id = responseData._id; // Добавляем _id к новому товару
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении товара");
      }

      onSave(updatedProduct);
    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      // alert("Произошла ошибка при сохранении товара");
      toast(`"Ошибка при сохранении товара:", ${error}`);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">
        {formData._id ? "Редактирование товара" : "Добавление товара"}
      </h2>
      <form className="space-y-4 mt-4 flex gap-5">
        {/* Выбор категории */}
        <div className="flex flex-col w-[550px] gap-3">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Категория</label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCategory}
                  className="w-full justify-between"
                >
                  {formData.category_id
                    ? categories.find(
                        (category) => category._id === formData.category_id
                      )?.name_ru
                    : "Выберите категорию..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command>
                  <CommandInput placeholder="Поиск категории..." />
                  <CommandEmpty>Категория не найдена.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category._id}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            category_id: category._id,
                          });
                          setOpenCategory(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.category_id === category._id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {category.name_ru}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              id="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Название</Label>
            <Input
              type="text"
              id="name"
              placeholder="Название"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="price">Цена</Label>
            <Input
              type="number"
              id="price"
              placeholder="Цена"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>

          {/* Характеристики */}
          <div className="flex flex-col gap-2 ">
            <h3 className="font-bold">Характеристики</h3>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-center">
                {/* Поле для названия характеристики */}
                <input
                  type="text"
                  placeholder="Название характеристики"
                  value={feature.label}
                  onChange={(e) =>
                    handleFeatureChange(index, "label", e.target.value)
                  }
                  className="w-40 p-2 border rounded"
                />

                {/* Выбор типа характеристики */}
                <select
                  value={feature.type}
                  onChange={(e) =>
                    handleFeatureChange(index, "type", e.target.value)
                  }
                  className="w-32 p-2 border rounded"
                >
                  <option value="string">Строка</option>
                  <option value="int">Число</option>
                  <option value="bool">Лог</option>
                </select>

                {/* Поле для значения характеристики */}
                {feature.type === "bool" ? (
                  // Чекбокс для логического типа
                  <input
                    type="checkbox"
                    checked={Boolean(feature.value)} // Преобразуем значение в булевый тип
                    onChange={(e) =>
                      handleFeatureChange(index, "value", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                ) : (
                  // Обычное текстовое или числовое поле
                  <input
                    type={feature.type === "int" ? "number" : "text"}
                    placeholder="Значение"
                    value={feature.value}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        "value",
                        feature.type === "int"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                    className="w-40 p-2 border rounded"
                  />
                )}

                {/* Кнопка удаления характеристики */}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-blue-500 hover:text-blue-700 mt-2"
            >
              + Добавить характеристику
            </button>
          </div>
          <div>
            <label htmlFor=""> Количество на складе </label>
            <input
              type="number"
              placeholder="Количество на складе"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_quantity: Number(e.target.value),
                })
              }
              className="w-[55px] p-2 border rounded"
            />
          </div>

          {/* Скидка */}
          <div className="flex items-center gap-2">
            <label>
              <input
                type="checkbox"
                checked={formData.isDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, isDiscount: e.target.checked })
                }
                className="mr-2"
              />
              Скидка
            </label>
            {formData.isDiscount && (
              <input
                type="number"
                placeholder="Цена со скидкой"
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountedPrice: Number(e.target.value),
                  })
                }
                className="w-[90px] p-2 border rounded"
              />
            )}
          </div>

          {/* Хит продаж */}
          <div className="flex items-center gap-2">
            <label>
              <input
                type="checkbox"
                checked={formData.isHotHit}
                onChange={(e) =>
                  setFormData({ ...formData, isHotHit: e.target.checked })
                }
                className="mr-2"
              />
              Хит продаж
            </label>
          </div>
        </div>
        <div className="flex flex-col w-[500px] gap-3">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="short_description">Краткое описание</Label>
            <Textarea
              className="h-[70px]"
              id="short_description"
              placeholder="Краткое описание"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Полное описание</Label>
            <Textarea
              className="h-[120px]"
              id="description"
              placeholder="Полное описание"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Картинки */}
          <div>
            <h3 className="font-bold">Картинки</h3>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ссылка на картинку"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-64 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="text-blue-500 hover:text-blue-700 mt-2"
            >
              + Добавить картинку
            </button>
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
