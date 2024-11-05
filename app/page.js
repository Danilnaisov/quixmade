import Styles from "./page.module.css";
import React from "react";
import Hothits from "./components/Hothits";
import WelcomeBlock from "./components/WelcomeBlock";
import ContentBlock from "./components/ContentBlock";
import SizeSelectionBlock from "./components/SizeSelectionBlock";

export default function Home() {
  return (
    <main className={Styles.main}>
      <WelcomeBlock />
      <ContentBlock />
      <SizeSelectionBlock />
      <Hothits />
    </main>
  );
}
