import React, { useState, useEffect } from "react";
import Styles from "@/app/admin/AdminPannel.module.css";
import { updateProduct } from "@/app/api/api_utils"; // Import your updateProduct function from your API utility

const ProductDescription = ({ product }) => {
  // Combine titles and texts to create the initial description format
  const formatDescription = () => {
    return product.descriptionTitle
      .map((title, index) => `${title}\n${product.descriptionText[index]}`)
      .join("\n\n");
  };

  // Initialize `detailedDescription` state with the formatted description
  const [detailedDescription, setDetailedDescription] = useState(
    formatDescription()
  );

  // Update state when textarea content changes
  const handleDescriptionChange = (e) => {
    setDetailedDescription(e.target.value);
  };

  // Optional: useEffect to update detailedDescription when the product prop changes
  useEffect(() => {
    setDetailedDescription(formatDescription());
  }, [product.descriptionTitle, product.descriptionText]);

  // Function to save the updated description
  const saveDescription = async () => {
    // Prepare the updated description for saving
    const updatedDescription = detailedDescription.split("\n\n").map((item) => {
      const [title, text] = item.split("\n");
      return {
        title: title.trim(),
        text: text.trim(),
      };
    });

    // Create the updated product object
    const updatedProduct = {
      ...product,
      descriptionTitle: updatedDescription.map((item) => item.title),
      descriptionText: updatedDescription.map((item) => item.text),
    };

    // Call the API to update the product
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
    <div className={Styles.item__data__row}>
      <h3>Подробное описание</h3>
      <textarea
        value={detailedDescription} // Bind to `detailedDescription` state for user input
        onChange={handleDescriptionChange} // Call `handleDescriptionChange` on changes
        rows={10}
      />
      <button onClick={saveDescription}>Сохранить</button>
    </div>
  );
};

export default ProductDescription;
