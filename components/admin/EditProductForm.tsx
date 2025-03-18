/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "../ui/switch";
import Image from "next/image";

interface Feature {
  label: string;
  value: string | number | boolean;
  type: "string" | "int" | "bool";
}

interface Category {
  _id: string;
  name_ru: string;
}

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
  };
}

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onSave: (updatedProduct: Product) => void;
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
    images: Array.isArray(product.images) ? product.images : [],
    stock_quantity: product.stock_quantity || 0,
    isDiscount: product.isDiscount || false,
    discountedPrice: product.discountedPrice || 0,
    isHotHit: product.isHotHit || false,
  });

  const [openCategory, setOpenCategory] = useState(false);

  const handleFeatureChange = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
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

  const removeImage = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedFeatures = formData.features.reduce((acc, feature) => {
        acc[feature.label] = feature.value;
        return acc;
      }, {} as Record<string, string | number | boolean>);

      const updatedProduct = {
        ...formData,
        features: formattedFeatures,
      };

      let response;

      if (updatedProduct._id) {
        const { _id, ...productData } = updatedProduct;
        response = await fetch(`/api/products/id/${updatedProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      } else {
        const { _id, ...newProductData } = updatedProduct;
        response = await fetch("/api/products/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProductData),
        });

        const responseData = await response.json();
        if (responseData.success) {
          updatedProduct._id = responseData._id;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении товара");
      }

      onSave(updatedProduct);
    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      alert(`Ошибка при сохранении товара: ${error}`);
    }
  };

  const API_URL = "https://api.made.quixoria.ru";
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const formDataImages = new FormData();
    formDataImages.append("entityType", "product"); // Указываем, что это продукт
    formDataImages.append(
      "type",
      categories.find((cat) => cat._id === formData.category_id)?.name_ru || ""
    ); // Категория как type
    formDataImages.append("slug", formData.slug);
    Array.from(files).forEach((file) => {
      formDataImages.append("file", file);
    });

    try {
      const response = await fetch(`${API_URL}/image-upload`, {
        method: "POST",
        body: formDataImages,
      });
      const result = await response.json();

      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          images: [...prevData.images, ...result.filePaths],
        }));
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">
        {formData._id ? "Редактирование товара" : "Добавление товара"}
      </h2>
      <div className="space-y-4 mt-4 flex gap-5">
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
              required
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
              required
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

          <div className="flex flex-col gap-2">
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
                  <option value="bool">Лог</option>
                </select>
                {feature.type === "bool" ? (
                  <Switch
                    checked={Boolean(feature.value)}
                    onCheckedChange={(checked) =>
                      handleFeatureChange(index, "value", checked)
                    }
                  />
                ) : (
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

          <div className="flex items-center gap-2 h-[25px]">
            <label className="flex items-center gap-2">
              <Switch
                checked={formData.isDiscount}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDiscount: checked })
                }
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
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <Switch
                checked={formData.isHotHit}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isHotHit: checked })
                }
              />
              Хит продаж
            </label>
          </div>
        </div>
        <div className="flex flex-col w-[550px] gap-3">
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

          <div>
            <Label>Изображения</Label>
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative border rounded-xl">
                    <Image
                      src={image}
                      alt={`Preview ${index}`}
                      width={1000}
                      height={1000}
                      className="w-[200px] h-[200px] object-contain"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 text-red-500"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => e.preventDefault()}
              encType="multipart/form-data"
            >
              <input
                type="file"
                multiple
                onChange={(e) => {
                  e.preventDefault();
                  handleImageUpload(e.target.files);
                }}
                className="w-full p-2 border rounded"
              />
            </form>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
