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
      <NewsList />
      <Footer />
    </div>
  );
}
