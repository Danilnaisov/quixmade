import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db("quixmade");
          const user = await db.collection("users").findOne({
            $or: [{ login: credentials?.login }, { email: credentials?.login }],
          });
          if (!user) {
            console.log("Пользователь не найден");
            throw new Error("Пользователь не найден");
          }

          const isPasswordValid = await compare(
            credentials?.password || "",
            user.password_hash
          );
          if (!isPasswordValid) {
            console.log("Неверный пароль");
            throw new Error("Неверный пароль");
          }

          console.log("Авторизация прошла успешно");
          return {
            id: user._id.toString(),
            email: user.email,
            login: user.login,
            role: user.role,
          };
        } catch (error) {
          console.error("Ошибка при авторизации:", error);
          throw new Error(error.message || "Ошибка авторизации");
        }
      },
    }),
  ],
  callbacks: {
    // Добавляем ID пользователя в токен
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/auth/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
