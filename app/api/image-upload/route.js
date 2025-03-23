export const config = {
  api: {
    bodyParser: false, // Отключаем парсинг тела запроса
  },
};

export async function POST(req) {
  console.log("Request received at /api/image-upload");
  console.log("Request headers:", req.headers);

  const contentType = req.headers.get("content-type");

  if (!contentType || !contentType.includes("multipart/form-data")) {
    console.error("Invalid Content-Type:", contentType);
    return new Response(
      JSON.stringify({ error: "Missing or invalid Content-Type header" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Перенаправляем запрос на внешний сервер
    const response = await fetch("https://api.made.quixoria.ru/image-upload", {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: req.body, // Передаём тело запроса как есть
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Files uploaded successfully via external server:", result);
      return new Response(
        JSON.stringify({
          message: "Files uploaded successfully",
          filePaths: result.filePaths,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("Error from external server:", result);
      return new Response(
        JSON.stringify({ error: result.error || "Failed to upload files" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error forwarding request to external server:", error);
    return new Response(
      JSON.stringify({ error: "Error forwarding request to external server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
