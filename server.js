import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { existsSync, mkdirSync } from "fs";
import Busboy from "busboy";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// Serve uploaded images
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOAD_DIR));

// Image upload endpoint
app.post("/image-upload", (req, res) => {
  console.log("Request received");
  console.log("Request headers:", req.headers);

  const contentType = req.headers["content-type"];

  if (!contentType || !contentType.includes("multipart/form-data")) {
    return res
      .status(400)
      .json({ error: "Missing or invalid Content-Type header" });
  }

  const bb = Busboy({ headers: req.headers });
  let entityType, type, slug;
  const filePaths = [];
  const filePromises = [];

  const timeout = setTimeout(() => {
    console.error("Request timed out");
    return res.status(408).json({ error: "Request timed out" });
  }, 30000); // Таймаут 30 секунд

  bb.on("field", (name, val) => {
    console.log(`Field [${name}]: value: ${val}`);
    if (name === "entityType") {
      entityType = val; // "news" или "product"
    } else if (name === "type") {
      type = val; // Категория товара (для продуктов)
    } else if (name === "slug") {
      slug = val; // Slug новости или товара
    }
  });

  bb.on("file", (name, file, info) => {
    const { filename, mimeType } = info;
    console.log(`File [${filename}] detected with MIME type: ${mimeType}`);

    // Проверка обязательных полей
    if (!filename || !entityType || !slug) {
      console.error("Missing required fields: entityType or slug");
      return res
        .status(400)
        .json({ error: "Missing required fields: entityType or slug" });
    }

    // Проверка корректности entityType
    if (!["news", "product"].includes(entityType)) {
      console.error("Invalid entityType: must be 'news' or 'product'");
      return res
        .status(400)
        .json({ error: "Invalid entityType: must be 'news' or 'product'" });
    }

    // Если это продукт, нужен type
    if (entityType === "product" && !type) {
      console.error("Missing required field: type (for products)");
      return res
        .status(400)
        .json({ error: "Missing required field: type (for products)" });
    }

    // Определяем путь для загрузки
    let uploadDir;
    if (entityType === "news") {
      uploadDir = path.join(process.cwd(), "uploads", "news", slug);
    } else {
      uploadDir = path.join(process.cwd(), "uploads", type, slug);
    }

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const writeStream = fs.createWriteStream(filePath);

    file.pipe(writeStream);

    filePromises.push(
      new Promise((resolve, reject) => {
        writeStream.on("finish", () => {
          let fileUrl;
          if (entityType === "news") {
            fileUrl = `https://api.made.quixoria.ru/uploads/news/${slug}/${filename}`;
          } else {
            fileUrl = `https://api.made.quixoria.ru/uploads/${type}/${slug}/${filename}`;
          }
          filePaths.push(fileUrl);
          resolve();
        });
        writeStream.on("error", reject);
      })
    );
  });

  bb.on("close", async () => {
    clearTimeout(timeout);
    try {
      await Promise.all(filePromises);
      res.status(200).json({
        message: "Files uploaded successfully",
        filePaths,
      });
    } catch (err) {
      console.error("Ошибка обработки файлов:", err.message);
      res.status(500).json({ error: "Ошибка обработки файлов" });
    }
  });

  bb.on("error", (err) => {
    console.error("Ошибка Busboy:", err.message);
    res.status(500).json({ error: "Ошибка Busboy" });
  });

  req.pipe(bb);
});

// Start server
const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Image upload server running on http://localhost:${PORT}`);
});
