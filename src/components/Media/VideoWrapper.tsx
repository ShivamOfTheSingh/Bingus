"use client";

import { useState, useEffect } from "react";
import Loader from "../Loader";

interface VideoWrapperProps {
    mediaId: number;
    width: number;
    height: number;
    loaderWidth: number;
    loaderHeight: number;
    className?: string;
}

export default function VideoWrapper({ mediaId, width, height, loaderWidth, loaderHeight, className }: VideoWrapperProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        async function fetchImage() {
            const imageUrl = `http://localhost:3000/api/crud/media/bytestream/${mediaId}`;
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            setVideoSrc(URL.createObjectURL(blob));
            setLoading(false);
        }
        fetchImage();
    }, [mediaId]);

    return (
        <div className={`${className} flex justify-center items-center`}>
            {loading ? 
                <Loader width={loaderWidth} height={loaderHeight}/>
                :
                <video width={width} height={height} controls>
                    <source src={videoSrc} type="video/mp4" />
                </video>
            }
        </div>
    );
}