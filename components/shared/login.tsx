"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

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

interface Props {
  className?: string;
}

export const LoginPage: React.FC<Props> = ({ className }) => {
  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState({
    email: "",
    login: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await signIn("credentials", {
        ...loginData,
        redirect: false,
      });

      if (res?.error) {
        console.log("Ошибка при авторизации: ", res.error);
        setError(res.error);
      } else {
        console.log("Успешная авторизация");
        router.push("/");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError("Произошла ошибка при входе");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ошибка при регистрации");
      } else {
        setError(null);
        alert("Регистрация успешна! Теперь вы можете войти.");
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setError("Произошла ошибка при регистрации");
    }
  };

  return (
    <Tabs defaultValue="registrarion" className={cn("w-[400px]", className)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="registrarion">Регистрация</TabsTrigger>
        <TabsTrigger value="login">Авторизация</TabsTrigger>
      </TabsList>

      {/* Регистрация */}
      <TabsContent value="registrarion">
        <Card>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                value={registerData.login}
                onChange={(e) =>
                  setRegisterData({ ...registerData, login: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Введите пароль</Label>
              <Input
                id="password"
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleRegister}>Зарегестрироваться</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Авторизация */}
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="Login">Логин / email</Label>
              <Input
                id="Login"
                type="text"
                value={loginData.login}
                onChange={(e) =>
                  setLoginData({ ...loginData, login: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="Password"
                type="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleLogin}>Войти</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
