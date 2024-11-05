"use client";

import { useEffect, useState } from "react";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound";
import { loadProductsByType } from "@/app/api/api_utils";
import { useParams } from "next/navigation";
import PageTemplate from "@/app/components/PageTemplate";
import Styles from "@/app/CardList/CardList.module.css";
import Card from "@/app/Card/Card";

export default function ProductTypePage() {
  const { type } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      if (type) {
        const productsData = await loadProductsByType(type);
        setProducts(productsData);
      }
      setPreloaderVisible(false);
    }
    fetchProducts();
  }, [type]);

  return (
    <>
      {products.length > 0 ? (
        <PageTemplate pagename={products[1].pagename}>
          <div className={Styles.card__list}>
            {products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </PageTemplate>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <Notfound />
      )}
    </>
  );
}
