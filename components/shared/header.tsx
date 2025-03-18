"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { HeaderNavigationMenu } from "./navigationmenu";
import { Container } from "./container";
import { useSession } from "next-auth/react";
import { HeaderNavigationMenuMini } from "./navigationmenumini";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "header font-[family-name:var(--font-MontserratAlternates)] bg-[rgba(255,255,255,1)] shadow-[0px_4px_25px_0px_rgba(200,200,200,0.25)]",
        className
      )}
    >
      <Container className="flex items-center justify-between py-4 mx-auto">
        <Link href={"/"} className="logo">
          <Image src="/logo.svg" alt="logo" width={170} height={49} />
        </Link>
        <Link href={"/"} className="logo_min">
          <Image
            src="/logo_min.svg"
            alt="logo"
            width={80}
            height={80}
            className="w-10 h-10 min-w-10"
          />
        </Link>
        <div className="header_nav">
          <HeaderNavigationMenu />
        </div>
        <div className="header_nav_min">
          <HeaderNavigationMenuMini />
        </div>
        <div className="flex justify-between w-full max-w-[120px]">
          <Link href={""}>
            <Search color="#274C5B" />
          </Link>
          {/* Если авторизован, то /cart, если нет то /api/auth/login */}
          <Link href={session ? "/cart" : "/api/auth/login"}>
            <ShoppingBag color="#274C5B" />
          </Link>
          {/* Если авторизован, то /user, если нет то /api/auth/login */}
          <Link href={session ? "/user" : "/api/auth/login"}>
            <UserRound color="#274C5B" />
          </Link>
        </div>
      </Container>
    </header>
  );
};
