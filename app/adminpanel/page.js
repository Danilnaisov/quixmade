"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTemplate from "@/app/components/PageTemplate";
import Styles from "../admin/AdminPannel.module.css";
import { createProduct } from "@/app/api/api_utils";
import Link from "next/link";

export default function CreateProductPage() {
  const [product, setProduct] = useState({
    type: "",
    title: "",
    slug: "",
    article: "",
    price: "",
    saleprice: "",
    isSale: false,
    isHotHit: false,
    feature: {
      construction: ["Формфактор", ""],
      color: ["Цвет", ""],
      switch: {
        brand: "",
        color: "",
        type: "",
      },
      numblock: ["Нумблок", false],
      layoutType: ["Раскладка", ""],
      keyProfile: ["Профиль колпачков", ""],
      keyMaterial: ["Материал колпачков", ""],
      glideMaterial: ["Материал покрытия", ""],
      weight: ["Вес", ""],
      keyscount: ["Количество клавиш", ""],
      backlight: ["Подсветка", ""],
      plugInCable: ["Отсоединяемый кабел", false],
      cableType: ["Тип разъема", ""],
      cableLength: ["Длина кабеля", ""],
      dimensions: ["Размеры (ДxШxВ)", ["", "", ""]],
      warranty: ["Гарантия", ""],
      connectType: ["Тип подключения", ""],
      isWireless: ["Беспроводной режим", false],
      batteryCapacity: ["Емкость аккумулятора", ""],
      language: ["Тип раскладки", ""],
      brand: ["Бренд", ""],
      status: ["Состояние", ""],
    },
    shortDescription: "",
    detailedDescription: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [dimensions, setDimensions] = useState(["", "", ""]);
  const [detailedDescription, setDetailedDescription] = useState("");

  //   useEffect(() => {
  //     async function fetchProduct() {
  //       if (slug) {
  //         const productData = await loadProductBySlug(slug);
  //         setProduct(productData);
  //         setDetailedDescription(formatDescription(productData));
  //       }
  //       setPreloaderVisible(false);
  //     }
  //     fetchProduct();
  //   });

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      detailedDescription: value,
    }));
  };

  const saveDescription = async () => {
    const updatedDescription = detailedDescription
      .split("\n\n") // Split by double newlines
      .map((item) => {
        const cleanedItem = item.trim();

        if (!cleanedItem) return null; // Skip if block is empty

        const [title, ...rest] = cleanedItem.split("\n");
        const text = rest.join("\n");

        // Log the split content to check
        console.log("Parsed item:", { title, text });

        return {
          title: title.trim(),
          text: text.trim(),
        };
      })
      .filter((item) => item !== null && (item.title || item.text)); // Filter out null and empty items

    console.log("Updated description:", updatedDescription);

    const updatedProduct = {
      ...product,
      descriptionTitle: updatedDescription.map((item) => item.title),
      descriptionText: updatedDescription.map((item) => item.text),
    };

    console.log("Updated product:", updatedProduct);

    try {
      const response = await createProduct(updatedProduct);
      if (!response.ok) {
        throw new Error("Failed to save the product");
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error while saving the product:", error);
      throw error;
    }
  };

  const handleDimensionChange = (e, index) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = e.target.value;
    setDimensions(newDimensions);
    setProduct((prevProduct) => {
      const updatedFeature = { ...prevProduct.feature };
      updatedFeature.dimensions[1] = newDimensions;
      return { ...prevProduct, feature: updatedFeature };
    });
  };

  function handleFileInput(event) {
    const files = event.target.files;
    const images = [];
    for (let i = 0; i < files.length; i++) {
      images.push(files[i]);
    }
    setImageFiles(images);
  }

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    const keys = field.split(".");

    setProduct((prevProduct) => {
      const updatedProduct = { ...prevProduct };
      let target = updatedProduct;

      if (keys.length === 2) {
        target = updatedProduct.feature;
        target[keys[1]][1] = value;
      } else if (keys.length === 3) {
        target = updatedProduct.feature.switch;
        if (typeof target[keys[2]] === "string") {
          target[keys[2]] = value;
        } else {
          target[keys[2]][1] = value;
        }
      } else {
        updatedProduct[field] = value;
      }

      return updatedProduct;
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { checked } = e.target;
    const keys = field.split(".");

    setProduct((prevProduct) => {
      const updatedFeature = { ...prevProduct.feature };

      if (keys.length > 1) {
        let target = updatedFeature;
        target = target[keys[1]];
        target[1] = checked;
        return { ...prevProduct, feature: updatedFeature };
      } else {
        return { ...prevProduct, [field]: checked };
      }
    });
  };

  const handleSave = async () => {
    try {
      if (!product.type || !product.slug) {
        toast.error("Не указаны все параметры!");
        return;
      }

      const formData = new FormData();
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          formData.append("image", file);
        }
        formData.append("type", product.type);
        formData.append("slug", product.slug);

        const response = await fetch(
          "https://api.made.quixoria.ru/image-upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            product.image = data.message;
          } else {
            toast.error("Ошибка при загрузке изображений");
            return;
          }
        } else {
          toast.error("Ошибка при загрузке изображений");
          return;
        }
      }

      console.log(await saveDescription());

      const updatedProduct = await saveDescription();
      console.log("Updated product:", updatedProduct); // Добавьте лог для отладки

      setProduct(updatedProduct);

      const response = await createProduct(updatedProduct);
      console.log("Create product response:", response);
      if (response.ok) {
        toast.success("Товар успешно добавлен");
      } else {
        toast.error("Ошибка при добавлении товара");
      }
    } catch (error) {
      toast.error("Ошибка при добавлении товара");
      console.error("Error:", error);
    }
  };

  return (
    <PageTemplate pagename="Создать товар">
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
                <input onChange={(e) => handleInputChange(e, "type")} />
              </div>
              <div className={Styles.item__data__row}>
                <h3>Название страницы</h3>
                <input
                  onChange={(e) => handleInputChange(e, "pagename")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Название</h3>
                <input onChange={(e) => handleInputChange(e, "title")}></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Slug</h3>
                <input onChange={(e) => handleInputChange(e, "slug")}></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Артикул</h3>
                <input
                  onChange={(e) => handleInputChange(e, "article")}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>Цена</h3>
                <input onChange={(e) => handleInputChange(e, "price")}></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>Цена по скидке</h3>
                <input
                  onChange={(e) => handleInputChange(e, "saleprice")}
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
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.color[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.color")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Бренд переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.brand")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Цвет переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.color")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>Тип переключателей</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.switch.type")}
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
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.keyProfile[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyProfile")}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.keyMaterial[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyMaterial")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.glideMaterial[0]}</h3>
                <input
                  onChange={(e) =>
                    handleInputChange(e, "feature.glideMaterial")
                  }
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.weight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.weight")}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.keyscount[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.keyscount")}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.backlight[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.backlight")}
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
                  value={product.shortDescription}
                  onChange={(e) => handleInputChange(e, "shortDescription")}
                />
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__textarea}`}
              >
                <h3>Подробное описание</h3>
                <textarea
                  value={product.detailedDescription}
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
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.dimensions[0]}</h3>
                {dimensions.map((dimension, index) => (
                  <input
                    key={index}
                    onChange={(e) => handleDimensionChange(e, index)}
                  />
                ))}
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.warranty[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.warranty")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.connectType[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.connectType")}
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
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.language[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.language")}
                ></input>
              </div>
              <div className={Styles.item__data__row}>
                <h3>{product.feature.brand[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.brand")}
                ></input>
              </div>
              <div
                className={`${Styles.item__data__row} ${Styles.item__data__number}`}
              >
                <h3>{product.feature.status[0]}</h3>
                <input
                  onChange={(e) => handleInputChange(e, "feature.status")}
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
