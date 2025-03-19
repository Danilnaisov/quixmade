import { Container, Header, Footer, Title } from "@/components/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Animated404 } from "@/components/Animated404";

export default function NotFound() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-6">
      <Header />
      <Container className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center flex-grow">
        <div className="text-center">
          <Animated404 />{" "}
          <Title
            text="404 - Страница не найдена"
            size="lg"
            className="font-extrabold text-gray-900 leading-tight text-3xl sm:text-4xl lg:text-5xl mb-4"
          />
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
            Ой! Кажется, мы не можем найти эту страницу. Возможно, вы ввели
            неправильный адрес или страница была удалена.
          </p>
          <Link href="/">
            <Button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
