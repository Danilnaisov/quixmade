"use client";

import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import Styles from "../CardList/CardList.module.css";
import Styles2 from "../page.module.css";
import Link from "next/link";
import { loadHothits } from "../api/api_utils";

const Hothits = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchHothits = async () => {
      const data = await loadHothits(3);
      setProducts(data || []);
    };
    fetchHothits();
  }, []);

  return (
    <div className={Styles2.mainpage__block}>
      <div className={Styles2.waves}>
        <img src="img/main/wave4.svg" alt="" />
      </div>
      <div className={Styles2.find__content}>
        <div className={Styles2.hothits__text}>
          <h1>Горячие хиты 🔥</h1>
        </div>
        <div className={Styles.card__list} id="card__container">
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
          <div className={Styles.all__items}>
            <Link href={"/catalog"}>
              <img src="img/main/allitems.png" alt="" />
            </Link>
          </div>
        </div>
      </div>
      <div className={Styles2.flip__waves}>
        <img src="img/main/wave4.svg" alt="" />
      </div>
    </div>
  );
};

export default Hothits;
