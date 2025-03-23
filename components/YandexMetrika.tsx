/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    ym(100492983, "hit", url);
  }, [pathname, searchParams]);

  return null;
}
