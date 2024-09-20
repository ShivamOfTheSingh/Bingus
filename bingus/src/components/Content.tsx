"use client";
import { useState } from "react";
import "./content.css";

interface DataState {
    [key: string]: any[]; // Data will be an array of objects with varying structures
}

const Content = () => {
    const [data, setData] = useState<DataState>({});

    const api_endpoints = [
        "comment_reply",
        "comment_vote",
        "followings",
        "media",
        "post_comment",
        "post_vote",
        "posts",
        "user_settings",
        "users"
    ];

    const fetchData = async (endpoint: string) => {
        try {
            let t = { ...data };
            const response = await fetch(`http://localhost:3000/api/${endpoint}`);
            const jsonData = await response.json();
            t[endpoint] = jsonData;
            setData(t);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="content-main">
            {api_endpoints.map((endpoint, index) => (
                <div className="each-endpoint" key={index}>
                    <button onClick={() => fetchData(endpoint)}>
                        Fetch {endpoint}
                    </button>
                    <ul>
                        {data[endpoint] && data[endpoint].map((row, rowIndex) => (
                            <li key={rowIndex}>
                                <div className="data-row">
                                    {Object.entries(row).map(([key, value]) => (
                                        <div key={key}>
                                            <strong>{key}</strong>: {JSON.stringify(value)},&nbsp;&nbsp;&nbsp;
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Content;
