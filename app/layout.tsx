import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});



export const metadata: Metadata = {
  title: {
    // %s заменится на title дочерней страницы: «Акции | Северяночка»
    template: "%s | Северяночка",
    // для страниц без своего title (например, главной)
    default: "Северяночка — доставка продуктов",
  },
  description: "Северяночка — интернет-магазин продуктов с доставкой на дом",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${rubik.variable} font-sans  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        </body>
    </html>
  );
}
