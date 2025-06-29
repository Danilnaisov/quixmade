/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const client = await clientPromise;
    const db = client.db("quixmade");

    const query = slug ? { slug } : {};
    const news = await db.collection("news").find(query).toArray();

    const formattedNews = news.map((item) => ({
      _id: item._id.toString(),
      slug: item.slug,
      short_name: item.short_name,
      short_desc: item.short_desc,
      content: item.content || [],
      image: item.image,
      date: item.date.toISOString(),
      tags: item.tags || [],
    }));

    return NextResponse.json(formattedNews, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении новостей:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const body = await request.json();
    const { short_name, short_desc, content, image, date, slug, tags } = body;

    // Проверяем наличие всех обязательных полей
    if (!short_name || !short_desc || !content || !image || !date || !slug) {
      return NextResponse.json(
        {
          error:
            "Все поля (short_name, short_desc, content, image, date, slug) обязательны",
        },
        { status: 400 }
      );
    }

    // Проверяем, существует ли новость с таким slug
    const existingNews = await db.collection("news").findOne({ slug });
    if (existingNews) {
      return NextResponse.json(
        { error: "Новость с таким slug уже существует" },
        { status: 400 }
      );
    }

    // Создаём новую новость
    const newNews = {
      short_name,
      short_desc,
      content, // Используем content вместо desc
      image,
      date: new Date(date),
      slug,
      tags: tags || [],
    };

    const result = await db.collection("news").insertOne(newNews);

    return NextResponse.json(
      {
        message: "Новость успешно добавлена",
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при добавлении новости:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Проверяем наличие slug в query-параметрах
    if (!slug) {
      return NextResponse.json(
        { error: "Поле slug обязательно для обновления" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { short_name, short_desc, content, image, date, tags } = body;

    // Формируем данные для обновления
    const updateData: any = {};
    if (short_name) updateData.short_name = short_name;
    if (short_desc) updateData.short_desc = short_desc;
    if (content) updateData.content = content;
    if (image) updateData.image = image;
    if (date) updateData.date = new Date(date);
    if (tags) updateData.tags = tags;

    // Проверяем, есть ли данные для обновления
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Не указаны данные для обновления" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("news")
      .updateOne({ slug }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Новость с таким slug не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Новость успешно обновлена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении новости:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Поле slug обязательно для удаления" },
        { status: 400 }
      );
    }

    const result = await db.collection("news").deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Новость с таким slug не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Новость успешно удалена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении новости:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
