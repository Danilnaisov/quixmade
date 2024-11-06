import React from "react";
import Link from "next/link";
import Styles from "./LongCard.module.css";

const LongCard = ({ product }) => {
  return (
    <div className={Styles.admin__item__block}>
      <div className={Styles.admin__item__block}>
        <Link
          href={`/catalog/${product.type}/${product.slug}`}
          className={Styles.admin__items}
        >
          <div className={Styles.admin__item__image}>
            <img
              src={product.image}
              alt=""
              onError="this.onerror=null; this.src='../data/images/notfound.png';"
            />
          </div>
          <div className={Styles.admin__item__text}>
            <h4>{product.title}</h4>
            <h4>{product.price}₽</h4>
          </div>
        </Link>
      </div>
      <div className={Styles.item__buttons}>
        <Link href={`/admin/${product.slug}`}>
          <img src="/img/svg/edit.svg" alt="" />
        </Link>
        <img src="/img/svg/delete.svg" alt="" />
      </div>
    </div>
  );
};

export default LongCard;
