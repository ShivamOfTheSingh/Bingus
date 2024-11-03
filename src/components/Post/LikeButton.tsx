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
    return (
        <Button onClick={onClick} variant={liked ? "primary" : "outline-primary"} className={className}>
            <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={liked ? solidThumbsUp : regularThumbsUp} />
                {count}
            </div>
        </Button>
    );
}