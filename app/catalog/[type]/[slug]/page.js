"use client";

import Styles from "./itempage.module.css";
import { useEffect, useState } from "react";
import { loadProductBySlug, loadReviewsByProductId } from "@/app/api/api_utils"; // Adjust the path as necessary
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound"; // Import your Notfound component
import { useParams } from "next/navigation"; // Import useParams
import PageTemplate from "@/app/components/PageTemplate";
import { image_endpoint } from "@/app/api/config";
import Link from "next/link";

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageStars, setAverageStars] = useState(0);
  const [productprice, setProductPrice] = useState(0);
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

  useEffect(() => {
    if (product) {
      // console.log(product.saleprice);
      setProductPrice(product.isSale === 1 ? product.saleprice : product.price);
    }
  }, [product]);

  return (
    <>
      <div className={Styles.waves}>
        <img src="/img/main/wave3.svg" alt="" />
      </div>
      {product ? (
        <div>
          <div className={Styles.item__main__block}>
            <div className={Styles.item__images__block}>
              <div className={Styles.vertical__image__block}>
                {Array.isArray(product.image) ? (
                  product.image.map((imgPath, index) => (
                    <img
                      key={index}
                      src={`${image_endpoint}${imgPath}`}
                      alt={`Image ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${image_endpoint}/images/notfound.png`;
                      }}
                    />
                  ))
                ) : (
                  <img
                    src={`${image_endpoint}${product.image}`}
                    alt="Product image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${image_endpoint}/images/notfound.png`;
                    }}
                  />
                )}
              </div>
              <div className={Styles.select__image__block}>
                <img
                  src={`${image_endpoint}${product.image[0]}`}
                  alt={`Image ${1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${image_endpoint}/images/notfound.png`;
                  }}
                />
              </div>
            </div>
            <div className={Styles.item__info__block}>
              <h2 className={Styles.item__name}>{product.title}</h2>
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
                <div className={Styles.switch__color}>
                  {/*будет кружок цвета из product.feature.switch.color */}
                </div>
                <p>{product.feature.switch.brand}</p>
              </div>
              <p className={Styles.item__subname}>Раскладка от производителя</p>
              <div className={Styles.language__block}>
                <h3>{product.feature.language[1]}</h3>
                <p>В наличии</p>
                <span>
                  Отливаются из пластика вместе с кейкапом методом двойного
                  литья — Double-shot.
                  <br />
                  Все символы пропускают подсветку.
                </span>
              </div>
              <div className={Styles.price__block}>
                {product.isSale ? (
                  <div className={Styles.sale__block}>
                    <h4>{product.price} ₽</h4>
                    <h2 className={Styles.salePrice}>{product.saleprice} ₽</h2>
                  </div>
                ) : (
                  <h2>{product.price} ₽</h2>
                )}
                <p>или {productprice / 4} ₽ х 4 платежа в сплит</p>
              </div>
              <div className={Styles.addtocart__block}>
                <button
                  className={
                    product.feature.status[1] === "0"
                      ? Styles.disabledButton
                      : Styles.activeButton
                  }
                  disabled={product.feature.status[1] === "0" ? true : false}
                >
                  В корзину
                </button>
                {product.feature.status[1] === "1" ? (
                  <p>Осталась 1 шт, завтра может закончиться</p>
                ) : (
                  <></>
                )}
              </div>
              <div className={Styles.ship__block}>
                {/* Блок с ценой доставки */}
              </div>
            </div>
          </div>
          <div className={Styles.item__about}>
            <div className={Styles.item__page}>
              <div className={Styles.about__buttons}>
                <button
                  className={Styles.description__button}
                  onClick={() =>
                    document
                      .getElementById("description__block")
                      .scrollIntoView({
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
              <div
                className={Styles.description__block}
                id="description__block"
              >
                <div>
                  <p className={Styles.shortDescription}>
                    {product.shortDescription}
                  </p>
                  {product.descriptionTitle.map((title, index) => (
                    <>
                      <h3>{title}</h3>
                      <p>{product.descriptionText[index]}</p>
                    </>
                  ))}
                </div>
              </div>
              <div className={Styles.block}>
                <div className={Styles.features__block} id="features__block">
                  <h3>Характеристики</h3>
                  <div className={Styles.features}>
                    {Object.entries(product.feature)
                      .slice(1)
                      .filter(([key, value]) => value[1] !== null)
                      .map(([key, value]) => {
                        let featureName;
                        let featureValue;

                        if (Array.isArray(value)) {
                          featureName = value[0];
                          featureValue = Array.isArray(value[1])
                            ? value[1].join(" x ")
                            : value[1];
                        } else if (typeof value === "object" && value.brand) {
                          featureName = "Переключатель";
                          featureValue = value.brand;
                        } else {
                          featureName = key;
                          featureValue = value;
                        }

                        if (featureValue === false) {
                          featureValue = "Нет";
                        } else if (featureValue === true) {
                          featureValue = "Да";
                        }
                        if (featureName === "Гарантия") {
                          featureValue = `${value[1]} мес.`;
                        }
                        if (featureName === "Состояние") {
                          if (featureValue === "1" || featureValue === "2") {
                            featureValue = "Новая";
                          } else if (featureValue === "3") {
                            featureValue = "Б/У";
                          } else if (featureValue === "0") {
                            featureValue = "Нет в наличии";
                          }
                        }
                        return (
                          <div key={key}>
                            <span>{featureName}</span>
                            <span>{String(featureValue)}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className={Styles.block}>
                <div className={Styles.reviews__block} id="reviews__block">
                  <div>
                    <h3>Отзывы</h3>
                    <div className={Styles.item__reviews}>
                      <div>
                        {Array(Math.round(averageStars))
                          .fill(<img src="/img/svg/star.svg" alt="star" />)
                          .map((star, index) => (
                            <span key={index} className={Styles.reviews__star}>
                              {star}
                            </span>
                          ))}
                      </div>
                      <span>{reviewsCount} отзывов</span>
                    </div>
                    <button
                      className={Styles.activeButton}
                      disabled={
                        product.feature.status[1] === "0" ? true : false
                      }
                    >
                      Оставить отзыв
                    </button>
                  </div>
                  <div className={Styles.reviews}>
                    {reviews.map((review) => (
                      <div key={review.id} className={Styles.review}>
                        <h4>{review.text}</h4>
                        <p>
                          {Array(review.stars)
                            .fill(<img src="/img/svg/star.svg" alt="star" />)
                            .map((star, index) => (
                              <span key={index}>{star}</span>
                            ))}
                        </p>
                        <p>
                          Отзыв на:{" "}
                          <Link
                            href={`/catalog/${product.type}/${product.slug}`}
                          >
                            <span>{product.title}</span>
                          </Link>
                        </p>
                        <p>
                          {review.userName},{" "}
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.flip__waves}>
              <img src="/img/main/wave4.svg" alt="" />
            </div>
          </div>
        </div>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <Notfound />
      )}
    </>
  );
}
