import React from "react";
import Styles from "./LittleCardList.module.css";
import Link from "next/link";

export const LittleCardList = ({ prop }) => {
  return (
    <div className={Styles.card__list}>
      {prop.map((card, id) => (
        <Link href={`/catalog/${card.className}`}>
          <div key={id} className={`little__card ${Styles[card.className]}`}>
            <div className={Styles.card__image}></div>
            <div className={Styles.card__text}>
              <h4>{card.title}</h4>
              <p>Посмотреть все товары</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
