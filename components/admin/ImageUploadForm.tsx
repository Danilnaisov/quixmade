"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface ImageUploadFormProps {
  entityType: "news" | "product" | "banner";
  type?: string; // Категория для продуктов, опционально
  slug?: string; // Slug сущности, опционально для баннеров
  onUploadSuccess?: (filePaths: string[]) => void; // Callback для обработки успешной загрузки
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  entityType,
  type,
  slug,
  onUploadSuccess,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  useEffect(() => {
    const uploadImages = async () => {
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const formDataImages = new FormData();
      formDataImages.append("entityType", entityType);
      if (entityType === "product" && type) {
        formDataImages.append("type", type);
      }
      if (entityType !== "banner" && slug) {
        formDataImages.append("slug", slug);
      }
      Array.from(files).forEach((file) => {
        formDataImages.append("file", file);
      });

      try {
        const response = await fetch(
          `https://api.made.quixoria.ru/image-upload`,
          {
            method: "POST",
            body: formDataImages,
          }
        );
        const result = await response.json();

        if (response.ok) {
          if (onUploadSuccess) {
            onUploadSuccess(result.filePaths);
          }
          setFiles(null);
          toast.success("Изображение успешно загружено");
        } else {
          toast.error(`Ошибка: ${result.error}`);
        }
      } catch (error) {
        console.error("Ошибка при загрузке файлов:", error);
        toast.error("Произошла ошибка при загрузке файлов");
      } finally {
        setIsUploading(false);
      }
    };

    uploadImages();
  }, [files, entityType, type, slug, onUploadSuccess]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Выберите изображения:
      </label>
      <input
        type="file"
        multiple={entityType !== "banner"} // Для баннеров только одно изображение
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded mt-1"
        disabled={isUploading}
      />
      {isUploading && <p className="text-sm text-gray-500 mt-1">Загрузка...</p>}
    </div>
  );
};

export default ImageUploadForm;
