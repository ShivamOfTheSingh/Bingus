"use client";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ApiError from "@/lib/ApiError";
import "@/public/NavBarStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faComment,
  faBell,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const handleLogout = () => { };
  return (
    <div className="navbar">
      <div className="branding">
        <h2>Bingus</h2>
      </div>
      <Nav defaultActiveKey="/profile" className="flex-column">
        <Nav.Item className="nav-item-custom">
          <Link href="/">
            <span className="icon">
              <FontAwesomeIcon icon={faHome} style={{ color: "black" }} />
            </span>
            Home
          </Link>
        </Nav.Item>
        <Nav.Item className="nav-item-custom">
          <Link href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faSearch} style={{ color: "black" }} />
            </span>
            Search
          </Link>
        </Nav.Item>
        <Nav.Item className="nav-item-custom">
          <Link href="/profile">
              <span className="icon">
                <FontAwesomeIcon icon={faComment} style={{ color: "black" }} />
              </span>
              Messages
          </Link>
        </Nav.Item>
        <Nav.Item className="nav-item-custom">
          <Link href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faBell} style={{ color: "black" }} />
            </span>
            Notifications
          </Link>
        </Nav.Item>
        <Nav.Item className="nav-item-custom">
          <Link href="/profile">
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} style={{ color: "black" }} />
            </span>
            Post
          </Link>
        </Nav.Item>
        <Nav.Item className="nav-item-custom profile">
          <Link href="/profile">
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
        <Link href="/logout">
          <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
          Logout
        </Link>
      </Nav.Item>
    </div>
  );
}
