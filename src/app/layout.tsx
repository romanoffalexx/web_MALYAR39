import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Маляр — краски и штукатурки",
    template: "%s | Маляр",
  },
  description:
    "Интернет-магазин лакокрасочных и штукатурных материалов. Водные краски, краски по металлу, декоративные штукатурки, малярный инструмент.",
  keywords: [
    "краски",
    "штукатурки",
    "лакокрасочные материалы",
    "малярный инструмент",
    "декоративные штукатурки",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
