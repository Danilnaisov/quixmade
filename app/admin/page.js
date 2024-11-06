"use client";

import { loadHothits } from "../api/api_utils";
import React, { useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import Styles from "./AdminPannel.module.css";
import LongCard from "../LongCard/LongCard";
import Link from "next/link";

const apdminpanel = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchHothits = async () => {
      const data = await loadHothits();
      setProducts(data || []);
    };
    fetchHothits();
  }, []);
  return (
    <PageTemplate pagename="Панель администратора">
      <div className={Styles.main__block}>
        <div className={Styles.items__header}>
          <h3>Товары на сайте</h3>
          <Link href={""}>
            <img src="/img/svg/add.svg" alt="" />
          </Link>
        </div>
        <hr />
        {products.map((product) => (
          <LongCard key={product.id} product={product} />
        ))}
      </div>
    </PageTemplate>
  );
};

export default apdminpanel;
