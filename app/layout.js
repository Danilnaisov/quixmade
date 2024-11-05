import Styles from "./globals.css";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";

export const metadata = {
  title: "QuixMade",
  description: "QuixMade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
