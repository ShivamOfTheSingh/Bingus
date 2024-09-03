"use client";
import { useState } from "react";

export default function Component({ content }: { content: string }) {
    const [count, setCount] = useState(0);

    function onClick() {
        setCount(count + 1);
    }

    return(
        <div className="text-red-500 text-4xl">
            <div>Content from API: {content}</div>
            <div>Counter: {count}</div>
            <button onClick={onClick} className="bg-slate-600 text-white p-2 hover:bg-slate-300">Increment</button>
        </div>        
    );   
}