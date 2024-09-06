import React from "react";
import Link from "next/link";
import "../styles/home.css"; // Correct path to the CSS file

const HomePage: React.FC = () => {
    return (
        <div>
            <div className="container">
                <div className="navbar">
                    <img src="/bingus.jpg" className="logo" />
                    <nav>
                        <ul>
                            <li><Link href="/logs">BingusLogs</Link></li>
                            <li><a href="">Keepin' It Bingus</a></li>
                            <li><a href="">Bongus</a></li>
                            <li><a href="aboutUs.html">About Us</a></li>
                            <li>
                                <form action="" className="search-bar">
                                    <input type="text" placeholder="search" name="q" />
                                </form>
                            </li>
                        </ul>
                    </nav>
                </div>
                <img src="/bingus.jpg" alt="logo" />
                <h1>Bingus LLC</h1>
                <p>This is Bingus LLC</p>
            </div>
            <Link href="/">Go to Index Page</Link>
        </div>
    );
};

export default HomePage;
