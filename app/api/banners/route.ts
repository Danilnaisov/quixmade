import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET() {
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

    const client = await clientPromise;
    const db = client.db("quixmade");

    const banners = await db.collection("banners").find({}).toArray();

    const formattedBanners = banners.map((banner) => ({
      _id: banner._id.toString(),
      image: banner.image,
      link: banner.link,
      status: banner.status,
    }));

    return new Response(JSON.stringify(formattedBanners), {
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
        JSON.stringify({ error: "Не указаны обязательные поля: image и link" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["active", "inactive", "advertising"].includes(status)) {
      return new Response(
        JSON.stringify({
          error:
            "Недопустимый статус баннера. Допустимые значения: active, inactive, advertising",
        }),
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
    return new Response(
      JSON.stringify({ error: "Ошибка сервера при добавлении баннера" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
