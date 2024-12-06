"use client";
import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notFound } from "next/navigation";
import { usePathname } from "next/navigation";
import "@/public/NavBarStyle.css";
import {
  faHome,
  faComment,
  faPlus,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar2() {
  const pathName = usePathname();
  const router = useRouter();
  const isMessageActive = pathName.startsWith("/conversations");

  const [isClicked, setIsClicked] = useState(false);

  async function logout() {
    const response = await fetch("https://bingus.website/api/session/logout", {
      method: "PATCH",
    });

    if (response.status === 200) {
      router.push("/login");
    } else {
      notFound();
    }
  }

  return (
    <div className="navbar">
      <div className="branding">
        <img
          src="https://text.media.giphy.com/v1/media/giphy.gif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJwcm9kLTIwMjAtMDQtMjIiLCJzdHlsZSI6Im1pZGlmaWxlcyIsInRleHQiOiJCaW5ndXMiLCJpYXQiOjE3MzM0NTcyNTR9.SuNT-NmvCKixXPF3avR186S6D0KtFQ4alic73jSis8Y"
          alt="Branding GIF"
          className="branding-gif"
        />
      </div>
      <Nav className="nav-icons">
        <Nav.Item className={`nav-item-custom ${pathName === "/" ? "active" : ""}`}>
          <Link className="link" href="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </Nav.Item>
        <Nav.Item className={`nav-item-custom ${isMessageActive ? "active" : ""}`}>
          <Link className="link" href="/conversations">
            <FontAwesomeIcon icon={faComment} />
          </Link>
        </Nav.Item>
        <Nav.Item className={`nav-item-custom ${pathName === "/post" ? "active" : ""}`}>
          <Link className="link" href="/post">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </Nav.Item>
        <Nav.Item className={`nav-item-custom ${pathName === "/profile" ? "active" : ""}`}>
          <Link className="link" href="/profile">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </Nav.Item>
      </Nav>
      <div
        className={`logout ${isClicked ? "animate-click" : ""}`}
        onClick={logout}
      >
        <Nav.Link className="logout-link">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Nav.Link>
      </div>
    </div>
  );
}
