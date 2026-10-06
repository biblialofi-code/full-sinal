import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Full Sinal — Claro · FIAP NEXT",
  description: "Escolha uma carreira, resolva os desafios sem perder o sinal e descubra sua patente.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#da291c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
