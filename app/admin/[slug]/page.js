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
import { endpoint } from "@/app/api/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductPage() {
  const { slug } = useParams();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [detailedDescription, setDetailedDescription] = useState("");

  const formatDescription = (product) => {
    return product.descriptionTitle
      .map((title, index) => `${title}\n${product.descriptionText[index]}`)
      .join("\n\n");
  };

  const handleDescriptionChange = (e) => {
    setDetailedDescription(e.target.value);
  };

  const saveDescription = async () => {
    const updatedDescription = detailedDescription.split("\n\n").map((item) => {
      const [title, text] = item.split("\n");
      return {
        title: title.trim(),
        text: text.trim(),
      };
    });

    const updatedProduct = {
      ...product,
      descriptionTitle: updatedDescription.map((item) => item.title),
      descriptionText: updatedDescription.map((item) => item.text),
    };

    try {
      const response = await updateProduct(updatedProduct);
      if (!response.ok) {
        throw new Error("Failed to save the product");
      }
      return updatedProduct; // возвращаем обновленное описание продукта
    } catch (error) {
      console.error("Error while saving the product:", error);
      throw error;
    }
  };

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

        console.log("FormData path:", formData.get("path"));
        console.log("FormData filename:", formData.get("filename"));

        if (response.ok) {
          const data = await response.json();
          if (data && data.message) {
            console.log("Изображение загружено в:", data.message);
            imagePath = data.message;
          } else {
            console.error("Ответ сервера не содержит 'message'");
            toast.error("Ошибка при загрузке изображения");
            return;
          }
        } else {
          console.error(
            "Не удалось загрузить изображение, статус:",
            response.status
          );
          toast.error("Ошибка при загрузке изображения");
          return;
        }
      }

      await saveDescription();
      const updatedProduct = await saveDescription();

      setProduct(updatedProduct);

      const updateResponse = await updateProduct(updatedProduct);
      if (updateResponse.ok) {
        toast.success("Данные успешно обновлены");
        console.log("new product.image", updatedProduct.image);
      } else {
        toast.error("Ошибка при сохранении данных");
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      toast.error("Ошибка при обновлении данных");
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      if (slug) {
        const productData = await loadProductBySlug(slug);
        setProduct(productData);
        setDetailedDescription(formatDescription(productData));
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

  return (
    <PageTemplate pagename="Редактировать товар">
      <ToastContainer />
      {product ? (
        <>
          <div className={Styles.main__block}>
            <div className={Styles.item__name}>
              <Link href={"/admin"}>
                <img src="/img/svg/back.svg" alt="" />
              </Link>
              <h3>{product.title}</h3>
              <div></div>
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
                />
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
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>Цена</h3>
                <input
                  onChange={(e) => handleInputChange(e, "price")}
                  value={product.price}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>Цена по скидке</h3>
                <input
                  onChange={(e) => handleInputChange(e, "saleprice")}
                  value={product.saleprice ? product.saleprice : ""}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Скидка</h3>
                <input
                  id="sale_checkbox"
                  onChange={(e) => handleCheckboxChange(e, "isSale")}
                  type="checkbox"
                  checked={product.isSale ? true : false}
                />
                <label htmlFor="sale_checkbox"></label>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Хиты</h3>
                <input
                  id="HotHit_checkbox"
                  onChange={(e) => handleCheckboxChange(e, "isHotHit")}
                  type="checkbox"
                  checked={product.isHotHit ? true : false}
                />
                <label htmlFor="HotHit_checkbox"></label>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
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
                  id="num_checkbox"
                  onChange={(e) => handleCheckboxChange(e, "feature.numblock")}
                  type="checkbox"
                  checked={product.feature.numblock[1]}
                />
                <label htmlFor="num_checkbox"></label>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.layoutType[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.layoutType")}
                  value={product.feature.layoutType[1]}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.keyProfile[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyProfile")}
                  value={product.feature.keyProfile[1]}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
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
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.weight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.weight")}
                  value={product.feature.weight[1]}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.keyscount[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyscount")}
                  value={product.feature.keyscount[1]}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.backlight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.backlight")}
                  value={product.feature.backlight[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.plugInCable[0]}</h3>
                <input
                  id="plugin_checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(e, "feature.plugInCable")
                  }
                  type="checkbox"
                  checked={product.feature.plugInCable[1]}
                />
                <label htmlFor="plugin_checkbox"></label>
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
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__image}`}
              >
                <h3>Загрузить картинку</h3>
                <input
                  name="file[]"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__textarea}`}
              >
                <h3>Краткое описание</h3>
                <textarea
                  onChange={(e) => handleInputChange(e, "shortDescription")}
                  // type="text"
                  value={product.shortDescription}
                  placeholder="Введите краткое описание"
                />
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__textarea}`}
              >
                <h3>Подробное описание</h3>
                <textarea
                  value={detailedDescription}
                  onChange={handleDescriptionChange}
                  rows={10}
                />
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.cableLength[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.cableLength")}
                  value={product.feature.cableLength[1]}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <ProductDimensions product={product} setProduct={setProduct} />
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
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
                  id="wireless_checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(e, "feature.isWireless")
                  }
                  type="checkbox"
                  checked={product.feature.isWireless[1]}
                />
                <label htmlFor="wireless_checkbox"></label>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
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
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
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
