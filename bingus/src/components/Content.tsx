"use client";
import { useState } from "react";
import "./content.css";

interface DataState {
    [key: string]: any[];
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

    const deleteRow = async (endpoint: string, rowIndex: number) => {
        try {
            const row = data[endpoint][rowIndex];
            const id = Object.values(row)[0];

            const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
                method: "DELETE",
                body: JSON.stringify({ id }),
            });
        
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    return (
        <div className="content-main">
            {api_endpoints.map((endpoint, index) => (
                <div className="each-endpoint" key={index}>
                    <button className="button" onClick={() => fetchData(endpoint)}>
                        Fetch {endpoint}
                    </button>
                    {data[endpoint] && data[endpoint].map((row, rowIndex) => (
                        <div key={rowIndex}>
                            <button
                                onClick={() => deleteRow(endpoint, rowIndex)}
                                className="data-row"
                                style={{ animationDelay: `${0.25 * rowIndex}s` }}
                            >
                                &#8594;&nbsp;
                                {Object.entries(row).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key}</strong>: {JSON.stringify(value)},&nbsp;&nbsp;&nbsp;
                                    </div>
                                ))}
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Content;
