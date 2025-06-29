/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Перенесем логику проверки IP непосредственно в endpoint регистрации
  // так как некоторые модули не поддерживаются в Edge Runtime
  return NextResponse.next();
}

export const config = {
  matcher: "/api/register",
};
