import Link from "next/link";
import Image from "next/image";
import bingusPicture from "@/src/public/bingus.jpg";

export default function Page() {
  return (
    <div>
      <div className="container">
        <Image src={bingusPicture} alt="bingus-img" width={200} height={200} />
        <h1>Bingus LLC</h1>
        <p>This is Bingus LLC</p>
      </div>
    </div>
  );
}