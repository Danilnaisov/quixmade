import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const categories = await db.collection("categories").find({}).toArray();

    const products = await db
      .collection("products")
      .find({ isHotHit: true })
      .toArray();

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
