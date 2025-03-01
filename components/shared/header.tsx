"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { HeaderNavigationMenu } from "./navigationmenu";
import { Container } from "./container";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "font-[family-name:var(--font-MontserratAlternates)] bg-[rgba(255,255,255,1)] shadow-[0px_4px_25px_0px_rgba(200,200,200,0.25)]",
        className
      )}
    >
      <Container className="flex items-center justify-between py-4">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="logo" width={170} height={49} />
        </Link>
        <div>
          <HeaderNavigationMenu />
        </div>
        <div className="flex gap-8">
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
