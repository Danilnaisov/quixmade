import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
      });
    }

    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Доступ запрещён" }), {
        status: 403,
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    const users = await db.collection("users").find({}).toArray();

    const formattedUsers = users.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name || undefined,
      role: user.role || "user",
    }));

    return new Response(JSON.stringify(formattedUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
