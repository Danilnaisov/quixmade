import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer
      className={cn(
        "flex flex-col gap-8 items-center justify-center text-[#274C5B] mt-12 pb-4 bg-white",
        className
      )}
    >
      <hr className="w-full border-[#E8E8E1]" />

      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#274C5B] mb-4">
          Делимся полезным контентом
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Подпишитесь, чтобы быть в курсе новинок и обзоров!
        </p>
        <div className="flex w-full max-w-[825px] items-center space-x-2 bg-[#274C5B] rounded-[20px] p-2 mx-auto">
          <Input
            className="max-w-[825px] text-white text-[16px] sm:text-[18px] font-medium placeholder:text-white border-transparent h-[50px]"
            type="email"
            placeholder="Введите e-mail"
          />
          <Button className="bg-[#0889e5] text-[16px] sm:text-[18px] font-extrabold rounded-[20px] h-[50px] hover:bg-[#1b547c]">
            Подписаться
          </Button>
        </div>
        <p className="text-[12px] sm:text-[13px] font-[500] text-gray-500 text-center pt-3">
          Нажимая на кнопку Подписаться, вы даёте соглашение на обработку
          персональных данных
        </p>
      </div>

      <hr className="w-full border-[#E8E8E1]" />

      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4">
          <a
            href="https://t.me/quixmade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#274C5B] hover:text-blue-600 transition-colors"
          >
            {/* <Telegram size={24} /> */}
          </a>
          <a
            href="https://vk.com/quixmade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#274C5B] hover:text-blue-600 transition-colors"
          >
            {/* <Vk size={24} /> */}
          </a>
          <a
            href="https://instagram.com/quixmade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#274C5B] hover:text-blue-600 transition-colors"
          >
            {/* <Instagram size={24} /> */}
          </a>
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-center text-[#274C5B]">
          Механические клавиатуры и аксессуары для рабочего места
        </h3>
        <p className="text-[12px] sm:text-[14px] font-medium text-gray-500 text-center">
          ООО «КвиксМейд», ОГРН: 123123, Юр. адрес: 614000, Пермский край, г.
          Пермь, ул. Луначарского, 24/3
        </p>
        <p className="text-[12px] sm:text-[14px] font-medium text-gray-500 text-center">
          © 2024-2025 QuixMade. Все права защищены.
        </p>
      </div>
    </footer>
  );
};
