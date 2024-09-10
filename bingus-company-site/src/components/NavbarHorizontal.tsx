"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface NavbarHorizontalProps {
    hrefs: { id: number, title: string, href: string }[];
    brand: string;
    logo?: StaticImageData | string;
    className?: string;
}

export default function NavbarHorizontal({ hrefs, brand, logo, className }: NavbarHorizontalProps) {
    return (
        <div className={`${className} flex gap-10 items-center p-5`}>
            {logo ? <Image src={logo} alt={brand} width={80} height={80} /> : brand}
            {hrefs.map(href => 
                <Link key={href.id} href={href.href}>{href.title}</Link>
            )}
        </div>
    );
}