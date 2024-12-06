"use client";

import { Post, Media } from "@/lib/db/models";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProfilePagePostGridOtherProps {
    postData: { post: Post, media: Media[] }[];
    className?: string;
}

export default function ProfilePagePostGridOther({ postData, className }: ProfilePagePostGridOtherProps) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoaded(true); // Trigger animation once the component is mounted
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    postData.sort((a: any, b: any) => {
        return new Date(b.post.datePosted).getTime() - new Date(a.post.datePosted).getTime();
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '60px',
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(15vw, 1fr))',
                    gap: '20px',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '90vw',
                }}
            >
                {postData.map((subPd: any, index: number) => (
                    <Link
                        key={index}
                        href={`/post/${subPd.post.postId}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: subPd.media.length > 0 ? 'transparent' : '#f5f5f5',
                                cursor: 'pointer',
                                animation: loaded
                                    ? `fadeIn 0.6s ease ${index * 0.2}s both`
                                    : 'none', // Apply staggered animation
                            }}
                        >
                            {subPd.media.length > 0 ? (
                                <img
                                    src={subPd.media[0].mediaUrl}
                                    alt={subPd.post.title || "Post image"}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        color: '#888',
                                        fontSize: '14px',
                                    }}
                                >
                                    No Image
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '10px',
                            }}
                        >
                            <p style={{ margin: '0', fontWeight: 'bold' }}>
                                {subPd.post.title || "Untitled"}
                            </p>
                            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                                {new Date(subPd.post.datePosted).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
