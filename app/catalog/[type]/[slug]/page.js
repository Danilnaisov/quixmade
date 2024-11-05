"use client";

import { useEffect, useState } from "react";
import { loadProductBySlug } from "../../../api/api_utils"; // Adjust the path as necessary
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound"; // Import your Notfound component
import { useParams } from "next/navigation"; // Import useParams

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      if (slug) {
        const productData = await loadProductBySlug(slug);
        setProduct(productData);
      }
      setPreloaderVisible(false);
    }
    fetchProduct();
  }, [slug]);
  return (
    <div>
      {product ? (
        <div>
          <h1>Продукт: {product.title}</h1>
          <img src={product.image} alt={product.title} />
          <p>Цена: {product.price} ₽</p>
          {product.saleprice && <p>Цена со скидкой: {product.saleprice} ₽</p>}
          <button>Купить</button>
        </div>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <Notfound />
      )}
    </div>
  );
}
