import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { RestaurantAdminProvider } from "@/components/RestaurantAdminProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hambry — Demo de delivery de comida",
  description:
    "Proyecto de portfolio: marketplace de delivery ficticio con varios restaurantes, carrito, seguimiento de pedido, panel de restaurante y vista de repartidor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <RestaurantAdminProvider>
          <CartProvider>{children}</CartProvider>
        </RestaurantAdminProvider>
      </body>
    </html>
  );
}
