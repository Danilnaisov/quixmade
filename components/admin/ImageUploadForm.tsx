"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadFormProps {
  entityType: "news" | "product" | "banner" | "review";
  type?: string; // Категория для продуктов, опционально
  slug?: string; // Slug сущности, опционально для баннеров и продуктов
  productId?: string; // Для отзывов
  userId?: string; // Для отзывов
  onUploadSuccess?: (filePaths: string[]) => void; // Callback для обработки успешной загрузки
  initialImages?: string[]; // Начальные изображения (для редактирования)
}

const MAX_IMAGES = 10;

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  entityType,
  type,
  slug,
  productId,
  userId,
  onUploadSuccess,
  initialImages = [],
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = uploadedImages.length + newFiles.length;

      if (totalImages > MAX_IMAGES && entityType == "review") {
        toast.error(
          `Максимум ${MAX_IMAGES} изображений. Вы пытаетесь загрузить ${totalImages}.`
        );
        return;
      }

      setFiles(e.target.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (onUploadSuccess) {
      onUploadSuccess(uploadedImages.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const uploadImages = async () => {
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const formDataImages = new FormData();
      formDataImages.append("entityType", entityType);

      if (entityType === "product") {
        if (!type || !slug) {
          toast.error("Missing required fields: type or slug");
          setIsUploading(false);
          return;
        }
        formDataImages.append("type", type);
        formDataImages.append("slug", slug);
      } else if (entityType === "review") {
        if (!productId || !userId) {
          toast.error("Missing required fields: productId or userId");
          setIsUploading(false);
          return;
        }
        formDataImages.append("productId", productId);
        formDataImages.append("userId", userId);
      } else if (entityType !== "banner" && slug) {
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
          const newImages = [...uploadedImages, ...result.filePaths];
          setUploadedImages(newImages);
          if (onUploadSuccess) {
            onUploadSuccess(newImages);
          }
          setFiles(null);
          toast.success("Изображения успешно загружены");
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
  }, [
    files,
    entityType,
    type,
    slug,
    productId,
    userId,
    onUploadSuccess,
    uploadedImages,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-gray-700">
        Загрузить изображения:
      </label>
      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative border rounded-xl">
              <Image
                src={image}
                alt={`Review image ${index}`}
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-cover"
              />
              <Button
                variant="ghost"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 text-red-500"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        multiple={entityType !== "banner"}
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
