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
      entityType = val; // "news", "product" или "banner"
    } else if (name === "type") {
      type = val; // Категория товара (для продуктов)
    } else if (name === "slug") {
      slug = val; // Slug новости или товара (опционально)
    }
  });

  bb.on("file", (name, file, info) => {
    const { filename, mimeType } = info;
    console.log(`File [${filename}] detected with MIME type: ${mimeType}`);

    // Проверка обязательных полей
    if (!filename || !entityType) {
      console.error("Missing required fields: entityType");
      return res
        .status(400)
        .json({ error: "Missing required fields: entityType" });
    }

    // Для новостей и продуктов нужен slug
    if (["news", "product"].includes(entityType) && !slug) {
      console.error("Missing required field: slug (for news or products)");
      return res
        .status(400)
        .json({ error: "Missing required field: slug (for news or products)" });
    }

    // Проверка корректности entityType
    if (!["news", "product", "banner", "review"].includes(entityType)) {
      console.error(
        "Invalid entityType: must be 'news', 'product', 'review' or 'banner'"
      );
      return res.status(400).json({
        error:
          "Invalid entityType: must be 'news', 'product', 'review' or 'banner'",
      });
    }

    // Если это продукт, нужен type
    if (entityType === "product" && !type) {
      console.error("Missing required field: type (for products)");
      return res
        .status(400)
        .json({ error: "Missing required field: type (for products)" });
    }

    // Проверка MIME-типа (только изображения)
    if (!mimeType.startsWith("image/")) {
      console.error("Invalid file type: only images are allowed");
      return res
        .status(400)
        .json({ error: "Invalid file type: only images are allowed" });
    }

    // Определяем путь для загрузки
    let uploadDir;
    if (entityType === "news") {
      uploadDir = path.join(process.cwd(), "uploads", "news", slug);
    } else if (entityType === "product") {
      uploadDir = path.join(process.cwd(), "uploads", type, slug);
    } else if (entityType === "banner") {
      uploadDir = path.join(process.cwd(), "uploads", "banners");
    } else if (entityType === "review") {
      uploadDir = path.join(process.cwd(), "uploads", "reviews");
    }

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Для баннеров добавляем уникальный суффикс к имени файла, чтобы избежать перезаписи
    const timestamp = Date.now();
    const uniqueFilename =
      entityType === "banner" || entityType === "review"
        ? `${timestamp}-${filename}`
        : filename;
    const filePath = path.join(uploadDir, uniqueFilename);
    const writeStream = fs.createWriteStream(filePath);

    file.pipe(writeStream);

    filePromises.push(
      new Promise((resolve, reject) => {
        writeStream.on("finish", () => {
          let fileUrl;
          if (entityType === "news") {
            fileUrl = `https://api.made.quixoria.ru/uploads/news/${slug}/${filename}`;
          } else if (entityType === "product") {
            fileUrl = `https://api.made.quixoria.ru/uploads/${type}/${slug}/${filename}`;
          } else if (entityType === "banner") {
            fileUrl = `https://api.made.quixoria.ru/uploads/banners/${uniqueFilename}`;
          } else if (entityType === "review") {
            fileUrl = `https://api.made.quixoria.ru/uploads/reviews/${uniqueFilename}`;
          }
          filePaths.push(fileUrl);
          resolve();
        });
        writeStream.on("error", (err) => {
          console.error("Error writing file:", err);
          reject(err);
        });
      })
    );
  });

  bb.on("close", async () => {
    clearTimeout(timeout);
    try {
      await Promise.all(filePromises);
      if (filePaths.length === 0) {
        return res.status(400).json({ error: "No files were uploaded" });
      }
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
