import express from "express";
import cors from "cors";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import busboy from "busboy";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Получаем dirname
const DATA_DIR = path.join(__dirname, "/data");
const db = new sqlite3.Database(path.join(DATA_DIR, "data.db"));

app.use(express.static("public", { maxAge: 0 }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/image-upload", express.urlencoded({ extended: true }));
app.use("/data", express.static(path.join(process.cwd(), "data")));

// https://made.quixoria.ru
app.use(
  cors({
    origin: "*", // Разрешаем доступ с этого домена
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "*"], // Разрешаем все заголовки
  })
);

app.options("/image-upload", cors());

app.post("/image-upload", (req, res) => {
  console.log("POST request");

  const bb = busboy({ headers: req.headers });
  let type, slug;
  const filePaths = [];
  const filePromises = [];
  const tempFiles = [];

  bb.on("field", (name, val) => {
    console.log(`Field [${name}]: value: %j`, val);
    if (name === "type") {
      type = val;
    } else if (name === "slug") {
      slug = val;
    }
  });

  bb.on("file", (name, file, info) => {
    const { filename } = info;
    if (!filename) {
      console.error("No filename provided");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tempFileName = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}.png`;
    const tempFilePath = path.join(DATA_DIR, "temp", tempFileName);
    const writeStream = fs.createWriteStream(tempFilePath);
    file.pipe(writeStream);

    tempFiles.push({ tempFilePath, filename });
    filePromises.push(
      new Promise((resolve) => writeStream.on("close", resolve))
    );
  });

  bb.on("close", async () => {
    console.log("Done parsing form!");

    if (!type || !slug) {
      console.error("Missing 'type' or 'slug' field");
      return res.status(400).json({ error: "Missing 'type' or 'slug' field" });
    }

    await Promise.all(filePromises);

    const nowdate = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const dirPath = path.join(DATA_DIR, type, slug);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const fileMovePromises = tempFiles.map(({ tempFilePath }) => {
      return new Promise((resolve, reject) => {
        const finalFilePath = path.join(
          dirPath,
          `image_${slug}_${nowdate}_${Math.random()
            .toString(36)
            .substr(2, 5)}.png`
        );

        fs.rename(tempFilePath, finalFilePath, (err) => {
          if (err) return reject(err);
          filePaths.push(finalFilePath.replace(DATA_DIR, ""));
          resolve();
        });
      });
    });

    try {
      await Promise.all(fileMovePromises);
      console.log("Sending file paths:", filePaths);
      res.json({ message: filePaths });
    } catch (err) {
      console.error("Error processing files:", err);
      res.status(500).json({ error: "Error processing files" });
    }
  });

  req.pipe(bb);
});

// app.post("/image-upload", imageUpload.single("image"), (req, res) => {
//   console.log("Заголовки запроса:", req.headers);
//   console.log("Тело запроса после multer:", req.body);
//   console.log(
//     "Тип из тела запроса: (обработка в /image-upload)",
//     req.body.type
//   );
//   // Проверка наличия типа и slug
//   const { type } = req.body;

//   if (!type) {
//     return res.status(400).json({ error: "Type missing" });
//   }

//   console.log("Тип:", type);

//   // Дальше код обработки файла
//   const file = req.file;
//   if (!file) {
//     return res.status(400).json({ error: "No file provided" });
//   }

//   try {
//     fs.mkdirSync(`/quixmade/public/data/${type}`, { recursive: true });
//     // fs.writeFileSync(uploadPath, file.buffer);
//     res.status(200).json({ message: `/data/images/${type}/${file.filename}` });
//   } catch (error) {
//     console.error("File save error:", error);
//     res.status(500).json({ error: "Failed to save image" });
//   }
// });

//
//
//

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
            image: JSON.parse(row.image),
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
    console.error("Ошибка при загрузке данных:", error);
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
    shortDescription = ?, 
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
    JSON.stringify(updatedProduct.image),
    updatedProduct.isHotHit,
    updatedProduct.shortDescription,
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

app.post("/product", (req, res) => {
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.slug) {
    return res
      .status(400)
      .json({ detail: "Product title and slug are required" });
  }

  const sql = `INSERT INTO product (
    type, 
    pagename, 
    title, 
    slug, 
    article, 
    price, 
    saleprice, 
    isSale, 
    image, 
    isHotHit, 
    shortDescription, 
    descriptionTitle, 
    descriptionText, 
    feature
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    newProduct.type,
    newProduct.pagename,
    newProduct.title,
    newProduct.slug,
    newProduct.article,
    newProduct.price,
    newProduct.saleprice,
    newProduct.isSale,
    JSON.stringify(newProduct.image),
    newProduct.isHotHit,
    newProduct.shortDescription,
    JSON.stringify(newProduct.descriptionTitle),
    JSON.stringify(newProduct.descriptionText),
    JSON.stringify(newProduct.feature),
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error inserting product:", err);
      return res.status(500).json({ detail: "Error creating product" });
    }

    res.json({ detail: "Product created successfully", id: this.lastID });
  });
});

app.delete("/product/:id", (req, res) => {
  const productId = req.params.id;
  console.log("Deleting product with ID:", productId); // Log to check the ID

  const sql = `DELETE FROM product WHERE id = ?`;

  db.run(sql, [productId], function (err) {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ detail: "Error deleting product" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ detail: "Product not found" });
    }

    res.json({ detail: "Product deleted successfully" });
  });
});

const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
