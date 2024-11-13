"use client";

import { useState } from "react";

interface ScrollButtonProps {
    range: number;
    onIncrement: () => void;
    onDecrement: () => void;
    className?: string;
}

export default function ScrollButton({ range, onIncrement, onDecrement, className }: ScrollButtonProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    function onIncrementWrapper() {
        if (currentIndex === range - 1) {
            setCurrentIndex(0);
        }
        else {
            setCurrentIndex(currentIndex + 1);
        }
        onIncrement();
    }

    function onDecrementWrapper() {
        if (currentIndex === 0) {
            setCurrentIndex(range - 1);
        }
        else {
            setCurrentIndex(currentIndex - 1);
        }
        onDecrement();
    }

    return (
        <div className={`${className} z-10 flex gap-1`}>
            <button onClick={onDecrementWrapper}>
                {"<-"}
            </button>
            <div>
                {currentIndex + 1} / {range} 
            </div>
            <button onClick={onIncrementWrapper}>
                {"->"}
            </button>
        </div>
    );
}