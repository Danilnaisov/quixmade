import express from "express";
import cors from "cors";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import busboy from "busboy";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Получаем dirname
const DATA_DIR = path.join(__dirname, "./app/api/data/"); // Путь к данным
const db = new sqlite3.Database(path.join(DATA_DIR, "data.db")); // Подключаем базу данных

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/image-upload", express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["https://made.quixoria.ru"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const imageUploadPath = "/quixmade/public/data";
const tempUploadPath = "/quixmade/public/temp";

app.post("/image-upload", (req, res) => {
  console.log("POST request");

  const bb = busboy({ headers: req.headers });
  let type, slug;
  const filePaths = [];
  let fileCount = 0;
  let processedCount = 0;

  bb.on("field", (name, val) => {
    console.log(`Field [${name}]: value: %j`, val);
    if (name === "type") {
      type = val;
    } else if (name === "slug") {
      slug = val;
    }
  });

  bb.on("file", (name, file, info) => {
    fileCount++; // Увеличиваем количество файлов
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );

    const tempFileName = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}.png`;
    const tempFilePath = path.join(tempUploadPath, tempFileName);

    const writeStream = fs.createWriteStream(tempFilePath);
    file.pipe(writeStream);

    writeStream.on("close", async () => {
      console.log(`File temporarily saved to ${tempFilePath}`);

      if (!type || !slug) {
        console.error("Missing 'type' or 'slug' field");
        res.status(400).json({ error: "Missing 'type' or 'slug' field" });
        return;
      }

      try {
        const nowdate = new Date().toISOString().replace(/[-T:.Z]/g, "");
        const dirPath = path.join(imageUploadPath, type, slug);
        fs.mkdirSync(dirPath, { recursive: true });

        const finalFilePath = path.join(
          dirPath,
          `image_${slug}_${nowdate}_${Math.random()
            .toString(36)
            .substr(2, 5)}.png`
        );
        await new Promise((resolve, reject) => {
          fs.rename(tempFilePath, finalFilePath, (err) => {
            if (err) {
              console.error("Error renaming file:", err);
              reject(err);
            } else {
              console.log(`File moved to ${finalFilePath}`);
              filePaths.push(finalFilePath.replace("/quixmade/public", ""));
              resolve();
            }
          });
        });
      } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Error processing file" });
      } finally {
        processedCount++; // Увеличиваем счётчик обработанных файлов

        // Если все файлы обработаны, отправляем ответ
        if (processedCount === fileCount) {
          if (filePaths.length > 0) {
            console.log("Sending file paths:", filePaths);
            res.json({ message: filePaths });
          } else {
            console.error("No files were processed");
            res.status(500).json({ error: "No files were processed" });
          }
        }
      }
    });
  });

  bb.on("close", () => {
    console.log("Done parsing form!");
    // Если нет файлов, отправляем ответ сразу
    if (fileCount === 0) {
      console.error("No files were provided");
      res.status(400).json({ error: "No files were provided" });
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
    JSON.stringify(updatedProduct.image),
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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("req.body:", req.body); // Добавьте этот вывод для отладки
//     const { type, slug } = req.body;

//     if (!type || !slug) {
//       return cb(new Error("Параметры type и slug обязательны"));
//     }

//     const uploadPath = path.join(
//       __dirname,
//       "public",
//       "data",
//       "images",
//       type,
//       slug
//     );
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage }).fields([
//   { name: "file", maxCount: 1 },
//   { name: "type", maxCount: 1 },
//   { name: "slug", maxCount: 1 },
// ]);

// app.post("/upload", upload, (req, res) => {
//   console.log("req.body:", req.body); // теперь req.body должен содержать type и slug
//   console.log("req.files:", req.files); // req.files содержит загруженные файлы
//   if (!req.body.type || !req.body.slug) {
//     return res.status(400).send("Параметры type и slug обязательны");
//   }
//   res.status(200).send({ message: "File uploaded successfully" });
// });

const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
