"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { HeaderNavigationMenu } from "./navigationmenu";
import { Container } from "./container";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            width={40}
            height={40}
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
            <Link href="/search">
              <Search color="#274C5B" size={24} />
            </Link>
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
