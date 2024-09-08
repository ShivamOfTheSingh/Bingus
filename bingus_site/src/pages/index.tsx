import React from "react";
import Link from "next/link";
import HomePage from "./home";

export default class extends React.Component {
    render() {
        return (
            <div>
                <h1>
                    This is index
                </h1>
                <Link href="/home">Go to Home Page</Link>
            </div>
        );
    }
}