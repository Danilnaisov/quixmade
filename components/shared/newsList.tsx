"use client";

import { useEffect, useState } from "react";
import { getAllNews } from "@/app/api/api_utils";
import { Container } from "./container";
import { NewsCard } from "./newsCard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        const sortedNews = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNews(sortedNews);
      } catch (err) {
        console.error("Ошибка при получении новостей:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-xl text-gray-600">Загрузка новостей...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!news || news.length === 0) {
    return (
      <Alert className="max-w-md mx-auto mt-10">
        <AlertTitle>Новости не найдены</AlertTitle>
        <AlertDescription>Пока нет доступных новостей.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
      {news.map((item) => (
        <NewsCard
          key={item.slug}
          title={item.short_name}
          description={item.short_desc}
          imageUrl={item.image}
          slug={item.slug}
          date={item.date}
          tags={item.tags}
        />
      ))}
    </Container>
  );
};
