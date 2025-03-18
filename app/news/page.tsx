import { getAllNews } from "@/app/api/api_utils";
import {
  Container,
  Footer,
  Header,
  Title,
} from "@/components/shared";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import Image from 'next/image';

export const metadata: Metadata = {
  title: "QuixMade: Новости",
  description: "QuixMade: Новости",
};

interface News {
  _id: ObjectId,
  short_name: string,
  short_desc: string,
  desc: string,
  slug: string,
  image: string,
}
export default async function ProductPage() {
    const news = await getAllNews();
  
    if (!news) {
      return <div className="text-center text-2xl mt-10">Новости не найдена</div>;
    }
  
    return (
      <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
        <Header />
        <Container className="flex flex-col gap-4">
          {news.map((item) => (
            <div className="bg-[#F9F8F8] rounded-[40px] p-10 w-full">
              <Title text={item.short_name} size="md" className="font-extrabold"/>
              <Image
                src={item.image}
                width={1000}
                height={1000}
                alt="Картинка"
                className="max-w-[400px]  max-h-[400px] object-contain"
                />
              <p>{item.short_desc}</p>
            </div>
          ))}
        </Container>
        <Footer />
      </div>
    );
  }
  