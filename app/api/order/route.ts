import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
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

    // Находим все заказы пользователя
    const orders = await db
      .collection("orders")
      .find({ user_id: new ObjectId(userId) })
      .toArray();

    // Для каждого заказа находим соответствующую корзину и извлекаем товары
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        // Находим корзину по cart_id
        const cart = await db.collection("carts").findOne({
          _id: new ObjectId(order.cart_id),
        });

        // Форматируем данные заказа
        return {
          _id: order._id.toString(),
          cart_id: order.cart_id.toString(),
          user_id: order.user_id.toString(),
          createdAt: order.createdAt.toISOString(),
          items:
            cart?.items.map((item) => ({
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })) || [],
          status: order.status.toString(),
        };
      })
    );

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "Необходимо войти в систему" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return new Response(
        JSON.stringify({ error: "Invalid orderId or status" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validStatuses = [
      "assembly",
      "canceled",
      "delivery",
      "indelivery",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Проверяем, что заказ принадлежит пользователю
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      user_id: new ObjectId(userId),
    });

    if (!order) {
      return new Response(
        JSON.stringify({
          error: "Заказ не найден или не принадлежит пользователю",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Обновляем статус заказа
    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(orderId) }, { $set: { status } });

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Не удалось обновить статус заказа" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "Order status updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
