/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const client = await clientPromise;
    const db = client.db("quixmade");

    const query = slug ? { slug: slug } : {};
    const news = await db.collection("news").find(query).toArray();

    return NextResponse.json(news);
  } catch (error) {
    console.error("Ошибка при получении новостей:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const body = await request.json();
    const { short_name, short_desc, desc, image, date, slug, tags } = body;

    if (
      !short_name ||
      !short_desc ||
      !desc ||
      !image ||
      !date ||
      !slug ||
      !tags
    ) {
      return NextResponse.json(
        {
          error:
            "Все поля (short_name, short_desc, desc, image, date, slug, tags) обязательны",
        },
        { status: 400 }
      );
    }

    const existingNews = await db.collection("news").findOne({ slug });
    if (existingNews) {
      return NextResponse.json(
        { error: "Новость с таким slug уже существует" },
        { status: 400 }
      );
    }

    const newNews = {
      short_name,
      short_desc,
      desc,
      image,
      date: new Date(date),
      slug,
    };

    const result = await db.collection("news").insertOne(newNews);

    return NextResponse.json(
      { message: "Новость успешно добавлена", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при добавлении новости:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const body = await request.json();
    const { slug, short_name, short_desc, desc, image, date, tags } = body;

    // Проверка наличия slug
    if (!slug) {
      return NextResponse.json(
        { error: "Поле slug обязательно для обновления" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (short_name) updateData.short_name = short_name;
    if (short_desc) updateData.short_desc = short_desc;
    if (desc) updateData.desc = desc;
    if (image) updateData.image = image;
    if (date) updateData.date = new Date(date);
    if (tags) updateData.tags = tags;

    const result = await db
      .collection("news")
      .updateOne({ slug }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Новость с таким slug не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Новость успешно обновлена" });
  } catch (error) {
    console.error("Ошибка при обновлении новости:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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

    return NextResponse.json({ message: "Новость успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении новости:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
