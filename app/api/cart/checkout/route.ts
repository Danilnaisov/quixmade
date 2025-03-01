import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "Необходимо войти в систему" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Находим корзину пользователя со статусом "pending"
    const cart = await db.collection("carts").findOne({
      user_id: new ObjectId(userId),
      status: "pending",
    });

    if (!cart) {
      return new Response(JSON.stringify({ error: "Корзина не найдена" }), {
        status: 404,
      });
    }

    // Обновляем количество товаров на складе
    for (const item of cart.items) {
      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.product_id),
      });

      if (!product) {
        return new Response(
          JSON.stringify({ error: `Товар с ID ${item.product_id} не найден` }),
          { status: 404 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return new Response(
          JSON.stringify({
            error: `Недостаточно товара на складе для товара "${product.name}"`,
          }),
          { status: 400 }
        );
      }

      // Уменьшаем количество товара на складе
      await db
        .collection("products")
        .updateOne(
          { _id: new ObjectId(item.product_id) },
          { $inc: { stock_quantity: -item.quantity } }
        );
    }

    // Создаем запись в таблице orders
    const order = {
      _id: new ObjectId(), // Генерируем уникальный ID для заказа
      cart_id: cart._id, // Связываем заказ с корзиной
      user_id: new ObjectId(userId), // ID пользователя
      createdAt: new Date(), // Дата создания заказа
    };

    // Добавляем заказ в коллекцию orders
    await db.collection("orders").insertOne(order);

    // Обновляем статус корзины на "payed"
    await db
      .collection("carts")
      .updateOne({ _id: cart._id }, { $set: { status: "payed" } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
