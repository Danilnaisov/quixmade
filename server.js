import express from "express";
import cors from "cors";
import path from "path";
import { data as keyboards } from "./app/api/data/keyboards.js"; // Импортируем данные клавиатур
import { data as mice } from "./app/api/data/mouses.js"; // Импортируем данные мышей

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Получаем dirname
const DATA_DIR = path.join(__dirname, "app/api/data/"); // Путь к данным

app.use(cors());

async function loadKeyboards() {
  return keyboards; // Возвращаем импортированные данные клавиатур
}

async function loadMouses() {
  return mice; // Возвращаем импортированные данные мышей
}

app.get("/hothits", async (req, res) => {
  try {
    const keyboards = await loadKeyboards();
    const mice = await loadMouses();

    const hothits = [...keyboards, ...mice].filter((item) => item.hothit);

    hothits.sort(() => Math.random() - 0.5);

    res.json(hothits);
  } catch (error) {
    res.status(404).json({ detail: "File not found" });
  }
});

app.get("/keyboards", async (req, res) => {
  try {
    res.json(await loadKeyboards());
  } catch (error) {
    res.status(404).json({ detail: "File not found" });
  }
});

app.get("/mice", async (req, res) => {
  try {
    res.json(await loadMouses());
  } catch (error) {
    res.status(404).json({ detail: "File not found" });
  }
});

app.get("/", async (req, res) => {
  try {
    const allData = await loadKeyboards();
    allData.push(...(await loadMouses()));
    res.json(allData);
  } catch (error) {
    res.status(404).json({ detail: "File not found" });
  }
});

app.get("/product", async (req, res) => {
  const { slug, type } = req.query;
  try {
    const keyboards = await loadKeyboards();
    const mice = await loadMouses();

    const allProducts = [...keyboards, ...mice];

    if (slug) {
      const product = allProducts.find((product) => product.slug === slug);
      if (product) return res.json(product);
      return res.status(404).json({ detail: "Product not found" });
    }

    if (type) {
      const filteredProducts = allProducts.filter(
        (product) => product.type === type
      );
      if (filteredProducts.length) return res.json(filteredProducts);
      return res
        .status(404)
        .json({ detail: "No products found for this type" });
    }

    return res
      .status(400)
      .json({ detail: "Must provide either slug or product type" });
  } catch (error) {
    res.status(404).json({ detail: "File not found" });
  }
});

const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
