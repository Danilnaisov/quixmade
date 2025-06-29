import { Banner, CardList, Footer, Header } from "@/components/shared";
import type { Metadata } from "next";
import Script from "next/script";
import YandexMetrika from "@/components/YandexMetrika";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "QuixMade | Интернет-магазин",
  description:
    "Купить игровую периферию и игровые девайсы Akko, Nuphy и других брендов в интернет-магазине QuixMade. Большой выбор, доступные цены, доставка по всей России.",
  openGraph: {
    title: "QuixMade | Интернет-магазин",
    description:
      "Купить игровую периферию и игровые девайсы Akko, Nuphy и других брендов в интернет-магазине QuixMade. Большой выбор, доступные цены, доставка по всей России.",
    url: "https://www.quixmade.ru/",
    siteName: "QuixMade",
    images: [
      {
        url: "https://made.quixoria.ru/logo_min.jpg",
        width: 1200,
        height: 630,
        alt: "QuixMade | Интернет-магазин",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuixMade | Интернет-магазин",
    description:
      "Купить игровую периферию и игровые девайсы Akko, Nuphy и других брендов в интернет-магазине QuixMade. Большой выбор, доступные цены, доставка по всей России.",
    images: ["https://made.quixoria.ru/logo_min.jpg"],
  },
};

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Script
        id="index-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "QuixMade | Интернет-магазин",
            description:
              "Купить игровую периферию и игровые девайсы Akko, Nuphy и других брендов в интернет-магазине QuixMade. Большой выбор, доступные цены, доставка по всей России.",
            url: "https://www.quixmade.ru",
            image: "https://made.quixoria.ru/logo.svg",
            publisher: {
              "@type": "Organization",
              name: "QuixMade",
              logo: {
                "@type": "ImageObject",
                url: "https://made.quixoria.ru/logo.svg",
              },
            },
          }),
        }}
      />
      <Script id="metrika-counter" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(100492983, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true,
                  trackHash:true
            });`}
      </Script>
      <Suspense>
        <YandexMetrika />
      </Suspense>
      <Header />
      <Banner />
      <CardList text="Горячие хиты 🔥" count={5} type="hot" />
      <CardList count={10} />
      <CardList text="Поможем вам с выбором" type="help" />
      <CardList count={15} />
      <Footer />
    </div>
  );
}
