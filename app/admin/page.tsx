"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/admin/ProductCard";
import { EditProductForm } from "@/components/admin/EditProductForm";
import { NewsCard } from "@/components/admin/NewsCard"; // Новый компонент
import { EditNewsForm } from "@/components/admin/EditNewsForm"; // Новый компонент
import { Title } from "@/components/shared";

interface Category {
  _id: string;
  ru_name: string;
}

interface Product {
  _id: string;
  category: string | { _id: string; ru_name: string };
  slug: string;
  name: string;
  price: number;
  short_description: string;
  description: string;
  features: {
    label: string;
    value: string | number | boolean;
    type: "string" | "int" | "bool";
  }[];
  images: string[];
  stock_quantity: number;
  isDiscount: boolean;
  discountedPrice: number;
  isHotHit: boolean;
}

interface News {
  _id: string;
  slug: string;
  short_name: string;
  short_desc: string;
  desc: string;
  image: string;
  date: string;
}

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }

    // Загрузка списка товаров
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formattedProducts = data.map((product: Product) => ({
          ...product,
          features: Object.entries(product.features || {}).map(
            ([key, value]) => ({
              label: key,
              value: value,
              type:
                typeof value === "boolean"
                  ? "bool"
                  : typeof value === "number"
                  ? "int"
                  : "string",
            })
          ),
        }));
        setProducts(formattedProducts);
      })
      .catch((error) => console.error("Ошибка загрузки товаров:", error));

    // Загрузка списка категорий
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Ошибка загрузки категорий:", error));

    // Загрузка списка новостей
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((error) => console.error("Ошибка загрузки новостей:", error));
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  // Функция для добавления нового товара
  const handleAddProduct = () => {
    setEditingProduct({
      _id: "",
      category: "",
      slug: "",
      name: "",
      price: 0,
      short_description: "",
      description: "",
      features: [],
      images: [],
      stock_quantity: 0,
      isDiscount: false,
      discountedPrice: 0,
      isHotHit: false,
    });
  };

  // Функция для добавления новой новости
  const handleAddNews = () => {
    setEditingNews({
      _id: "",
      slug: "",
      short_name: "",
      short_desc: "",
      desc: "",
      image: "",
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="p-8">
      <Button onClick={() => router.push("/")}>На главную</Button>
      <h1 className="text-2xl font-bold">Админ-панель</h1>
      <p>{session.user?.email}</p>

      {/* Раздел товаров */}
      <Title text="Управление товарами" className="mt-3" />
      {!editingProduct && !editingNews && (
        <Button onClick={handleAddProduct} className="mt-4">
          Добавить товар
        </Button>
      )}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          categories={categories}
          onSave={(updatedProduct) => {
            if (updatedProduct._id) {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p
                )
              );
            } else {
              setProducts((prevProducts) => [
                ...prevProducts,
                { ...updatedProduct, _id: Date.now().toString() },
              ]);
            }
            setEditingProduct(null);
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      {!editingProduct && !editingNews && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => {
                fetch(`/api/products/id/${product._id}`, { method: "DELETE" })
                  .then((res) => {
                    if (res.ok) {
                      setProducts((prevProducts) =>
                        prevProducts.filter((p) => p._id !== product._id)
                      );
                    }
                  })
                  .catch((error) =>
                    console.error("Ошибка удаления товара:", error)
                  );
              }}
            />
          ))}
        </div>
      )}

      {/* Раздел новостей */}
      <Title text="Управление новостями" className="mt-6" />
      {!editingProduct && !editingNews && (
        <Button onClick={handleAddNews} className="mt-4">
          Добавить новость
        </Button>
      )}
      {editingNews && (
        <EditNewsForm
          news={editingNews}
          onSave={(updatedNews) => {
            if (updatedNews._id) {
              setNews((prevNews) =>
                prevNews.map((n) =>
                  n._id === updatedNews._id ? updatedNews : n
                )
              );
            } else {
              setNews((prevNews) => [
                ...prevNews,
                { ...updatedNews, _id: Date.now().toString() },
              ]);
            }
            setEditingNews(null);
          }}
          onCancel={() => setEditingNews(null)}
        />
      )}
      {!editingProduct && !editingNews && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {news.map((item) => (
            <NewsCard
              key={item._id}
              news={item}
              onEdit={() => setEditingNews(item)}
              onDelete={() => {
                fetch(`/api/news?slug=${item.slug}`, { method: "DELETE" })
                  .then((res) => {
                    if (res.ok) {
                      setNews((prevNews) =>
                        prevNews.filter((n) => n._id !== item._id)
                      );
                    }
                  })
                  .catch((error) =>
                    console.error("Ошибка удаления новости:", error)
                  );
              }}
            />
          ))}
        </div>
      )}

      <Title text="Список пользователей" className="mt-6" />
    </div>
  );
};

export default AdminPage;
