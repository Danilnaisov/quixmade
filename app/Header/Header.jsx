import Link from "next/link";
import Styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={Styles["header"]}>
      <ul className={Styles["nav"]}>
        <li className={Styles["nav__item"]}>
          <Link href={"/catalog"}>
            <p>Каталог</p>
          </Link>
        </li>
        <li className={Styles["nav__item"]}>
          <Link href={"/accessories"}>
            <p>Аксессуары</p>
          </Link>
        </li>
        <li className={Styles["nav__item"]}>
          <Link href={"/service"}>
            <p>Услуги и сервис</p>
          </Link>
        </li>
        <li className={Styles["nav__item"]}>
          <Link href={"/about"}>
            <p>О нас</p>
          </Link>
        </li>
      </ul>
      <div className={Styles["header__img"]}>
        <Link href={"/"}>
          <h1>Q.Made</h1>
        </Link>
      </div>
      <ul className={Styles["user__control"]}>
        <li className={Styles["user__control__item"]}>
          <img src="/img/svg/search.svg" alt="" />
        </li>
        <li className={Styles["user__control__item"]}>
          <Link href={"/user"}>
            <img src="/img/svg/user.svg" alt="" />
          </Link>
        </li>
        <li className={Styles["user__control__item"]}>
          <Link href={"/cart"}>
            <img src="/img/svg/cart.svg" alt="" />
          </Link>{" "}
        </li>
      </ul>
    </header>
  );
};
