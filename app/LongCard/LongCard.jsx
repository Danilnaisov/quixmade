import React from "react";
import Link from "next/link";
import Styles from "./LongCard.module.css";
import { endpoint, image_endpoint } from "../api/config";
const LongCard = ({ product }) => {
  const deleteProduct = async (id) => {
    // Ask for confirmation before deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return; // If the user cancels, don't proceed

    try {
      const response = await fetch(`${endpoint}product/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Optionally: Do something on successful deletion, like updating the UI or notifying the user
      alert("Product deleted successfully");

      // You can also add logic here to remove the deleted product from the UI or reload the page
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  return (
    <div className={Styles.admin__item__block}>
      <div className={Styles.admin__item__block}>
        <Link
          href={`/catalog/${product.type}/${product.slug}`}
          className={Styles.admin__items}
        >
          <div className={Styles.admin__item__image}>
            <img
              src={`${image_endpoint}${
                product.image && product.image[0]
                  ? product.image[0]
                  : "/images/notfound.png"
              }`}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${image_endpoint}/images/notfound.png`;
              }}
            />
          </div>
          <div className={Styles.admin__item__text}>
            <h4>{product.title}</h4>
            <h4>{product.price}₽</h4>
          </div>
        </Link>
      </div>
      <div className={Styles.item__buttons}>
        <Link href={`/admin/${product.slug}`}>
          <img src="/img/svg/edit.svg" alt="" />
        </Link>
        <img
          src="/img/svg/delete.svg"
          alt=""
          onClick={() => deleteProduct(product.id)}
        />
      </div>
    </div>
  );
};

export default LongCard;
