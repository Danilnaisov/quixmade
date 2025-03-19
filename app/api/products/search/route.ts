import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Не указан поисковый запрос" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Используем агрегацию для поиска товаров и получения данных о категории
    const products = await db
      .collection("products")
      .aggregate([
        {
          $match: {
            name: { $regex: query, $options: "i" }, // Регистронезависимый поиск по имени
          },
        },
        {
          $lookup: {
            from: "categories", // Коллекция категорий
            localField: "category_id", // Поле в коллекции products
            foreignField: "_id", // Поле в коллекции categories
            as: "category", // Имя поля, куда будут записаны данные категории
          },
        },
        {
          $unwind: "$category", // Разворачиваем массив category (так как $lookup возвращает массив)
        },
      ])
      .toArray();

    // Форматируем данные для ответа
    const formattedProducts = products.map((product) => ({
      _id: product._id.toString(),
      category_id: product.category_id.toString(),
      slug: product.slug,
      name: product.name,
      price: product.price,
      short_description: product.short_description,
      description: product.description,
      features: product.features || {},
      images: product.images || [],
      stock_quantity: product.stock_quantity || 0,
      isDiscount: product.isDiscount || false,
      discountedPrice: product.discountedPrice || 0,
      isHotHit: product.isHotHit || false,
      category: {
        _id: product.category._id.toString(),
        name: product.category.name, // Теперь поле name доступно
        name_ru: product.category.name_ru,
      },
    }));

    return new Response(JSON.stringify(formattedProducts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка при поиске товаров:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
