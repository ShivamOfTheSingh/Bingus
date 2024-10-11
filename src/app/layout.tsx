import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
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
      <body>
        <ErrorBoundary errorComponent={Error}>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}