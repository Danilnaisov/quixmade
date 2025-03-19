import { Container, Header, Footer, Title } from "@/components/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import { AnimatedSection, AnimatedDiv } from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Подписка | QuixMade",
  description:
    "Подпишитесь на новости QuixMade, чтобы быть в курсе новинок, обзоров и трендов в мире технологий!",
};

export default function SubscribePage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-6 bg-gray-50">
      <Header />
      <Container className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <AnimatedDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            text="Подпишитесь на наши новости!"
            size="lg"
            className="font-extrabold text-gray-900 leading-tight text-3xl sm:text-4xl lg:text-5xl mb-6 text-center"
          />
        </AnimatedDiv>
        <AnimatedSection className="mb-8">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-center mb-8">
            Будьте в курсе новинок, обзоров и трендов в мире технологий! Мы
            отправляем только полезный контент, без спама.
          </p>
          <div className="flex flex-col items-center">
            <div className="flex w-full max-w-md items-center space-x-2 bg-[#274C5B] rounded-[20px] p-2">
              <Input
                className="text-white text-[18px] font-medium placeholder:text-white border-transparent h-[50px]"
                type="email"
                placeholder="Введите e-mail"
              />
              <Button className="bg-[#0889e5] text-[18px] font-extrabold rounded-[20px] h-[50px] hover:bg-[#1b547c]">
                Подписаться
              </Button>
            </div>
            <p className="text-gray-700 text-[13px] font-[500] text-center pt-3">
              Нажимая на кнопку Подписаться, вы даёте соглашение на обработку
              персональных данных.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection className="text-center">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
            Уже подписаны? Вернитесь на главную страницу!
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors"
            >
              На главную
            </Button>
          </Link>
        </AnimatedSection>
      </Container>
      <Footer />
    </div>
  );
}
