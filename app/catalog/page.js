"use client";

import { loadHothits } from "../api/api_utils";
import React, { useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import Styles from "../CardList/CardList.module.css";
import Card from "../Card/Card";
import { cardsData } from "../api/data/cards";
import { LittleCardList } from "../LittleCardList/LittleCardList";

const catalog = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchHothits = async () => {
      const data = await loadHothits();
      setProducts(data || []);
    };
    fetchHothits();
  }, []);
  return (
    <PageTemplate pagename="Каталог">
      <LittleCardList prop={cardsData} />
      <h1>Популярные товары</h1>
      <div className={Styles.card__list}>
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </PageTemplate>
  );
};

export default catalog;
