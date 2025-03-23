import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> } // params передаётся через второй аргумент
) {
  try {
    const { category } = await params; // Дожидаемся params

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Ищем категорию по имени
    const categoryDoc = await db
      .collection("categories")
      .findOne({ name: category });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 }
      );
    }

    // Ищем товары, принадлежащие этой категории (по category_id)
    const products = await db
      .collection("products")
      .find({ category_id: categoryDoc._id })
      .toArray();

    // Преобразуем ObjectId в строки и форматируем данные
    const formattedProducts = products.map((product) => ({
      id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      price: product.price,
      short_description: product.short_description,
      images: product.images || [],
      features: product.features || [],
      stock_quantity: product.stock_quantity || 0,
      isDiscount: product.is_discount || false,
      discountedPrice: product.discounted_price,
      category: {
        name: categoryDoc.name,
        name_ru: categoryDoc.name_ru,
      },
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении товаров категории:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
