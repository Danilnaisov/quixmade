/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { NewsEditor } from "./NewsEditor";

interface News {
  _id?: string;
  slug: string;
  short_name: string;
  short_desc: string;
  content: { type: string; value: string; alt?: string }[];
  image: string;
  date: string;
  tags: string[];
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
    content: news.content || [{ type: "text", value: "" }],
    image: news.image || "",
    date: news.date || new Date().toISOString(),
    tags: news.tags || [],
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

      console.log("Отправляемые данные:", formData);

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
        console.log("Ответ от сервера:", responseData);
        if (responseData.id) {
          setFormData((prev) => ({ ...prev, _id: responseData.id }));
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении новости");
      }

      const savedData = await response.json();
      console.log("Сохраненные данные:", savedData);

      onSave({ ...formData, ...savedData });
    } catch (error) {
      console.error("Ошибка при сохранении новости:", error);
      alert(`Ошибка при сохранении новости: ${error}`);
    }
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData({ ...formData, tags: tagsArray });
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
              step="1"
              value={formatDateForInput(formData.date)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: new Date(e.target.value).toISOString(),
                })
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tags">Теги (через запятую)</Label>
            <Input
              type="text"
              id="tags"
              placeholder="например: технологии, спорт, новости"
              value={formData.tags.join(", ")}
              onChange={handleTagsChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[750px] gap-3">
          <div className="grid w-full items-center gap-1.5">
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
          <div className="grid w-full items-center gap-1.5">
            <Label>Полное описание</Label>
            <NewsEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              slug={formData.slug} // Передаём slug
            />
          </div>

          <div>
            <Label>Изображение обложки</Label>
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
                className="w-full p-2 border rounded mt-2"
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
