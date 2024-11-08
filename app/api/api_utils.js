import { endpoint } from "./config.js";

// Функция для загрузки "горячих хитов"
export const loadHothits = async (slice) => {
  try {
    const response = await fetch(`${endpoint}hothits`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    const filteredProducts = products.filter(
      (product) => product.id !== undefined
    );
    const limitedProducts =
      slice !== undefined ? filteredProducts.slice(0, slice) : filteredProducts;
    return limitedProducts;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error.message);
    return [];
  }
};

// Функция для получения информации о продукте по slug

export const loadAllProducts = async () => {
  try {
    const response = await fetch(`${endpoint}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Ошибка при загрузке всех продуктов:", error.message);
    return [];
  }
};

export const loadProductsByType = async (type) => {
  try {
    const response = await fetch(`${endpoint}product?type=${type}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    console.log("Fetched products:", products);
    return products.filter((product) => product.id !== undefined);
  } catch (error) {
    console.error("Ошибка при загрузке продуктов по типу:", error.message);
    return [];
  }
};

export const loadProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${endpoint}product?slug=${slug}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Ошибка при загрузке продукта:", error.message);
    return null;
  }
};

export const loadProductById = async (id) => {
  try {
    const response = await fetch(`${endpoint}product?id=${id}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Ошибка при загрузке продукта по ID:", error.message);
    return null;
  }
};

export const loadReviewsByProductId = async (productId) => {
  try {
    const response = await fetch(`${endpoint}review?productid=${productId}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error("Ошибка при загрузке отзывов по ID продукта:", error.message);
    return [];
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await fetch(`${endpoint}product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    return response;
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${endpoint}product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    return response;
  } catch (error) {
    console.error("Error while creating product:", error);
    throw error;
  }
};
