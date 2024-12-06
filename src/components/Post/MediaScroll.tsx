"use client";

import { Media } from "@/lib/db/models";
import { useState } from "react";
import Image from "next/image";
import ScrollButton from "./ScrollButton";

interface MediaScrollProps {
    media: Media[];
    className?: string;
}

export default function MediaScroll({ media, className }: MediaScrollProps) {
    const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

    function onIncrement() {
        if (currentMediaIndex === media.length - 1) {
            setCurrentMediaIndex(0);
        }
        else {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    }

    function onDecrement() {
        if (currentMediaIndex === 0) {
            setCurrentMediaIndex(media.length - 1);
        }
        else {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    }

    return (
        <div className={`${className} flex flex-col items-center`}>
            <Image src={media[currentMediaIndex].mediaUrl} alt={currentMediaIndex.toString()} height={1000} width={1000} />
            <ScrollButton range={media.length} onIncrement={onIncrement} onDecrement={onDecrement} />
        </div>
    );
}