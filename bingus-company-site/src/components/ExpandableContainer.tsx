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
        <div className={`${className}`}>
            <div className="flex gap-6 items-center">
                <div id="title">
                    {title}
                </div>
                <div onClick={onClickExpand} id="dropdown-button">
                    {expanded ? "Collapse" : "Expand"}
                </div>
            </div>
            {expanded ?
                <div id="content-container" className="flex flex-col gap-3">
                    {content}
                </div>
            : null}
        </div>
    );
}