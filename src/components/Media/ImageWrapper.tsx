"use client";

import { useState, useEffect } from "react";
import Loader from "../Loader";
import Image from "next/image";

interface ImageWrapperProps {
    mediaId: number;
    width: number;
    height: number;
    loaderWidth: number;
    loaderHeight: number;
    className?: string;
}

export default function ImageWrapper({ mediaId, width, height, loaderWidth, loaderHeight, className }: ImageWrapperProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [imageSrc, setImageSrc] = useState<string>("");

    useEffect(() => {
        async function fetchImage() {
            const imageUrl = `http://localhost:3000/api/crud/media/bytestream/${mediaId}`;
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            setImageSrc(URL.createObjectURL(blob));
            setLoading(false);
        }
        fetchImage();
    }, [mediaId]);

    return (
        <div className={`${className} flex justify-center items-center`}>
            {loading ? 
                <Loader width={loaderWidth} height={loaderHeight}/>
                :
                <Image 
                    src={imageSrc}
                    alt={`Image ${mediaId}`}
                    width={width}
                    height={height} 
                />
            }
        </div>
    );
}