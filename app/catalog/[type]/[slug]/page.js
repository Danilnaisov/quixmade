"use client";

import { useEffect, useState } from "react";
import { loadProductBySlug } from "../../../api/api_utils"; // Adjust the path as necessary
import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound"; // Import your Notfound component
import { useParams } from "next/navigation"; // Import useParams
import Styles from "./itempage.module.css";
import PageTemplate from "@/app/components/PageTemplate";

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      if (slug) {
        const productData = await loadProductBySlug(slug);
        setProduct(productData);
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
              <img src={product.image} />
            </div>
            <div className={Styles.item__info__block}>
              <h1 className={Styles.item__name}>{product.title}</h1>
              <p className={Styles.item__article}>{product.article}</p>
              <div className={Styles.item__reviews}>
                {Array(product.stars)
                  .fill(<img src="/img/svg/star.svg" alt="star" />)
                  .map((star, index) => (
                    <span key={index}>{star}</span>
                  ))}
                <span>{product.stars} отзывов</span>
              </div>
              <p className={Styles.item__subname}>Переключатели</p>
              <div className={Styles.switch__block}>
                <div className={Styles.switch__color}></div>
                <p>{product.switchBrand}</p>
              </div>
              <p className={Styles.item__subname}>Раскладка от производителя</p>
              <div className={Styles.language__block}>
                <h3>Русская</h3>
                <span>В наличии</span>
                <p>
                  Отливаются из пластика вместе с кейкапом методом двойного
                  литья — Double-shot.
                </p>
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
                {Array(product.description)
                  .fill(<p>{product.description}</p>)
                  .map((description, index) => (
                    <span key={index}>{description}</span>
                  ))}
              </div>
              <div className={Styles.features__block} id="features__block">
                {Array(product.feature)
                  .fill(<p>{product.feature}</p>)
                  .map((feature, index) => (
                    <span key={index}>{feature}</span>
                  ))}
              </div>
              <div className={Styles.reviews__block} id="reviews__block">
                {Array(product.reviews)
                  .fill(<p>{product.reviews}</p>)
                  .map((reviews, index) => (
                    <span key={index}>{reviews}</span>
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
