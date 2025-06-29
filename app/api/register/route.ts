import { hash } from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

const IP_REGISTRATION_LIMIT = 3; // Макс. регистраций с IP в сутки

export async function POST(request: NextRequest) {
  try {
    // Получаем IP
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";

    // Проверка данных
    const { email, login, password } = await request.json();

    if (!email || !login || !password) {
      return new Response(
        JSON.stringify({ error: "Все поля обязательны для заполнения" }),
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Некорректный формат email" }),
        { status: 400 }
      );
    }

    // Валидация пароля
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Пароль должен содержать минимум 8 символов" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Проверка лимита по IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ipRegistrations = await db
      .collection("ipRegistrations")
      .countDocuments({
        ip,
        date: { $gte: today },
      });

    if (ipRegistrations >= IP_REGISTRATION_LIMIT) {
      return new Response(
        JSON.stringify({
          error: `Превышен лимит регистраций с вашего IP (${IP_REGISTRATION_LIMIT} в сутки)`,
        }),
        { status: 429 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { login }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "Пользователь с таким email или логином уже существует",
        }),
        { status: 409 }
      );
    }

    // Хэширование пароля
    const passwordHash = await hash(password, 10);

    // Создание пользователя
    await db.collection("users").insertOne({
      email,
      login,
      password_hash: passwordHash,
      role: "user",
    });

    // Логирование регистрации
    await db.collection("ipRegistrations").insertOne({
      ip,
      date: new Date(),
      action: "registration",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Регистрация успешно завершена",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return new Response(
      JSON.stringify({ error: "Внутренняя ошибка сервера" }),
      { status: 500 }
    );
  }
}
