"use client";

import { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';

interface LikeButtonProps {
    liked: boolean;
    count: number;
    onClick: () => void;
    className?: string;
}

export default function LikeButton({ liked, count, onClick, className }: LikeButtonProps) {
    const [likedState, setLikedState] = useState<boolean>(liked);
    const [countState, setCountState] = useState<number>(count);

    function onClickWrapper() {
        setLikedState(!likedState);
        setCountState(likedState ? countState - 1 : countState + 1);
        onClick();
    }

    return (
        <Button onClick={onClickWrapper} variant={likedState ? "primary" : "outline-primary"} className={className}>
            <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={likedState ? solidThumbsUp : regularThumbsUp} />
                {countState}
            </div>
        </Button>
    );
}