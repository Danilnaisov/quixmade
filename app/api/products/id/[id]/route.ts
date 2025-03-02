import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const { id } = params;

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Ищем товар по полю id
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

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
      isDiscount: product.is_discount || false,
      discountedPrice: product.discounted_price,
      isHotHit: product.isHotHit,
      category: category
        ? { _id: category._id, name: category.name, name_ru: category.name_ru }
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID товара отсутствует" }), {
        status: 400,
      });
    }

    const body = await request.json();

    // Преобразуем category_id в ObjectId
    const categoryId = body.category_id ? new ObjectId(body.category_id) : null;

    // Валидация данных
    if (!body.name || !body.price) {
      return new Response(
        JSON.stringify({ error: "Недостаточно данных для обновления товара" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Исключаем _id из данных перед отправкой
    const { _id, ...updateData } = body;

    // Обновляем товар в базе данных
    const result = await db
      .collection("products")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, category_id: categoryId } }
      );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Товар с указанным ID не найден" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split("/").pop();

    if (!productId) {
      return new Response(JSON.stringify({ error: "ID товара не указан" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Удаляем товар по ID
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Товар с указанным ID не найден" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
