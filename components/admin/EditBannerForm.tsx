/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadForm from "./ImageUploadForm";

interface Banner {
  _id?: string;
  image: string;
  link: string;
  status: "active" | "inactive" | "advertising";
}

interface EditBannerFormProps {
  banner: Banner;
  onSave: (updatedBanner: Banner) => void;
  onCancel: () => void;
}

export const EditBannerForm: React.FC<EditBannerFormProps> = ({
  banner,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    _id: banner._id || "",
    image: banner.image || "",
    link: banner.link || "",
    status: banner.status || "active",
  });

  const handleImageUploadSuccess = (filePaths: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      image: filePaths[0],
    }));
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (formData._id) {
        const { _id, ...bannerData } = formData;
        response = await fetch(`/api/banners/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bannerData),
        });
      } else {
        const { _id, ...newBannerData } = formData;
        response = await fetch("/api/banners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBannerData),
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Ошибка при сохранении баннера");
      }

      if (!formData._id && responseData.id) {
        setFormData((prev) => ({ ...prev, _id: responseData.id }));
      }

      onSave({ ...formData, ...responseData });
    } catch (error) {
      console.error("Ошибка при сохранении баннера:", error);
      alert(`Ошибка при сохранении баннера: ${error}`);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">
        {formData._id ? "Редактирование баннера" : "Добавление баннера"}
      </h2>
      <div className="space-y-4 mt-4 flex gap-5">
        <div className="flex flex-col w-[550px] gap-3">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="link">Ссылка</Label>
            <Input
              type="text"
              id="link"
              required
              placeholder="Введите ссылку"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "active" | "inactive" | "advertising",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="inactive">Неактивен</SelectItem>
                <SelectItem value="advertising">Реклама</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col w-[550px] gap-3">
          <div>
            <Label>Изображение</Label>
            {formData.image && (
              <div className="relative border rounded-xl">
                <Image
                  src={formData.image}
                  alt="Banner Image"
                  width={1000}
                  height={1000}
                  className="w-[200px] h-[200px] object-contain"
                />
                <Button
                  variant="ghost"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="absolute top-1 right-1 text-red-500"
                >
                  ✕
                </Button>
              </div>
            )}
            <ImageUploadForm
              entityType="banner"
              onUploadSuccess={handleImageUploadSuccess}
            />
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
