import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Получаем все категории из коллекции
    const products = await db.collection("products").find({}).toArray();
    const categories = await db.collection("categories").find({}).toArray();

    // Преобразуем ObjectId в строки (если необходимо)
    const productsWithCategories = products.map((product) => {
      const category = categories.find((cat) =>
        cat._id.equals(product.category_id)
      );
      return {
        ...product,
        category: category
          ? { name: category.name, name_ru: category.name_ru }
          : null,
      };
    });

    return NextResponse.json(productsWithCategories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Преобразуем category_id в ObjectId
    const categoryId = body.category_id ? new ObjectId(body.category_id) : null;

    // Валидация данных
    if (!body.name || !body.price) {
      return new Response(
        JSON.stringify({ error: "Недостаточно данных для создания товара" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Добавляем товар в базу данных
    const result = await db.collection("products").insertOne({
      ...body,
      category_id: categoryId, // Сохраняем как ObjectId
    });

    // Возвращаем сгенерированный _id
    return new Response(
      JSON.stringify({
        success: true,
        _id: result.insertedId.toString(), // Преобразуем ObjectId в строку
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
