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
  let type, slug;
  const filePaths = [];
  const filePromises = [];

  const timeout = setTimeout(() => {
    console.error("Request timed out");
    return res.status(408).json({ error: "Request timed out" });
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
      console.error("Missing required fields: type or slug");
      return res
        .status(400)
        .json({ error: "Missing required fields: type or slug" });
    }

    const uploadDir = path.join(process.cwd(), "uploads", type, slug);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const writeStream = fs.createWriteStream(filePath);

    file.pipe(writeStream);

    filePromises.push(
      new Promise((resolve, reject) => {
        writeStream.on("finish", () => {
          filePaths.push(
            `https://api.made.quixoria.ru/uploads/${type}/${slug}/${filename}`
          );
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
