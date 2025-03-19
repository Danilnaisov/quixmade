"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { HeaderNavigationMenu } from "./navigationmenu";
import { Container } from "./container";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Импортируем компоненты Dialog из shadcn/ui
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/shared/card"; // Импортируем Card для отображения результатов

interface Product {
  _id: string;
  category_id: string;
  slug: string;
  name: string;
  price: number;
  short_description: string;
  description: string;
  features: Record<string, string | number | boolean>;
  images: string[];
  stock_quantity: number;
  isDiscount: boolean;
  discountedPrice: number;
  isHotHit: boolean;
  category: {
    _id: string;
    name: string;
    name_ru?: string;
  };
}

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Состояние для модального окна поиска
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const [products, setProducts] = useState<Product[]>([]); // Состояние для результатов поиска
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Обработчик поиска
  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        if (!response.ok) {
          throw new Error("Не удалось загрузить товары");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <header
      className={cn(
        "header font-[family-name:var(--font-MontserratAlternates)] bg-white shadow-md",
        className
      )}
    >
      <Container className="flex items-center justify-between py-4 mx-auto">
        {/* Логотип */}
        <Link href="/" className="logo">
          <Image src="/logo.svg" alt="logo" width={170} height={49} priority />
        </Link>
        <Link href="/" className="logo_min">
          <Image
            src="/logo_min.svg"
            alt="logo"
            width={1000}
            height={1000}
            className="w-10 h-10 min-w-10"
            priority
          />
        </Link>

        {/* Навигация для десктопа */}
        <div className="hidden lg:flex">
          <HeaderNavigationMenu />
        </div>

        {/* Иконки */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Модальное окно поиска */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button aria-label="Open search">
                  <Search color="#274C5B" size={24} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto fixed left-1/2 transform -translate-x-1/2 z-50">
                <DialogHeader>
                  <DialogTitle>Поиск товаров</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {/* Поле ввода для поиска */}
                  <Input
                    type="text"
                    placeholder="Введите название товара..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                  {/* Результаты поиска */}
                  <div className="mt-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                      </div>
                    ) : products.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <Card
                            key={product._id}
                            product={{
                              ...product,
                              images: product.images || [],
                              price: product.price || 0,
                              short_description:
                                product.short_description || "",
                              stock_quantity: product.stock_quantity || 0,
                              isDiscount: product.isDiscount || false,
                              discountedPrice: product.discountedPrice || 0,
                              isHotHit: product.isHotHit || false,
                            }}
                          />
                        ))}
                      </div>
                    ) : searchQuery.trim() ? (
                      <div className="text-center text-gray-500">
                        По запросу {searchQuery} ничего не найдено
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        Введите запрос для поиска
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Link href={session ? "/cart" : "/api/auth/login"}>
              <ShoppingBag color="#274C5B" size={24} />
            </Link>
            <Link href={session ? "/user" : "/api/auth/login"}>
              <UserRound color="#274C5B" size={24} />
            </Link>
          </div>

          {/* Кнопка гамбургер-меню для мобильных */}
          <button
            className="lg:hidden text-[#274C5B]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </Container>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <Container className="py-4">
            <HeaderNavigationMenu isMobile />
          </Container>
        </div>
      )}
    </header>
  );
};
