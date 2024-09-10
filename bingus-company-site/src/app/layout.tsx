import type { Metadata } from "next";
import "./globals.css";
import NavbarHorizontal from "../components/NavbarHorizontal";
import bingusPicture from "@/src/public/bingus.jpg"

export const metadata: Metadata = {
  title: "Binugs LLC",
  description: "Bingus LLC Company Website",
};

const navbarHrefs = [
  {
    id: 1,
    title: "Home",
    href: "/"
  },
  {
    id: 2,
    title: "Dev Logs",
    href: "/logs"
  },
  {
    id: 3,
    title: "About Us",
    href: "/about"
  },
  {
    id: 4,
    title: "Bingus App",
    href: "/"
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-purple-500">
        <NavbarHorizontal hrefs={navbarHrefs} brand="Bingus LLC" logo={bingusPicture} className="navbar-main" />
        {children}
      </body>
    </html>
  );
}
