"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

export function HeaderNavigationMenuMini() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-between">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-[#274C5B] text-xl font-extrabold">
            Каталог
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {catalog.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-lg text-[#274C5B] font-bold leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-sm text-[#274C5B] leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
