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
    return (
        <Button onClick={onClick} variant={disliked ? "primary" : "outline-primary"} className={className}>
            <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={disliked ? solidThumbsUp : regularThumbsUp} />
                {count}
            </div>
        </Button>
    );
}