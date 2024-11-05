import React from "react";
import Link from "next/link";
import Styles from "./Card.module.css";

const Card = ({ product }) => {
  const saleBadge = product.isSale ? (
    <div className={`${Styles.item__c_block} ${Styles.item__sale}`}>Sale</div>
  ) : null;

  const wirelessBadge = product.isWireless ? (
    <div className={`${Styles.item__c_block} ${Styles.item__wireless}`}>
      Wireless
    </div>
  ) : null;

  const notInStockBadge =
    product.status === "not in stock" ? (
      <div className={`${Styles.item__c_block} ${Styles.item__notinstock}`}>
        Нет в наличии
      </div>
    ) : null;

  return (
    <Link href={`/catalog/${product.type}/${product.slug}`}>
      <div className={Styles.card}>
        <div className={Styles.card__image}>
          <div className={Styles.item__c}>
            {saleBadge}
            {wirelessBadge}
            {notInStockBadge}
          </div>
          <div className={Styles.card__images}>
            <img
              src={product.image}
              alt={product.title}
              onError={(e) => {
                e.target.onerror = null; // Prevents an infinite loop in case the fallback image fails to load
                e.target.src = "/data/images/notfound.png"; // Fallback image
              }}
            />
          </div>
        </div>
        <div className={Styles.card__text}>
          <h4>{product.title}</h4>
          <hr />
          <div className={Styles.card__text__about}>
            <div className={Styles.text__left}>
              {product.isSale && product.saleprice ? (
                <>
                  <span>{product.price} ₽</span>
                  <p className={Styles.salePrice}>{product.saleprice} ₽</p>
                </>
              ) : (
                <p className={Styles.salePrice}>{product.price} ₽</p>
              )}
            </div>
            <div className={Styles.text__right}>
              {Array(product.stars)
                .fill(<img src="/img/svg/star.svg" alt="star" />)
                .map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
