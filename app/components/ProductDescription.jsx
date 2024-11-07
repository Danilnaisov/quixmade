import React, { useState, useEffect } from "react";
import Styles from "@/app/admin/AdminPannel.module.css";
import { updateProduct } from "@/app/api/api_utils";

const ProductDescription = ({ product }) => {
  const formatDescription = () => {
    return product.descriptionTitle
      .map((title, index) => `${title}\n${product.descriptionText[index]}`)
      .join("\n\n");
  };

  const [detailedDescription, setDetailedDescription] = useState(
    formatDescription()
  );

  const handleDescriptionChange = (e) => {
    setDetailedDescription(e.target.value);
  };

  useEffect(() => {
    setDetailedDescription(formatDescription());
  }, [product.descriptionTitle, product.descriptionText]);

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
      alert("Данные описания обновлены");
    } catch (error) {
      console.error("Error while saving the product:", error);
    }
  };

  return (
    <div className={`${Styles.item__data__row} ${Styles.item__data__textarea}`}>
      <h3>Подробное описание</h3>
      <div>
        <textarea
          value={detailedDescription}
          onChange={handleDescriptionChange}
          rows={10}
        />
        <button onClick={saveDescription}>Сохранить</button>
      </div>
    </div>
  );
};

export default ProductDescription;
