import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Error from "./error";

export const metadata: Metadata = {
  title: "Bingus",
  description: "Property of Bingus LLC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ErrorBoundary errorComponent={Error}>
        <body>{children}</body>
      </ErrorBoundary>
    </html>
  );
}