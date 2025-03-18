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
        "flex flex-col gap-10 items-center justify-center text-[#274C5B] py-10",
        className
      )}
    >
      <hr className="w-full border-[#E8E8E1]" />
      <h2 className="text-[32px] font-extrabold text-center">
        Делимся полезным контентом. Присоединяйтесь!
      </h2>
      <div>
        <div className="flex w-full max-w-[825px] items-center space-x-2 bg-[#274C5B] rounded-[20px] p-2">
          <Input
            className="max-w-[825px] text-white text-[20px] font-medium placeholder:text-white border-transparent h-[50px]"
            type="email"
            placeholder="Введите e-mail"
          />
          <Button className="bg-[#0889e5] text-[20px] font-extrabold rounded-[20px] h-[50px] hover:bg-[#1b547c]">
            Подписаться
          </Button>
        </div>
        <p className="text-[13px] font-[500] text-center pt-3">
          Нажимая на кнопку Подписаться, вы даёте соглашение на обработку
          персональных данных
        </p>
      </div>
      <hr className="w-full border-[#E8E8E1]" />
      <div className="flex flex-col gap-2 items-center">
        <h3 className="text-[24x] font-extrabold text-center">
          Механические клавиатуры и аксессуары для рабочего места
        </h3>
        <h4 className="text-[16px] font-extrabold text-center">
          ООО «квиксмейд», ОГРН: 123123, Юр. адрес: 614000, Пермский край, г.
          Пермь, ул. Луначарского, 24/3 © 2024-2025 QuixMade
        </h4>
      </div>
    </footer>
  );
};
