/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

interface News {
  _id?: string;
  slug: string;
  short_name: string;
  short_desc: string;
  desc: string;
  image: string;
  date: string;
}

interface EditNewsFormProps {
  news: News;
  onSave: (updatedNews: News) => void;
  onCancel: () => void;
}

export const EditNewsForm: React.FC<EditNewsFormProps> = ({
  news,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    _id: news._id || "",
    slug: news.slug || "",
    short_name: news.short_name || "",
    short_desc: news.short_desc || "",
    desc: news.desc || "",
    image: news.image || "",
    date: news.date || new Date().toISOString(),
  });

  const API_URL = "https://api.made.quixoria.ru";
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const formDataImages = new FormData();
    formDataImages.append("entityType", "news");
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
          image: result.filePaths[0],
        }));
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    }
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (formData._id) {
        const { _id, ...newsData } = formData;
        response = await fetch(`/api/news?slug=${formData.slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newsData),
        });
      } else {
        const { _id, ...newNewsData } = formData;
        response = await fetch("/api/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNewsData),
        });

        const responseData = await response.json();
        if (responseData.id) {
          formData._id = responseData.id;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении новости");
      }

      onSave(formData);
    } catch (error) {
      console.error("Ошибка при сохранении новости:", error);
      alert(`Ошибка при сохранении новости: ${error}`);
    }
  };

  // Форматируем дату для input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Убираем миллисекунды и Z
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">
        {formData._id ? "Редактирование новости" : "Добавление новости"}
      </h2>
      <div className="space-y-4 mt-4 flex gap-5">
        <div className="flex flex-col w-[550px] gap-3">
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
            <Label htmlFor="short_name">Краткое название</Label>
            <Input
              type="text"
              id="short_name"
              required
              placeholder="Краткое название"
              value={formData.short_name}
              onChange={(e) =>
                setFormData({ ...formData, short_name: e.target.value })
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="date">Дата</Label>
            <Input
              type="datetime-local"
              id="date"
              step="1" // Добавляем шаг в 1 секунду
              value={formatDateForInput(formData.date)} // Форматируем дату для input
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: new Date(e.target.value).toISOString(),
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col w-[550px] gap-3">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="short_desc">Краткое описание</Label>
            <Textarea
              className="h-[70px]"
              id="short_desc"
              placeholder="Краткое описание"
              value={formData.short_desc}
              onChange={(e) =>
                setFormData({ ...formData, short_desc: e.target.value })
              }
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="desc">Полное описание</Label>
            <Textarea
              className="h-[120px]"
              id="desc"
              placeholder="Полное описание"
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Изображение</Label>
            {formData.image && (
              <div className="relative border rounded-xl">
                <Image
                  src={formData.image}
                  alt="News Image"
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
            <form
              onSubmit={(e) => e.preventDefault()}
              encType="multipart/form-data"
            >
              <input
                type="file"
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
