import { Footer, Header } from "@/components/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuixMade: О нас",
  description: "QuixMade: О нас",
};

export default async function AboutPage() {
  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
      <Header />
      <Footer />
    </div>
  );
}
