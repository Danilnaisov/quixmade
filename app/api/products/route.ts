import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
