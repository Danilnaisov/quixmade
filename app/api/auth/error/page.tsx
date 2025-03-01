"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Разбор ошибок для вывода понятных сообщений
  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Неверный логин или пароль.";
      case "User not found":
        return "Пользователь не найден.";
      case "Invalid credentials":
        return "Неверные учетные данные.";
      default:
        return error || "Произошла неизвестная ошибка.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-500">Ошибка авторизации</h1>
        <p className="mt-4 text-gray-700">{getErrorMessage(error)}</p>
        <Link href="/api/auth/login">
          <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Вернуться к входу
          </button>
        </Link>
      </div>
    </div>
  );
}
