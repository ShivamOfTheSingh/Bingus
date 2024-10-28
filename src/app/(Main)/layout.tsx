import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import NavBar2 from '@/components/Navbar2'
import 'bootstrap/dist/css/bootstrap.min.css';

import Error from "../error";


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <ErrorBoundary errorComponent={Error}>
          <NavBar2 />
          {children}
        </ErrorBoundary>
      </div>
  );
}