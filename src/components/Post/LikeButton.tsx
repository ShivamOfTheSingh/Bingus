"use client";

import { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

interface LikeButtonProps {
    liked: boolean;
    count: number;
    onClick: () => void;
    className?: string;
}

export default function LikeButton({ liked, count, onClick, className }: LikeButtonProps) {
    const [likedState, setLikedState] = useState<boolean>(liked);
    const [likeCount, setLikeCount] = useState<number>(count);

    function onClickWrapper() {
        if (likedState) {
            setLikeCount(likeCount - 1);
        }
        else {
            setLikeCount(likeCount + 1);
        }
        setLikedState(!likedState);
        onClick();
    }

    return (
        <Button onClick={onClickWrapper} variant={likedState ? "danger" : "outline-danger"} className={className}>
            <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={likedState ? solidHeart : regularHeart} />
                {likeCount}
            </div>
        </Button>
    );
}