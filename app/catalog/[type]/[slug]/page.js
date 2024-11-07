"use client";

import { useEffect, useState } from "react";
import { loadProductBySlug, loadReviewsByProductId } from "@/app/api/api_utils"; // Adjust the path as necessary
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound"; // Import your Notfound component
import { useParams } from "next/navigation"; // Import useParams
import Styles from "./itempage.module.css";
import PageTemplate from "@/app/components/PageTemplate";

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageStars, setAverageStars] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      if (slug) {
        const productData = await loadProductBySlug(slug);
        setProduct(productData);
        const reviews = await loadReviewsByProductId(productData.id);
        setReviewsCount(reviews.length);

        if (reviews.length > 0) {
          const totalStars = reviews.reduce(
            (acc, review) => acc + review.stars,
            0
          );
          setAverageStars(parseFloat((totalStars / reviews.length).toFixed(2)));
        }
        const reviewsData = await loadReviewsByProductId(productData.id);
        setReviews(reviewsData);
      }
      setPreloaderVisible(false);
    }
    fetchProduct();
  }, [slug]);

  return (
    <PageTemplate>
      {product ? (
        <>
          <div className={Styles.item__main__block}>
            <div className={Styles.item__images__block}>
              {Array.isArray(product.image) ? (
                product.image.map((imgPath, index) => (
                  <img
                    key={index}
                    src={imgPath}
                    alt={`Product image ${index + 1}`}
                  />
                ))
              ) : (
                <img src={product.image} alt="Product image" />
              )}
            </div>

            <div className={Styles.item__info__block}>
              <h1 className={Styles.item__name}>{product.title}</h1>
              <p className={Styles.item__article}>{product.article}</p>
              <div className={Styles.item__reviews}>
                <div>
                  {Array(Math.round(averageStars))
                    .fill(<img src="/img/svg/star.svg" alt="star" />)
                    .map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                </div>
                <span>{reviewsCount} отзывов</span>
              </div>
              <p className={Styles.item__subname}>Переключатели</p>
              <div className={Styles.switch__block}>
                <div className={Styles.switch__color}></div>
                <p>{product.feature.switch.brand}</p>
              </div>
              <p className={Styles.item__subname}>Раскладка от производителя</p>
              <div className={Styles.language}>
                <h3>{product.feature.language}</h3>
              </div>
              <div className={Styles.price__block}>
                <h3>{product.price} ₽</h3>
                <p>или {product.price / 4} ₽ х 4 платежа в сплит</p>
              </div>
              <div className={Styles.addtocart__block}>
                <button>В корзину</button>
                <p>Осталась 1 шт, завтра может закончиться</p>
              </div>
              <div className={Styles.ship__block}>{/*  */}</div>
            </div>
          </div>
          <div className={Styles.item__about}>
            <div className={Styles.about__buttons}>
              <button
                className={Styles.description__button}
                onClick={() =>
                  document.getElementById("description__block").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                Описание
              </button>
              <button
                className={Styles.features__button}
                onClick={() =>
                  document.getElementById("features__block").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                Характеристики
              </button>
              <button
                className={Styles.reviews__button}
                onClick={() =>
                  document.getElementById("reviews__block").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                Отзывы
              </button>
            </div>
            <div className={Styles.about__content}>
              <div
                className={Styles.description__block}
                id="description__block"
              >
                <h3>{product.shortDescription}</h3>
                {product.descriptionTitle.map((title, index) => (
                  <div key={index}>
                    <h3>{title}</h3>
                    <p>{product.descriptionText[index]}</p>
                  </div>
                ))}
              </div>
              <div className={Styles.features__block} id="features__block">
                {Object.entries(product.feature).map(([key, value]) => {
                  let featureName;
                  let featureValue;

                  if (Array.isArray(value)) {
                    featureName = value[0];
                    featureValue = value[1];
                  } else if (typeof value === "object" && value !== null) {
                    featureName = "Переключатель";
                    featureValue = `${value.brand}`;
                  } else {
                    featureName = key;
                    featureValue = value;
                  }
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{featureName}</span>
                      <span>{String(featureValue)}</span>
                    </div>
                  );
                })}
              </div>
              <div className={Styles.reviews__block} id="reviews__block">
                {reviews.map((review) => (
                  <div key={review.id} className={Styles.review}>
                    <p>{review.text}</p>
                    <p>
                      {Array(review.stars)
                        .fill(<img src="/img/svg/star.svg" alt="star" />)
                        .map((star, index) => (
                          <span key={index}>{star}</span>
                        ))}
                    </p>
                    <p>Отзыв на: {product.title}</p>
                    <p>
                      {review.userName},{" "}
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <Notfound />
      )}
    </PageTemplate>
  );
}
