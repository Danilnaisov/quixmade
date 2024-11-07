import React, { useState } from "react";
import Styles from "@/app/admin/AdminPannel.module.css";

const ProductDimensions = ({ product, setProduct }) => {
  const [dimensions, setDimensions] = useState(product.feature.dimensions[1]);

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

  return (
    <div className={`${Styles.item__data__row} ${Styles.item__data__number}`}>
      <h3>{product.feature.dimensions[0]}</h3>
      {dimensions.map((dimension, index) => (
        <input
          key={index}
          onChange={(e) => handleDimensionChange(e, index)}
          value={dimension}
        />
      ))}
    </div>
  );
};

export default ProductDimensions;
