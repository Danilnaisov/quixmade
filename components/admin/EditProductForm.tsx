import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ObjectId } from "mongodb";

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
  categories: Category[]; // Список категорий
  onSave: (updatedProduct: any) => void;
  onCancel: () => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  categories,
  onSave,
  onCancel,
}) => {
  // Убедитесь, что features всегда является массивом
  const [formData, setFormData] = useState({
    _id: product._id || "",
    category_id:
      typeof product.category === "object"
        ? product.category?._id || ""
        : product.category_id || "",
    slug: product.slug || "",
    sku: product.sku || "",
    name: product.name || "",
    price: product.price || 0,
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
    images: product.images || [],
    stock_quantity: product.stock_quantity || 0,
    isDiscount: product.isDiscount || false,
    discountedPrice: product.discountedPrice || 0,
    isHotHit: product.isHotHit || false,
  });

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
        response = await fetch(`/api/products/id${updatedProduct._id}`, {
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

      onSave(updatedProduct); // Обновляем состояние товаров
    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      alert("Произошла ошибка при сохранении товара");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">
        {formData._id ? "Редактирование товара" : "Добавление товара"}
      </h2>
      <form className="space-y-4 mt-4">
        {/* Выпадающий список категорий */}
        <select
          value={formData.category_id}
          onChange={(e) =>
            setFormData({ ...formData, category_id: e.target.value })
          }
          className="w-full p-2 border rounded"
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name_ru}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="SKU"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Название"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Цена"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Краткое описание"
          value={formData.short_description}
          onChange={(e) =>
            setFormData({ ...formData, short_description: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Полное описание"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border rounded h-32"
        />

        {/* Характеристики */}
        <div>
          <h3 className="font-bold">Характеристики</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Название характеристики"
                value={feature.label}
                onChange={(e) =>
                  handleFeatureChange(index, "label", e.target.value)
                }
                className="w-40 p-2 border rounded"
              />
              <select
                value={feature.type}
                onChange={(e) =>
                  handleFeatureChange(index, "type", e.target.value)
                }
                className="w-32 p-2 border rounded"
              >
                <option value="string">Строка</option>
                <option value="int">Число</option>
                <option value="bool">Логическое</option>
              </select>
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
                      : feature.type === "bool"
                      ? e.target.value === "true"
                      : e.target.value
                  )
                }
                className="w-40 p-2 border rounded"
              />
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

        {/* Картинки */}
        <input
          type="text"
          placeholder="Ссылка на картинку"
          value={formData.images[0]}
          onChange={(e) =>
            setFormData({
              ...formData,
              images: [e.target.value],
            })
          }
          className="w-full p-2 border rounded"
        />

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
          className="w-full p-2 border rounded"
        />

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
              className="p-2 border rounded"
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

        {/* Кнопки управления */}
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </div>
      </form>
    </div>
  );
};
