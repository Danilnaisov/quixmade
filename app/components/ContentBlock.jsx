import React from "react";
import Styles from "../page.module.css";
import { CardList } from "../CardList/CardList";
import { cardsData } from "../api/data/cards";

const ContentBlock = () => {
  return (
    <div className={Styles.mainpage__block} id="content__block">
      <div className={Styles.waves}>
        <img src="img/main/wave2.svg" alt="" />
      </div>
      <div className={Styles.find__content}>
        <div className={Styles.find__text}>
          <h1>У нас вы найдете</h1>
        </div>
        <CardList prop={cardsData} />
      </div>
      <div className={Styles.flip__waves}>
        <img src="img/main/wave2.svg" alt="" />
      </div>
    </div>
  );
};

export default ContentBlock;
