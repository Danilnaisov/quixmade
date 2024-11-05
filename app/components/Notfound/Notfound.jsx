import React from "react";
import Styles from "/app/page.module.css";
import Link from "next/link";

export const Notfound = () => {
  return (
    <div className={Styles.mainpage__block} id="content__block">
      <div className={Styles.waves}>
        <img src="/img/main/wave2.svg" alt="" />
      </div>
      <div className={Styles.find__content}>
        <div className={Styles.content__404}>
          <h1>404</h1>
          <h2>Страница не найдена</h2>
          <Link href={"/"}>
            <button>На главную</button>
          </Link>
        </div>
      </div>
      <div className={Styles.flip__waves}>
        <img src="img/main/wave2.svg" alt="" />
      </div>
    </div>
  );
};
