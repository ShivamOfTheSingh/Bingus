"use client";

import { useState } from "react";

interface ExpandableContainerProps {
    title: string;
    content: JSX.Element[];
    className?: string;
}

export default function ExpandableContainer({ title, content, className }: ExpandableContainerProps) {
    const [expanded, setExpanded] = useState(false);

    function onClickExpand() {
        setExpanded(!expanded);
    }

    return (
        <div className={`${className} flex flex-col justify-center gap-3`}>
            <div className="flex gap-9 items-center text-2xl self-center">
                <div id="title" className="text-white">
                    {title}
                </div>
                <button onClick={onClickExpand} id="dropdown-button" className="border-white border-2 rounded p-[0.2rem] text-white hover:text-purple-500 hover:bg-white">
                    {expanded ? "Collapse" : "Expand"}
                </button>
            </div>
            {expanded ?
                <div id="content-container" className="flex flex-col gap-3">
                    {content}
                </div>
            : null}
        </div>
    );
}