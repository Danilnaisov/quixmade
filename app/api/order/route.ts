import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
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
          createdAt: order.createdAt.toISOString(), // Преобразуем дату в строку
          items:
            cart?.items.map((item) => ({
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })) || [], // Если корзина не найдена, возвращаем пустой массив
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
