"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

const catalog: { title: string; href: string; description: string }[] = [
  {
    title: "Все товары",
    href: "/catalog",
    description: "Премиум и бюджетный девайсы на любой вкус.",
  },
  {
    title: "Клавиатуры",
    href: "/catalog/keyboards",
    description: "Механические и мембранные клавиатуры.",
  },
  {
    title: "Мыши",
    href: "/catalog/mouses",
    description: "Игровые и офисные мыши.",
  },
  {
    title: "Макропады",
    href: "/catalog/macro",
    description: "Компактные устройства - мини клавиатуры.",
  },
];

const accessories: { title: string; href: string; description: string }[] = [
  {
    title: "Ковры",
    href: "/catalog/pads",
    description: "Игровые и офисные коврики для мыши.",
  },
  {
    title: "Кабели",
    href: "/catalog/cable",
    description: "USB-кабели для подключения устройств.",
  },
  {
    title: "Клавиши",
    href: "/catalog/keycaps",
    description: "Сменные клавишные колпачки.",
  },
  {
    title: "Подставки",
    href: "/catalog/stand",
    description: "Подставки обеспечивающие комфорт при длительной работе.",
  },
];

interface HeaderNavigationMenuProps {
  isMobile?: boolean;
}

export function HeaderNavigationMenu({ isMobile }: HeaderNavigationMenuProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col gap-2">
        {/* Каталог */}
        <div>
          <button
            onClick={() => toggleSubMenu("catalog")}
            className="flex items-center justify-between w-full text-[#274C5B] text-lg font-bold py-2"
          >
            Каталог
            <ChevronDown
              className={cn(
                "ml-2 transition-transform",
                openMenu === "catalog" && "rotate-180"
              )}
              size={20}
            />
          </button>
          {openMenu === "catalog" && (
            <ul className="pl-4 flex flex-col gap-2">
              {catalog.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="block text-[#274C5B] text-base hover:text-[#006933] transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Аксессуары */}
        <div>
          <button
            onClick={() => toggleSubMenu("accessories")}
            className="flex items-center justify-between w-full text-[#274C5B] text-lg font-bold py-2"
          >
            Аксессуары
            <ChevronDown
              className={cn(
                "ml-2 transition-transform",
                openMenu === "accessories" && "rotate-180"
              )}
              size={20}
            />
          </button>
          {openMenu === "accessories" && (
            <ul className="pl-4 flex flex-col gap-2">
              {accessories.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="block text-[#274C5B] text-base hover:text-[#006933] transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Новости */}
        <Link
          href="/news"
          className="text-[#274C5B] text-lg font-bold py-2 hover:text-[#006933] transition-colors"
        >
          Новости
        </Link>

        {/* О нас */}
        <Link
          href="/about"
          className="text-[#274C5B] text-lg font-bold py-2 hover:text-[#006933] transition-colors"
        >
          О нас
        </Link>
      </nav>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[#274C5B] text-lg font-bold bg-transparent hover:bg-gray-100">
            Каталог
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {catalog.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[#274C5B] text-lg font-bold bg-transparent hover:bg-gray-100">
            Аксессуары
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {accessories.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/news" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "text-[#274C5B] text-lg font-bold bg-transparent hover:bg-gray-100"
              )}
            >
              Новости
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "text-[#274C5B] text-lg font-bold bg-transparent hover:bg-gray-100"
              )}
            >
              О нас
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[#006933] focus:bg-gray-100 focus:text-[#006933]",
            className
          )}
          {...props}
        >
          <div className="text-lg text-[#274C5B] font-bold leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
