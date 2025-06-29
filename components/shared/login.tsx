"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";

interface Props {
  className?: string;
}

export const LoginPage: React.FC<Props> = ({ className }) => {
  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    login: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!loginData.login || !loginData.password) {
      setError("Заполните все поля");
      toast.error("Заполните все поля", { duration: 3000 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        login: loginData.login,
        password: loginData.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Неверный логин или пароль");
        toast.error("Неверный логин или пароль", { duration: 3000 });
      } else {
        toast.success("Успешный вход!", { duration: 2000 });
        router.push("/");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError("Произошла ошибка при входе");
      toast.error("Произошла ошибка при входе", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.email || !registerData.login || !registerData.password) {
      setError("Заполните все поля");
      toast.error("Заполните все поля", { duration: 3000 });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      setError("Неверный формат email");
      toast.error("Неверный формат email", { duration: 3000 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error);
          toast.error(data.error, { duration: 5000 });
        } else {
          setError(data.error || "Ошибка при регистрации");
          toast.error(data.error || "Ошибка при регистрации", {
            duration: 3000,
          });
        }
      } else {
        toast.success("Регистрация успешна! Выполняется вход...", {
          duration: 2000,
        });

        const signInResponse = await signIn("credentials", {
          login: registerData.login,
          password: registerData.password,
          redirect: false,
        });

        if (signInResponse?.ok) {
          router.push("/");
        } else {
          setError("Ошибка при автоматическом входе");
          toast.error("Ошибка при автоматическом входе", { duration: 3000 });
        }
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setError("Произошла ошибка при регистрации");
      toast.error("Произошла ошибка при регистрации", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDownLogin = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleKeyDownRegister = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <Tabs defaultValue="login" className={cn("w-[400px]", className)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Вход</TabsTrigger>
        <TabsTrigger value="registration">Регистрация</TabsTrigger>
      </TabsList>

      {/* Авторизация */}
      <TabsContent value="login">
        <Card className="shadow-lg border border-gray-200 p-5">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Вход
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-gray-700">
                Логин или email
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="login"
                  type="text"
                  value={loginData.login}
                  onChange={(e) =>
                    setLoginData({ ...loginData, login: e.target.value })
                  }
                  className="pl-10"
                  placeholder="Введите логин или email"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Пароль
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="pl-10"
                  placeholder="Введите пароль"
                  onKeyDown={handleKeyDownLogin}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#006933] hover:bg-[#004d24] text-white"
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="registration">
        <Card className="shadow-lg border border-gray-200 p-5">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Регистрация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="pl-10"
                  placeholder="Введите email"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-reg" className="text-gray-700">
                Логин
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="login-reg"
                  value={registerData.login}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, login: e.target.value })
                  }
                  className="pl-10"
                  placeholder="Придумайте логин"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-reg" className="text-gray-700">
                Пароль
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password-reg"
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDownRegister}
                  className="pl-10"
                  placeholder="Придумайте пароль"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-[#006933] hover:bg-[#004d24] text-white"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
