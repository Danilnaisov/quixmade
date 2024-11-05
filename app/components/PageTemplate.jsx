"use client";

import Styles from "../page.module.css";

const PageTemplate = ({ children, pagename }) => {
  return (
    <div className={Styles.default__page}>
      <div className={Styles.waves}>
        <img src="/img/main/wave2.svg" alt="" />
        <h1>{pagename}</h1>
      </div>
      <div className={Styles.default__page__content}>{children}</div>
    </div>
  );
};
export default PageTemplate;
