"use client";

import { useState } from "react";
import Image from "next/image";
import dropdownIcon from "@/src/public/triangle.svg";

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
        <div className={`${className} flex justify-between items-center`}>
            <div id="title">
                {title}
            </div>
            <div onClick={onClickExpand} id="dropdown-icon">
                <Image src={dropdownIcon} alt="dropdown-icon" height={10} width={10} />
            </div>
            {expanded ? 
                <div id="content-container">
                    {content}
                </div> 
            : null}
        </div>
    );
}