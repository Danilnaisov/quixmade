import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const { slug } = params;

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Ищем товар по полю slug
    const product = await db.collection("products").findOne({ slug: slug });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    // Получаем все категории из коллекции categories
    const categories = await db.collection("categories").find({}).toArray();

    // Находим категорию, связанную с товаром
    const category = categories.find((cat) =>
      cat._id.equals(product.category_id)
    );

    let cartQuantity = 0;

    if (session && session.user?.id) {
      // Находим корзину пользователя со статусом "pending"
      const cart = await db.collection("carts").findOne({
        user_id: new ObjectId(session.user.id),
        status: "pending",
      });

      if (cart) {
        // Проверяем, есть ли товар в корзине
        const cartItem = cart.items.find(
          (item) => item.product_id === product._id.toString()
        );
        if (cartItem) {
          cartQuantity = cartItem.quantity;
        }
      }
    }

    // Преобразуем ObjectId в строку и возвращаем данные
    return NextResponse.json({
      id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      price: product.price,
      short_description: product.short_description,
      description: product.description,
      features: product.features || {},
      images: product.images || [],
      stock_quantity: product.stock_quantity || 0,
      isDiscount: product.isDiscount || false,
      discountedPrice: product.discountedPrice,
      isHotHit: product.isHotHit,
      category: category
        ? {
            _id: category._id,
            name: category.name,
            name_ru: category.name_ru,
          }
        : null,
      cartQuantity, // Количество товара в корзине
    });
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
