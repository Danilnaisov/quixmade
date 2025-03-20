import { Container, Footer, Header, Title } from "@/components/shared";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import {
  AnimatedSection,
  AnimatedDiv,
  AnimatedTeamMember,
} from "@/components/AnimatedSection";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "О нас | QuixMade",
  description:
    "Узнайте больше о QuixMade — нашей команде, миссии и ценностях. Мы делимся новостями и обзорами технологий для вас!",
};

export default function AboutPage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-6 bg-gray-50">
      <Header />
      <Container className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatedDiv>
          <Breadcrumb className="mb-4 w-full overflow-hidden">
            <BreadcrumbList className="flex flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-600 hover:underline">
                    Главная
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-800 truncate text-wrap">
                  О нас
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedDiv>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <AnimatedDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title
              text="О нас"
              size="lg"
              className="font-extrabold text-gray-900 leading-tight text-xl sm:text-2xl lg:text-3xl mb-6"
            />
          </AnimatedDiv>

          {/* Добро пожаловать */}
          <AnimatedSection className="mb-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Добро пожаловать на QuixMade! Мы — команда энтузиастов технологий,
              которые стремятся делиться самыми свежими новостями, обзорами и
              трендами из мира гаджетов, электроники и инноваций. Наша миссия —
              помогать вам быть в курсе новинок и выбирать лучшие устройства для
              ваших нужд.
            </p>
          </AnimatedSection>

          {/* Наша история */}
          <AnimatedSection className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Наша история
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              QuixMade был основан в 2023 году небольшой группой друзей,
              увлечённых технологиями. Мы заметили, что в интернете не хватает
              качественного ресурса, который бы предоставлял объективные и
              подробные обзоры гаджетов на русском языке. Так родилась идея
              создать платформу, где каждый сможет найти полезную информацию о
              новинках, от клавиатур до смартфонов.
            </p>
          </AnimatedSection>

          {/* Наша команда */}
          <AnimatedSection className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Наша команда
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatedTeamMember className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/dan.jpg"
                    alt="Четин Данил"
                    fill
                    className="object-cover "
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Четин Данил
                </h3>
                <p className="text-gray-600 text-sm">Разработчик</p>
                <p className="text-gray-700 text-center text-sm mt-2">
                  Данил — технический гений нашей команды. Он отвечает за
                  разработку и поддержку сайта, обеспечивая его бесперебойную
                  работу и удобство для пользователей.
                </p>
                <a href="" className="text-blue-600 hover:underline">
                  Telegram
                </a>
                <a
                  href="mailto:danil.chetin@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  danil.chetin@gmail.com
                </a>
              </AnimatedTeamMember>
              <AnimatedTeamMember className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/egor.jpg"
                    alt="Власов Егор"
                    fill
                    className="object-cover "
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Власов Егор
                </h3>
                <p className="text-gray-600 text-sm">Главный редактор</p>
                <p className="text-gray-700 text-center text-sm mt-2">
                  Егор — идейный вдохновитель и главный редактор QuixMade. Он
                  следит за качеством контента, выбирает самые интересные темы
                  для обзоров и всегда в курсе последних трендов в мире
                  технологий.
                </p>
                <a href="" className="text-blue-600 hover:underline">
                  Telegram
                </a>
                <a
                  href="mailto:shtorm2006@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  shtorm2006@gmail.com
                </a>
              </AnimatedTeamMember>
              <AnimatedTeamMember className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/ars.jpg"
                    alt="Шимов Арсений"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Шимов Арсений
                </h3>
                <p className="text-gray-600 text-sm flex gap-1">
                  Что он тут делает
                  <HelpCircle size={20} className="text-gray-600" />
                </p>
                <p className="text-gray-700 text-center text-sm mt-2">
                  Арсений — загадка нашей команды. Он приносит кофе и
                  &#34;тестирует{" "}
                  <b>
                    <i>визуальную эстетику</i>
                  </b>
                  &#34;, глядя на экран с трёх метров. Что он тут делает?
                </p>
                <p className="text-blue-600 cursor-pointer hover:underline">
                  Мы не знаем его
                </p>
              </AnimatedTeamMember>
            </div>
          </AnimatedSection>

          {/* Наши ценности */}
          <AnimatedSection className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Наши ценности
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base sm:text-lg">
              <li>Честность и объективность в обзорах</li>
              <li>Доступность информации для всех</li>
              <li>Стремление к инновациям и качеству</li>
              <li>Уважение к нашим читателям</li>
            </ul>
          </AnimatedSection>

          {/* Подписка */}
          <AnimatedSection className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Присоединяйтесь к нам!
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">
              Хотите быть в курсе всех новинок? Подписывайтесь на наши новости и
              следите за обновлениями!
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Подписаться
            </Link>
          </AnimatedSection>
        </div>

        {/* Контакты */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mt-4">
          <AnimatedDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title
              text="Свяжитесь с нами"
              size="lg"
              className="font-extrabold text-gray-900 leading-tight text-xl sm:text-2xl lg:text-3xl mb-6"
            />
          </AnimatedDiv>
          <AnimatedSection className="mb-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
              Мы всегда рады вашим вопросам и предложениям! Свяжитесь с нами
              через форму ниже или по указанным контактам.
            </p>
            <form className="space-y-4" action={""} method="POST">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium"
                >
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ваш email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium"
                >
                  Сообщение
                </label>
                <textarea
                  id="message"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={4}
                  placeholder="Ваше сообщение"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Отправить
              </button>
            </form>
          </AnimatedSection>
          <AnimatedSection>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Наши контакты
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Email:{" "}
              <a
                href="mailto:info@quixmade.ru"
                className="text-blue-600 hover:underline"
              >
                info@quixmade.ru
              </a>
              <br />
              Телефон:{" "}
              <a
                href="tel:+79991234567"
                className="text-blue-600 hover:underline"
              >
                +7 (999) 123-45-67
              </a>
              <br />
              Мы в соцсетях:{" "}
              <a href="" className="text-blue-600 hover:underline">
                Telegram
              </a>
              ,{" "}
              <a href="" className="text-blue-600 hover:underline">
                ВКонтакте
              </a>
            </p>
          </AnimatedSection>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
