import express from "express";
import cors from "cors";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import multer from "multer";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Получаем dirname
const DATA_DIR = path.join(__dirname, "./app/api/data/"); // Путь к данным
const db = new sqlite3.Database(path.join(DATA_DIR, "data.db")); // Подключаем базу данных

const corsOptions = {
  origin: "*", // Разрешить всем источникам
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Функция для загрузки всех продуктов
async function loadAllProducts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM product", (err, rows) => {
      if (err) reject(err);
      else {
        // Обрабатываем поля с JSON
        const processedRows = rows.map((row) => {
          return {
            ...row,
            descriptionTitle: JSON.parse(row.descriptionTitle),
            descriptionText: JSON.parse(row.descriptionText),
            feature: JSON.parse(row.feature),
          };
        });
        resolve(processedRows);
      }
    });
  });
}

// Получение всех продуктов
app.get("/", async (req, res) => {
  try {
    const allData = await loadAllProducts();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ detail: "Ошибка при загрузке данных" });
  }
});

// Получение горячих хитов
app.get("/hothits", async (req, res) => {
  try {
    const allData = await loadAllProducts();
    const hothits = allData.filter((item) => item.isHotHit);
    hothits.sort(() => Math.random() - 0.5);
    res.json(hothits);
  } catch (error) {
    res.status(500).json({ detail: "Ошибка при загрузке данных" });
  }
});

// Получение продукта по slug или по типу
app.get("/product", async (req, res) => {
  const { slug, type, id } = req.query;
  try {
    const allData = await loadAllProducts();
    // console.log(allData);

    if (slug) {
      const product = allData.find((product) => product.slug === slug);
      if (product) return res.json(product);
      return res.status(404).json({ detail: "Product not found" });
    }

    if (id) {
      const product = allData.find((product) => product.id === Number(id));
      if (product) return res.json(product);
      return res.status(404).json({ detail: "Product not found" });
    }

    if (type) {
      const filteredProducts = allData.filter(
        (product) => product.type === type
      );
      if (filteredProducts.length) return res.json(filteredProducts);
      return res
        .status(404)
        .json({ detail: "No products found for this type" });
    }

    res.json(allData);
  } catch (error) {
    res.status(500).json({ detail: "Ошибка при загрузке данных" });
  }
});

// Функция для загрузки отзывов по ID продукта
async function loadReviewsByProductId(productId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM reviews WHERE productid = ?",
      [productId],
      (err, rows) => {
        resolve(rows);
      }
    );
  });
}

// Эндпоинт для получения отзывов по ID продукта
app.get("/review", async (req, res) => {
  const { productid } = req.query;
  try {
    if (!productid) {
      return res.status(400).json({ detail: "Product ID is required" });
    }

    const reviews = await loadReviewsByProductId(parseInt(productid));
    if (reviews.length) {
      return res.json(reviews);
    }
    return res
      .status(404)
      .json({ detail: "No reviews found for this product" });
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error); // Отладочная информация
    res.status(500).json({ detail: "Ошибка при загрузке данных" });
  }
});

app.put("/product", (req, res) => {
  const updatedProduct = req.body;

  if (!updatedProduct.id) {
    return res.status(400).json({ detail: "Product ID is required" });
  }

  const sql = `UPDATE product SET 
    type = ?, 
    pagename = ?, 
    title = ?, 
    slug = ?, 
    article = ?, 
    price = ?, 
    saleprice = ?, 
    isSale = ?, 
    image = ?, 
    isHotHit = ?, 
    descriptionTitle = ?, 
    descriptionText = ?, 
    feature = ? 
    WHERE id = ?`;

  const params = [
    updatedProduct.type,
    updatedProduct.pagename,
    updatedProduct.title,
    updatedProduct.slug,
    updatedProduct.article,
    updatedProduct.price,
    updatedProduct.saleprice,
    updatedProduct.isSale,
    updatedProduct.image,
    updatedProduct.isHotHit,
    JSON.stringify(updatedProduct.descriptionTitle),
    JSON.stringify(updatedProduct.descriptionText),
    JSON.stringify(updatedProduct.feature),
    updatedProduct.id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Ошибка при обновлении продукта:", err);
      return res.status(500).json({ detail: "Ошибка при обновлении продукта" });
    }

    res.json({ detail: "Продукт обновлен успешно", changes: this.changes });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка для загрузки файлов
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя для файла
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }
  res
    .status(200)
    .send({ message: "File uploaded successfully.", file: req.file });
});

const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
