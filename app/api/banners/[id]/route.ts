import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Доступ запрещён" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ error: "Не указан ID баннера" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    const banners = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(banners), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка при получении списка баннеров:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Доступ запрещён" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { image, link, status } = await request.json();

    if (!image || !link) {
      return new Response(
        JSON.stringify({ error: "Не указаны обязательные поля" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["active", "inactive", "advertising"].includes(status)) {
      return new Response(
        JSON.stringify({ error: "Недопустимый статус баннера" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    const result = await db.collection("banners").insertOne({
      image,
      link,
      status,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Баннер успешно добавлен",
        id: result.insertedId.toString(),
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Ошибка при добавлении баннера:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Доступ запрещён" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ error: "Не указан ID баннера" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { image, link, status } = await request.json();

    if (!image || !link) {
      return new Response(
        JSON.stringify({ error: "Не указаны обязательные поля" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["active", "inactive", "advertising"].includes(status)) {
      return new Response(
        JSON.stringify({ error: "Недопустимый статус баннера" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    const result = await db
      .collection("banners")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { image, link, status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Баннер не найден" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Баннер успешно обновлён" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Ошибка при обновлении баннера:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Доступ запрещён" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ error: "Не указан ID баннера" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    const result = await db.collection("banners").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Баннер не найден" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Баннер успешно удалён" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка при удалении баннера:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
