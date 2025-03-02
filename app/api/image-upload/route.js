import path from "path";
import { existsSync, mkdirSync } from "fs"; // Импортируем sync-методы из fs
import fs from "fs"; // Импортируем основной модуль fs для createWriteStream
import Busboy from "busboy";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // Отключаем парсинг тела запроса
  },
};

export async function POST(req) {
  console.log("Request received");
  console.log("Request headers:", req.headers);

  // Правильно получаем заголовок Content-Type через req.headers.get()
  const contentType = req.headers.get("content-type");

  if (!contentType || !contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Content-Type header" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const bb = Busboy({ headers: { "content-type": contentType } });
  let type, slug;
  const filePaths = [];
  const filePromises = [];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error("Request timed out");
      reject(
        new Response(JSON.stringify({ error: "Request timed out" }), {
          status: 408,
          headers: { "Content-Type": "application/json" },
        })
      );
    }, 30000); // Таймаут 30 секунд

    bb.on("field", (name, val) => {
      console.log(`Field [${name}]: value: ${val}`);
      if (name === "type") {
        type = val;
      } else if (name === "slug") {
        slug = val;
      }
    });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      console.log(`File [${filename}] detected with MIME type: ${mimeType}`);

      if (!filename || !type || !slug) {
        return reject(new Error("Missing required fields: type or slug"));
      }

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        type,
        slug
      );
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const writeStream = fs.createWriteStream(filePath);

      file.pipe(writeStream);

      filePromises.push(
        new Promise((res, rej) => {
          writeStream.on("finish", () => {
            filePaths.push(`/uploads/${type}/${slug}/${filename}`);
            res();
          });
          writeStream.on("error", rej);
        })
      );
    });

    bb.on("close", async () => {
      clearTimeout(timeout); // Очищаем таймаут при успешном завершении
      try {
        await Promise.all(filePromises);
        resolve(
          new Response(
            JSON.stringify({
              message: "Files uploaded successfully",
              filePaths,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      } catch (err) {
        console.error("Ошибка обработки файлов:", err.message);
        reject(
          new Response(JSON.stringify({ error: "Ошибка обработки файлов" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
    });

    bb.on("error", (err) => {
      console.error("Ошибка Busboy:", err.message);
      reject(
        new Response(JSON.stringify({ error: "Ошибка Busboy" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    // Преобразование ReadableStream в поток Node.js и передача его в Busboy
    const webStreamToNodeStream = (webStream) => {
      const reader = webStream.getReader();
      const stream = new Readable();

      stream._read = () => {}; // No-op

      const pushChunk = async ({ done, value }) => {
        if (done) {
          stream.push(null); // Конец потока
        } else {
          stream.push(value); // Передаем чанк в поток
        }
      };

      const readChunks = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            pushChunk({ done, value });
          }
          stream.push(null); // Завершаем поток
        } catch (err) {
          stream.destroy(err); // Обработка ошибок
        }
      };

      readChunks(); // Начинаем чтение чанков

      return stream;
    };

    const nodeStream = webStreamToNodeStream(req.body);
    nodeStream.pipe(bb);
  });
}
