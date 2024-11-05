"use client";

import React from "react";
import Styles from "../page.module.css";

const WelcomeBlock = () => {
  return (
    <div className={`${Styles.mainpage__block} ${Styles.welcome__block}`}>
      <div className={Styles.waves}>
        <img src="img/main/wave1.svg" alt="" />
      </div>
      <div className={Styles.welcome__content}>
        <div className={Styles.welcome__text}>
          <h1>Сделай правильный выбор</h1>
          <h1>Лучшие девайсы для твоего уникального стиля работы</h1>
          <button
            className={Styles.welcome__button}
            onClick={() =>
              document.getElementById("content__block").scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Посмотреть варианты
          </button>
        </div>
        <div className={Styles.welcome__image}>
          <img src="img/svg/welcome.svg" alt="" />
        </div>
      </div>
      <div className={Styles.flip__waves}>
        <img src="img/main/wave1.svg" alt="" />
      </div>
    </div>
  );
};

export default WelcomeBlock;
