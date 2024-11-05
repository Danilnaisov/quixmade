// components/SizeSelectionBlock.jsx
import React from "react";
import Styles from "../page.module.css";
import { sizeData } from "../api/data/cards";
import { CardList } from "../CardList/CardList";

const SizeSelectionBlock = () => {
  return (
    <div className={Styles.mainpage__block}>
      <div className={Styles.waves}>
        <img src="img/main/wave3.svg" alt="" />
      </div>
      <div className={Styles.find__content}>
        <div className={Styles.find__text}>
          <h1>Выбрать клавиатуру по размеру</h1>
        </div>
        <CardList prop={sizeData} />
      </div>
      <div className={Styles.flip__waves}>
        <img src="img/main/wave3.svg" alt="" />
      </div>
    </div>
  );
};

export default SizeSelectionBlock;
