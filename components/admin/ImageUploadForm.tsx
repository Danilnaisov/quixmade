"use client";
import React, { useState } from "react";

interface ImageUploadFormProps {
  entityType: "news" | "product"; // Определяет, что загружается (новость или товар)
  type?: string; // Категория для продуктов, опционально
  slug: string; // Slug сущности
  onUploadSuccess?: (filePaths: string[]) => void; // Callback для обработки успешной загрузки
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  entityType,
  type,
  slug,
  onUploadSuccess,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleImageUpload = async () => {
    if (!files || files.length === 0) return;

    const formDataImages = new FormData();
    formDataImages.append("entityType", entityType);
    if (entityType === "product" && type) {
      formDataImages.append("type", type); // Добавляем тип только для продуктов
    }
    formDataImages.append("slug", slug);
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
        setFiles(null); // Сбрасываем состояние после успешной загрузки
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    }
  };

  return (
    <div>
      <label className="block">Select Images:</label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />
      {files && files.length > 0 && (
        <button
          onClick={handleImageUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Images
        </button>
      )}
    </div>
  );
};

export default ImageUploadForm;
