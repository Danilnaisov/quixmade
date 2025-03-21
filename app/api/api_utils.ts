"use server";

import clientPromise from "@/lib/mongodb";

export async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}
export async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch by slug");
    }
    return res.json();
  } catch {
    return null;
  }
}

export async function getHotProducts() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/hot`;
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Failed to fetch products by category"
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return null;
  }
}

export async function getProductsByCategory(category: string) {
  try {
    // Формируем URL для запроса
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category}`;
    const res = await fetch(url);

    // Проверяем статус ответа
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Failed to fetch products by category"
      );
    }

    // Парсим JSON и возвращаем данные
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении товаров по категории:", error);
    return null;
  }
}

export async function getCategoryByName(categoryName: string) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Ищем категорию по полю name
    const category = await db
      .collection("categories")
      .findOne({ name: categoryName });

    if (!category) {
      return null;
    }

    return {
      id: category._id.toString(),
      name: category.name,
      name_ru: category.name_ru,
      description: category.description || "",
    };
  } catch (error) {
    console.error("Ошибка при получении категории:", error);
    return null;
  }
}

export async function getAllNews() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return [];
  }
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/news`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Ошибка при получении новостей:", error);
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/news?slug=${slug}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch news by slug");
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    } else if (data && typeof data === "object") {
      return data;
    } else {
      throw new Error("News not found");
    }
  } catch (error) {
    console.error("Ошибка при получении новости по slug:", error);
    return null;
  }
}
