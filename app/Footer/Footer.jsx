import Styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={Styles["footer"]}>
      <h2>Делимся полезным контентом. Присоединяйтесь!</h2>
      <div className={Styles["footer__email"]}>
        <form action="submit">
          <input type="email" placeholder="Введите e-mail" />
          <input type="button" value="Подписаться" />
        </form>
        <p>
          Нажимая на кнопку Подписаться, вы даёте соглашение на обработку
          персональных данных
        </p>
      </div>
      <h3>Механические клавиатуры и аксессуары для рабочего места</h3>
      <h4>
        ООО «квиксмейд», ОГРН: 123123, Юр. адрес: 123123, Пермский край, г.
        Пермь, ул. Луначарского, 23/3 © 2024 QuixMade
      </h4>
    </footer>
  );
};
