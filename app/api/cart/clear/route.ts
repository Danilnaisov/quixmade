import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST() {
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

    // Удаляем корзину пользователя
    await db.collection("carts").deleteOne({ _id: cart._id });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при очистке корзины:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
