import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade"); // Замените на имя вашей базы данных

    // Получаем все категории из коллекции
    const categories = await db.collection("categories").find({}).toArray();

    // Преобразуем ObjectId в строки (если необходимо)
    const formattedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }));

    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
