"use client";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import ApiError from "@/lib/ApiError";
import "@/public/NavBarStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notFound } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  faHome,
  faSearch,
  faComment,
  faBell,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {NavLink, useLocation} from "react-router-dom";

export default function NavBar2() {
  //John Pork
  const pathName = usePathname();
  const router = useRouter();
  const isMessageActive = pathName.startsWith("/conversations");
  async function logout() {
    const response = await fetch("https://production.d3drl1bcjmxovs.amplifyapp.com/api/session/logout", {
      method: "PATCH",
    });
    if (response.status == 200) {
      router.push("/login");
    } else {
      notFound();
    }
  }
  
  return (
    <div className="navbar">
      <div className="branding">
        <h2>Bingus</h2>
      </div>
      <Nav defaultActiveKey="/profile" className="flex-column">
        <Nav.Item
          className={`nav-item-custom ${pathName === "/" ? "active" : ""}`}
        >
          <Link className="link" href="/">
            <span className="icon">
              <FontAwesomeIcon icon={faHome} style={{ color: "black" }} />
            </span>
            Home
          </Link>
        </Nav.Item>
        <Nav.Item
          className={`nav-item-custom ${
            pathName === "/search" ? "active" : ""
          }`}
        >
          <Link className="link" href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faSearch} style={{ color: "black" }} />
            </span>
            Search
          </Link>
        </Nav.Item>
        <Nav.Item
          className={`nav-item-custom ${
            isMessageActive ? "active" : ""
          }`}
        >
          <Link className="link" href="/conversations">
            <span className="icon">
              <FontAwesomeIcon icon={faComment} style={{ color: "black" }} />
            </span>
            Messages
          </Link>
        </Nav.Item>
        <Nav.Item
          className={`nav-item-custom ${
            pathName === "/notifications" ? "active" : ""
          }`}
        >
          <Link className="link" href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faBell} style={{ color: "black" }} />
            </span>
            Notifications
          </Link>
        </Nav.Item>
        <Nav.Item
          className={`nav-item-custom ${pathName === "/post" ? "active" : ""}`}
        >
          <Link className="link" href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} style={{ color: "black" }} />
            </span>
            Post
          </Link>
        </Nav.Item>
        <Nav.Item
          className={`nav-item-custom profile ${
            pathName === "/profile" ? "active" : ""
          }`}
        >
          <Link className="link" href="/profile">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="profile-pic"
            />
            Profile
          </Link>
        </Nav.Item>
      </Nav>
      <Nav.Item className="nav-item-custom logout">
        <Nav.Link onClick={logout} className="logout">
          <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
          Logout
        </Nav.Link>
      </Nav.Item>
    </div>
  );
}
