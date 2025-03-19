"use client"; // Обозначаем, что это клиентский компонент

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface RenderHtmlProps {
  html: string;
}

export const RenderHtml: React.FC<RenderHtmlProps> = ({ html }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");

  useEffect(() => {
    // Нормализуем HTML, убирая лишние пробелы и переносы строк
    const normalizedHtml = html.replace(/\s+/g, " ").trim();
    // Очищаем HTML с помощью DOMPurify
    const cleanHtml = DOMPurify.sanitize(normalizedHtml);
    setSanitizedHtml(cleanHtml);
  }, [html]);

  return (
    <div
      className="prose prose-lg text-gray-700 leading-relaxed"
      style={{ whiteSpace: "pre-wrap" }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
