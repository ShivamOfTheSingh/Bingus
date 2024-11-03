"use client";

import { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';

interface DislikeButtonProps {
    disliked: boolean;
    count: number;
    onClick: () => void;
    className?: string;
}

export default function DislikeButton({ disliked, count, onClick, className }: DislikeButtonProps) {
    const [dislikedState, setDislikedState] = useState<boolean>(disliked);
    const [countState, setCountState] = useState<number>(count);

    function onClickWrapper() {
        setDislikedState(!dislikedState);
        setCountState(dislikedState ? countState - 1 : countState + 1);
        onClick();
    }

    return (
        <Button onClick={onClickWrapper} variant={dislikedState ? "primary" : "outline-primary"} className={className}>
            <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={dislikedState ? solidThumbsUp : regularThumbsUp} />
                {countState}
            </div>
        </Button>
    );
}