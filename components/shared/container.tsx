import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
