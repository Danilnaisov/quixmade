import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация данных
    if (!body || !body.name || !body.price) {
      return new Response(
        JSON.stringify({ error: "Недостаточно данных для создания товара" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Добавляем товар в базу данных
    const result = await db.collection("products").insertOne(body);

    return new Response(
      JSON.stringify({
        success: true,
        _id: result.insertedId.toString(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
