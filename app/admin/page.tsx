"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/admin/ProductCard";
import { EditProductForm } from "@/components/admin/EditProductForm";
import { NewsCard } from "@/components/admin/NewsCard";
import { EditNewsForm } from "@/components/admin/EditNewsForm";
import { BannerCard } from "@/components/admin/BannerCard";
import { EditBannerForm } from "@/components/admin/EditBannerForm";
import { Container, Footer, Header, Title } from "@/components/shared";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Newspaper,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

interface Banner {
  _id: string;
  image: string;
  link: string;
  status: "active" | "inactive" | "advertising";
}

interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
}

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [openSections, setOpenSections] = useState({
    products: true,
    news: true,
    banners: true,
    users: true,
  });

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
      .catch((error) => {
        console.error("Ошибка загрузки товаров:", error);
        toast.error("Не удалось загрузить товары", { duration: 3000 });
      });

    // Загрузка списка категорий
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error("Ошибка загрузки категорий:", error);
        toast.error("Не удалось загрузить категории", { duration: 3000 });
      });

    // Загрузка списка новостей
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((error) => {
        console.error("Ошибка загрузки новостей:", error);
        toast.error("Не удалось загрузить новости", { duration: 3000 });
      });

    // Загрузка списка баннеров
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        // Сортировка: advertising в первую очередь
        const sortedBanners = data.sort((a: Banner, b: Banner) => {
          if (a.status === "advertising" && b.status !== "advertising")
            return -1;
          if (b.status === "advertising" && a.status !== "advertising")
            return 1;
          return 0;
        });
        setBanners(sortedBanners);
      })
      .catch((error) => {
        console.error("Ошибка загрузки баннеров:", error);
        toast.error("Не удалось загрузить баннеры", { duration: 3000 });
      });

    // Загрузка списка пользователей
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Ошибка загрузки пользователей:", error);
        toast.error("Не удалось загрузить пользователей", { duration: 3000 });
      });
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Загрузка...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

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

  const handleAddBanner = () => {
    setEditingBanner({
      _id: "",
      image: "",
      link: "",
      status: "active",
    });
  };

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Container className="py-10 flex flex-col gap-8 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Title
            text="Админ-панель"
            className="text-4xl font-extrabold text-gray-900"
          />
          <Button variant="outline" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-lg font-semibold text-gray-900">
            Добро пожаловать, {session.user.email}!
          </p>
        </div>

        {/* Раздел товаров */}
        <Collapsible.Root
          open={openSections.products}
          onOpenChange={(open) =>
            setOpenSections((prev) => ({ ...prev, products: open }))
          }
        >
          <Collapsible.Trigger asChild>
            <div className="flex justify-between items-center bg-white p-4 rounded-t-xl shadow-md cursor-pointer hover:bg-gray-50">
              <Title
                text="Управление товарами"
                className="text-2xl font-bold text-gray-900"
              />
              {openSections.products ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content className="bg-white p-6 rounded-b-xl shadow-md">
            {!editingProduct && !editingNews && !editingBanner && (
              <Button onClick={handleAddProduct} className="mb-4">
                <Package size={16} className="mr-2" />
                Добавить товар
              </Button>
            )}
            {editingProduct ? (
              <EditProductForm
                product={editingProduct}
                categories={categories}
                onSave={(updatedProduct) => {
                  if (updatedProduct._id) {
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === updatedProduct._id ? updatedProduct : p
                      )
                    );
                  } else {
                    setProducts((prev) => [
                      ...prev,
                      { ...updatedProduct, _id: Date.now().toString() },
                    ]);
                  }
                  setEditingProduct(null);
                  toast.success("Товар сохранён", { duration: 2000 });
                }}
                onCancel={() => setEditingProduct(null)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={() => setEditingProduct(product)}
                    onDelete={() => {
                      fetch(`/api/products/id/${product._id}`, {
                        method: "DELETE",
                      })
                        .then((res) => {
                          if (res.ok) {
                            setProducts((prev) =>
                              prev.filter((p) => p._id !== product._id)
                            );
                            toast.success("Товар удалён", { duration: 2000 });
                          } else {
                            toast.error("Ошибка при удалении товара", {
                              duration: 3000,
                            });
                          }
                        })
                        .catch((error) => {
                          console.error("Ошибка удаления товара:", error);
                          toast.error("Ошибка при удалении товара", {
                            duration: 3000,
                          });
                        });
                    }}
                  />
                ))}
              </div>
            )}
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Раздел новостей */}
        <Collapsible.Root
          open={openSections.news}
          onOpenChange={(open) =>
            setOpenSections((prev) => ({ ...prev, news: open }))
          }
        >
          <Collapsible.Trigger asChild>
            <div className="flex justify-between items-center bg-white p-4 rounded-t-xl shadow-md cursor-pointer hover:bg-gray-50">
              <Title
                text="Управление новостями"
                className="text-2xl font-bold text-gray-900"
              />
              {openSections.news ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content className="bg-white p-6 rounded-b-xl shadow-md">
            {!editingProduct && !editingNews && !editingBanner && (
              <Button onClick={handleAddNews} className="mb-4">
                <Newspaper size={16} className="mr-2" />
                Добавить новость
              </Button>
            )}
            {editingNews ? (
              <EditNewsForm
                news={editingNews}
                onSave={(updatedNews) => {
                  if (updatedNews._id) {
                    setNews((prev) =>
                      prev.map((n) =>
                        n._id === updatedNews._id ? updatedNews : n
                      )
                    );
                  } else {
                    setNews((prev) => [
                      ...prev,
                      { ...updatedNews, _id: Date.now().toString() },
                    ]);
                  }
                  setEditingNews(null);
                  toast.success("Новость сохранена", { duration: 2000 });
                }}
                onCancel={() => setEditingNews(null)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <NewsCard
                    key={item._id}
                    news={item}
                    onEdit={() => setEditingNews(item)}
                    onDelete={() => {
                      fetch(`/api/news?slug=${item.slug}`, {
                        method: "DELETE",
                      })
                        .then((res) => {
                          if (res.ok) {
                            setNews((prev) =>
                              prev.filter((n) => n._id !== item._id)
                            );
                            toast.success("Новость удалена", {
                              duration: 2000,
                            });
                          } else {
                            toast.error("Ошибка при удалении новости", {
                              duration: 3000,
                            });
                          }
                        })
                        .catch((error) => {
                          console.error("Ошибка удаления новости:", error);
                          toast.error("Ошибка при удалении новости", {
                            duration: 3000,
                          });
                        });
                    }}
                  />
                ))}
              </div>
            )}
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Раздел баннеров */}
        <Collapsible.Root
          open={openSections.banners}
          onOpenChange={(open) =>
            setOpenSections((prev) => ({ ...prev, banners: open }))
          }
        >
          <Collapsible.Trigger asChild>
            <div className="flex justify-between items-center bg-white p-4 rounded-t-xl shadow-md cursor-pointer hover:bg-gray-50">
              <Title
                text="Управление баннерами"
                className="text-2xl font-bold text-gray-900"
              />
              {openSections.banners ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content className="bg-white p-6 rounded-b-xl shadow-md">
            {!editingProduct && !editingNews && !editingBanner && (
              <Button onClick={handleAddBanner} className="mb-4">
                <Image size={16} className="mr-2" />
                Добавить баннер
              </Button>
            )}
            {editingBanner ? (
              <EditBannerForm
                banner={editingBanner}
                onSave={(updatedBanner) => {
                  if (updatedBanner._id) {
                    setBanners((prev) =>
                      prev.map((b) =>
                        b._id === updatedBanner._id ? updatedBanner : b
                      )
                    );
                  } else {
                    setBanners((prev) => [
                      ...prev,
                      { ...updatedBanner, _id: Date.now().toString() },
                    ]);
                  }
                  setEditingBanner(null);
                  toast.success("Баннер сохранён", { duration: 2000 });
                }}
                onCancel={() => setEditingBanner(null)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <BannerCard
                    key={banner._id}
                    banner={banner}
                    onEdit={() => setEditingBanner(banner)}
                    onDelete={() => {
                      fetch(`/api/banners/${banner._id}`, {
                        method: "DELETE",
                      })
                        .then((res) => {
                          if (res.ok) {
                            setBanners((prev) =>
                              prev.filter((b) => b._id !== banner._id)
                            );
                            toast.success("Баннер удалён", { duration: 2000 });
                          } else {
                            toast.error("Ошибка при удалении баннера", {
                              duration: 3000,
                            });
                          }
                        })
                        .catch((error) => {
                          console.error("Ошибка удаления баннера:", error);
                          toast.error("Ошибка при удалении баннера", {
                            duration: 3000,
                          });
                        });
                    }}
                  />
                ))}
              </div>
            )}
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Раздел пользователей */}
        <Collapsible.Root
          open={openSections.users}
          onOpenChange={(open) =>
            setOpenSections((prev) => ({ ...prev, users: open }))
          }
        >
          <Collapsible.Trigger asChild>
            <div className="flex justify-between items-center bg-white p-4 rounded-t-xl shadow-md cursor-pointer hover:bg-gray-50">
              <Title
                text="Список пользователей"
                className="text-2xl font-bold text-gray-900"
              />
              {openSections.users ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content className="bg-white p-6 rounded-b-xl shadow-md">
            <ul className="flex flex-col gap-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.name || "Без имени"}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Роль: {user.role === "admin" ? "Админ" : "Пользователь"}
                  </p>
                </li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminPage;
