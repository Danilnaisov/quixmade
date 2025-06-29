import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
      login: user.login,
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

export async function PUT(req) {
  try {
    const { userId, role } = await req.json();

    // Проверяем, что role соответствует одному из допустимых значений
    if (
      !userId ||
      !role ||
      !["admin", "user", "assembler", "delivery"].includes(role)
    ) {
      return new Response(JSON.stringify({ error: "Invalid userId or role" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Преобразуем userId в ObjectId
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) }, // Преобразуем строку userId в ObjectId
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Role updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
