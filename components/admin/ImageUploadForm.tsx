"use client";
import React, { useState } from "react";

interface ImageUploadFormProps {
  onImagesUploaded: (images: string[]) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  onImagesUploaded,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
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
    </div>
  );
};

export default ImageUploadForm;
