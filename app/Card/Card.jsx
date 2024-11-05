import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import Styles from "./Card.module.css";
import { loadReviewsByProductId } from "@/app/api/api_utils";

const Card = ({ product }) => {
  const [averageStars, setAverageStars] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      if (product.id) {
        const reviewsData = await loadReviewsByProductId(product.id);
        setReviewsCount(reviewsData.length);

        if (reviewsData.length > 0) {
          const totalStars = reviewsData.reduce(
            (sum, review) => sum + review.stars,
            0
          );
          setAverageStars(totalStars / reviewsData.length);
        }
      }
    }
    fetchReviews();
  }, [product.id]);

  const saleBadge = product.isSale ? (
    <div className={`${Styles.item__c_block} ${Styles.item__sale}`}>Sale</div>
  ) : null;

  const wirelessBadge = product.feature.isWireless[1] ? (
    <div className={`${Styles.item__c_block} ${Styles.item__wireless}`}>
      Wireless
    </div>
  ) : null;

  const notInStockBadge =
    product.feature.status[1] == 0 ? (
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
                e.target.onerror = null;
                e.target.src = "/data/images/notfound.png";
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
              {Array(Math.round(averageStars))
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
