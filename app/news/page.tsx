import { Footer, Header, NewsList } from "@/components/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: Новости",
  description: "QuixMade: Новости",
};

export default async function ProductPage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6">Новости</h1>
      <NewsList />
      <Footer />
    </div>
  );
}
