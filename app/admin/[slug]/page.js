"use client";

import { Preloader } from "@/app/components/Preloader/Preloader";
import { Notfound } from "@/app/components/Notfound/Notfound";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PageTemplate from "@/app/components/PageTemplate";
import Styles from "../AdminPannel.module.css";
import {
  loadProductBySlug,
  updateProduct,
  uploadImage,
} from "@/app/api/api_utils";
import Link from "next/link";
import ProductDimensions from "@/app/components/ProductDimensions";
import ProductDescription from "@/app/components/ProductDescription";
import axios from "axios";
import { endpoint } from "@/app/api/config";

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleFileInput = (e) => {
    console.log("handleFileInput working!");
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      setImageFile(file);
    } else {
      console.log("Файл не выбран");
    }
  };

  const handleSave = async () => {
    try {
      if (!product.type) {
        console.log("Тип не определен:", product.type);
        return;
      }

      let imagePath = product.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`${endpoint}image-upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.message) {
            console.log("Изображение загружено в:", data.message);
            imagePath = data.message;
          } else {
            console.error("Ответ сервера не содержит 'message'");
            alert("Ошибка при загрузке изображения");
            return;
          }
        } else {
          console.error(
            "Не удалось загрузить изображение, статус:",
            response.status
          );
          alert("Ошибка при загрузке изображения");
          return;
        }
      }

      const updatedProduct = {
        ...product,
        image: imagePath,
      };

      const updateResponse = await updateProduct(updatedProduct);
      if (updateResponse.ok) {
        alert("Данные успешно обновлены");
        console.log("new product.image", updatedProduct.image);
      } else {
        alert("Ошибка при сохранении данных");
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      alert("Ошибка при обновлении данных");
    }
  };

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

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    const keys = field.split(".");

    setProduct((prevProduct) => {
      const updatedFeature = { ...prevProduct.feature };

      if (keys.length > 1) {
        let target = updatedFeature;
        target = target[keys[1]];
        target[1] = value;
        return { ...prevProduct, feature: updatedFeature };
      } else {
        return { ...prevProduct, [field]: value };
      }
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { checked } = e.target;
    const keys = field.split(".");

    setProduct((prevProduct) => {
      const updatedFeature = { ...prevProduct.feature };

      if (keys.length > 1) {
        let target = updatedFeature[keys[1]];

        target[keys[1]] = checked;

        return { ...prevProduct, feature: updatedFeature };
      } else {
        return { ...prevProduct, [field]: checked };
      }
    });
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && product) {
  //     setImageFile(file);
  //     try {
  //     } catch (error) {
  //       console.error("Ошибка при загрузке изображения:", error);
  //     }
  //   }
  // };

  return (
    <PageTemplate pagename="Редактировать товар">
      {product ? (
        <>
          <div className={Styles.main__block}>
            <div className={Styles.item__name}>
              <Link href={"/admin"}>
                <img src="/img/svg/back.svg" alt="" />
              </Link>
              <h3>{product.title}</h3>
            </div>
            <hr />
          </div>
          <div className={Styles.item__data}>
            <div className={Styles.data__left}>
              <div className={Styles.item__data__row}>
                <h3>Тип</h3>
                <input
                  onChange={(e) => handleInputChange(e, "type")}
                  value={product.type}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Название страницы</h3>
                <input
                  onChange={(e) => handleInputChange(e, "pagename")}
                  value={product.pagename}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Название</h3>
                <input
                  onChange={(e) => handleInputChange(e, "title")}
                  value={product.title}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Slug</h3>
                <input
                  onChange={(e) => handleInputChange(e, "slug")}
                  value={product.slug}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Артикул</h3>
                <input
                  onChange={(e) => handleInputChange(e, "article")}
                  value={product.article}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Цена</h3>
                <input
                  onChange={(e) => handleInputChange(e, "price")}
                  value={product.price}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Цена по скидке</h3>
                <input
                  onChange={(e) => handleInputChange(e, "saleprice")}
                  value={product.saleprice ? product.saleprice : ""}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Скидка</h3>
                <input
                  onChange={(e) => handleCheckboxChange(e, "isSale")}
                  type="checkbox"
                  checked={product.isSale ? true : false}
                />
              </div>
              <div className={Styles.item__data__row}>
                <h3>Хиты</h3>
                <input
                  onChange={(e) => handleCheckboxChange(e, "isHotHit")}
                  type="checkbox"
                  checked={product.isHotHit ? true : false}
                />
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.construction[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.construction")}
                  value={product.feature.construction[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.color[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.color")}
                  value={product.feature.color[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Бренд переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.brand")}
                  value={product.feature.switch.brand}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Цвет переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.color")}
                  value={product.feature.switch.color}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Тип переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.type")}
                  value={product.feature.switch.type}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.numblock[0]}</h3>
                <input
                  onChange={(e) => handleCheckboxChange(e, "feature.numblock")}
                  type="checkbox"
                  checked={product.feature.numblock[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.layoutType[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.layoutType")}
                  value={product.feature.layoutType[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.keyProfile[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyProfile")}
                  value={product.feature.keyProfile[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.keyMaterial[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyMaterial")}
                  value={product.feature.keyMaterial[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.glideMaterial[0]}</h3>
                <input
                  onChange={(e) =>
                    handleInputChange(e, "feature.glideMaterial")
                  }
                  value={product.feature.glideMaterial[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.weight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.weight")}
                  value={product.feature.weight[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.keyscount[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyscount")}
                  value={product.feature.keyscount[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.backlight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.backlight")}
                  value={product.feature.backlight[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.plugInCable[0]}</h3>
                <input
                  onChange={(e) =>
                    handleCheckboxChange(e, "feature.plugInCable")
                  }
                  type="checkbox"
                  checked={product.feature.plugInCable[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.cableType[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.cableType")}
                  value={product.feature.cableType[1]}
                ></input>
              </div>
            </div>
            <div className={Styles.data__right}>
              <div className={Styles.item__data__row}>
                <h3>Загрузить картинку</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </div>
              <div className={Styles.item__data__row}>
                <h3>Краткое описание</h3>
                <input
                  onChange={(e) => handleInputChange(e, "shortDescription")}
                  type="text"
                  value={product.shortDescription}
                  placeholder="Введите краткое описание"
                />
              </div>
              <div className={Styles.item__data__row}>
                <ProductDescription product={product} />
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.cableLength[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.cableLength")}
                  type="number"
                  value={product.feature.cableLength[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <ProductDimensions product={product} setProduct={setProduct} />
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.warranty[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.warranty")}
                  value={product.feature.warranty[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.connectType[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.connectType")}
                  value={product.feature.connectType[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.isWireless[0]}</h3>
                <input
                  onChange={(e) =>
                    handleCheckboxChange(e, "feature.isWireless")
                  }
                  type="checkbox"
                  checked={product.feature.isWireless[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.batteryCapacity[0]}</h3>
                <input
                  onChange={(e) =>
                    handleInputChange(e, "feature.batteryCapacity")
                  }
                  value={product.feature.batteryCapacity[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.language[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.language")}
                  value={product.feature.language[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.brand[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.brand")}
                  value={product.feature.brand[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.status[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.status")}
                  value={product.feature.status[1]}
                ></input>
              </div>
              <div className={Styles.item__save}>
                <button onClick={handleSave}>Сохранить</button>
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
