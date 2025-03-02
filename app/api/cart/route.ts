import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Импортируем ObjectId

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Находим корзину пользователя со статусом "pending"
    const cart = await db.collection("carts").findOne({
      user_id: new ObjectId(userId),
      status: "pending",
    });

    if (!cart) {
      return new Response(
        JSON.stringify({
          items: [],
          summary: 0,
          totalSavings: 0,
          status: null,
        }),
        { status: 200 }
      );
    }

    // Если указан product_id, проверяем наличие товара в корзине
    if (product_id) {
      const itemInCart = cart.items.find(
        (item) => item.product_id === product_id
      );
      return new Response(
        JSON.stringify({
          inCart: !!itemInCart, // true, если товар найден
          quantity: itemInCart ? itemInCart.quantity : 0, // Количество товара
        }),
        { status: 200 }
      );
    }

    // Получаем актуальные данные о товарах
    const productIds = cart.items.map((item) => item.product_id);
    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds.map((id) => new ObjectId(id)) } })
      .toArray();

    const categories = await db.collection("categories").find({}).toArray();

    // Обновляем информацию о товарах в корзине
    const updatedItems = cart.items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product_id
      );
      const category = categories.find((cat) =>
        cat._id.equals(product.category_id)
      );
      const fullPrice = product?.price || 0;
      const discountedPrice = product?.isDiscount
        ? product.discountedPrice
        : fullPrice;
      const savings = product?.isDiscount
        ? (fullPrice - discountedPrice) * item.quantity
        : 0;
      const image = product?.images[0];
      const path = `catalog/${category.name}/${product?.slug}`;
      return {
        ...item,
        name: product?.name || "Товар не найден",
        price: discountedPrice,
        fullPrice: fullPrice,
        image: image,
        link: path,
        stock_quantity: product?.stock_quantity || 0,
        savings: savings,
      };
    });

    // Пересчитываем итоговую сумму и общую выгоду
    const updatedSummary = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalSavings = updatedItems.reduce(
      (sum, item) => sum + item.savings,
      0
    );

    return new Response(
      JSON.stringify({
        items: updatedItems,
        summary: updatedSummary,
        totalSavings: totalSavings, // Общая выгода
        status: cart.status || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "Необходимо войти в систему" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { product_id, quantity } = await request.json();

    if (!product_id || !quantity || typeof quantity !== "number") {
      return new Response(JSON.stringify({ error: "Неверные данные" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("quixmade");

    // Преобразуем user_id в ObjectId
    const objectIdUserId = new ObjectId(userId);

    // Получаем информацию о товаре из коллекции products
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(product_id) });

    if (!product) {
      return new Response(JSON.stringify({ error: "Товар не найден" }), {
        status: 404,
      });
    }

    const { name, price } = product;

    // Ищем текущую корзину пользователя
    const cart = await db.collection("carts").findOne({
      user_id: objectIdUserId,
      status: "pending", // Ищем только корзины со статусом "pending"
    });

    let updatedItems = [];
    let updatedSummary = 0;

    if (cart) {
      // Если корзина существует, обновляем её
      const existingItem = cart.items.find(
        (item) => item.product_id === product_id
      );

      if (existingItem) {
        // Обновляем количество товара
        updatedItems = cart.items.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Добавляем новый товар
        updatedItems = [...cart.items, { product_id, name, price, quantity }];
      }

      updatedSummary = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    } else {
      // Если корзины нет или она оплачена, создаём новую
      updatedItems = [{ product_id, name, price, quantity }];
      updatedSummary = price * quantity;
    }

    // Обновляем или создаем корзину
    await db.collection("carts").updateOne(
      { user_id: objectIdUserId, status: "pending" },
      {
        $set: {
          items: updatedItems,
          summary: updatedSummary,
          status: "pending",
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при добавлении товара в корзину:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "Необходимо войти в систему" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { product_id, quantity } = await request.json();

    if (!product_id || typeof quantity !== "number" || quantity <= 0) {
      return new Response(JSON.stringify({ error: "Неверные данные" }), {
        status: 400,
      });
    }

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

    // Проверяем наличие товара на складе
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(product_id) });

    if (!product) {
      return new Response(JSON.stringify({ error: "Товар не найден" }), {
        status: 404,
      });
    }

    if (quantity > product.stock_quantity) {
      return new Response(
        JSON.stringify({
          error: "Превышено доступное количество товара на складе",
        }),
        { status: 400 }
      );
    }

    // Обновляем количество товара
    const updatedItems = cart.items.map((item) =>
      item.product_id === product_id ? { ...item, quantity } : item
    );

    // Пересчитываем итоговую сумму
    const updatedSummary = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Обновляем корзину в базе данных
    await db.collection("carts").updateOne(
      { _id: cart._id },
      {
        $set: {
          items: updatedItems,
          summary: updatedSummary,
        },
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении количества товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "Необходимо войти в систему" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { product_id } = await request.json();

    if (!product_id) {
      return new Response(JSON.stringify({ error: "Неверные данные" }), {
        status: 400,
      });
    }

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

    // Удаляем товар из корзины
    const updatedItems = cart.items.filter(
      (item) => item.product_id !== product_id
    );

    // Пересчитываем итоговую сумму
    const updatedSummary = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Обновляем корзину в базе данных
    await db.collection("carts").updateOne(
      { _id: cart._id },
      {
        $set: {
          items: updatedItems,
          summary: updatedSummary,
        },
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении товара из корзины:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}
