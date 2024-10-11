import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "@/components/NavBar";
import "../globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
