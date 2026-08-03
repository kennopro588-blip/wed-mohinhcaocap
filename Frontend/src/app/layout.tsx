import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LUXE MODELS – Mô Hình & Figure Cao Cấp",
  description:
    "Trang thương mại điện tử mô hình cao cấp hàng đầu Việt Nam. Gunpla Bandai, Hot Toys, Diecast Supercars, Tượng Resin chính hãng 100%.",
  keywords: "mô hình cao cấp, gunpla bandai, hot toys 1/6, diecast 1/18, tượng resin prime 1 studio, figure anime",
  openGraph: {
    title: "LUXE MODELS – Mô Hình & Figure Cao Cấp",
    description: "Thiên đường mô hình chính hãng dành cho Collector",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
