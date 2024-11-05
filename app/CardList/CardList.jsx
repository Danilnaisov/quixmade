import React from "react";
import Styles from "./CardList.module.css";
import Link from "next/link";

export const CardList = ({ prop }) => {
  return (
    <div className={Styles.card__list}>
      {prop.map((card, id) => (
        <Link href={`/catalog/${card.className}`}>
          <div key={id} className={`card ${Styles[card.className]}`}>
            <div className={Styles.card__image}></div>
            <div className={`card__text`}>
              <h4>{card.title}</h4>
              <hr />
              <div className={`card__text__about`}>
                <div className={`text__left`}>
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
