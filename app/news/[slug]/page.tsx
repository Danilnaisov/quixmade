import { getNewsBySlug } from "@/app/api/api_utils";
import {
  Container,
  Footer,
  Header,
  Title,
} from "@/components/shared";
import { Metadata } from "next";
import Image from 'next/image';

export async function generateMetadata({
    params,
  }: {
    params: { slug: string };
  }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getNewsBySlug(slug);
  
    return {
      title: product ? `${product.short_name}` : "QuixMade: Новость не найдена",
      description: product?.short_description || "Описание Новости",
    };
  }

export default async function ProductPage({
    params,
  }: {
    params: { slug: string };
  }) {
    const { slug } = await params;
    const product = await getNewsBySlug(slug);
  
    if (!product) {
      return <div className="text-center text-2xl mt-10">Новость не найдена</div>;
    }
  
    return (
      <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen gap-4">
        <Header />
        <Container className="bg-[#F9F8F8] rounded-[40px] p-10 w-full">
          <Title text={product.short_name} size="md" className="font-extrabold"/>
          <Image
            src={product.image}
            width={1000}
            height={1000}
            alt="Картинка"
            className="max-w-[400px]  max-h-[400px] object-contain"
            />
          <p>{product.desc}</p>
        </Container>
        <Footer />
      </div>
    );
  }
  