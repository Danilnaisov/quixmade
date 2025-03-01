import { hash } from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, login, password } = await request.json();

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Проверяем, существует ли пользователь с таким email или логином
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { login }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Пользователь уже существует" }),
        {
          status: 400,
        }
      );
    }

    // Хэшируем пароль
    const passwordHash = await hash(password, 10);

    // Создаем нового пользователя
    await db.collection("users").insertOne({
      email,
      login,
      password_hash: passwordHash,
      role: "user",
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
