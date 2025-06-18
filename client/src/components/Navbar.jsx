import React from "react";
import { NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const pages = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Events", path: "/events" },
  
];

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1B3A2F",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Container to center content and give padding */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
          padding: "0 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/snooker-logo.png"
            alt="logo"
            style={{ height: "40px", marginRight: "1rem" }}
          />
          <h1
            style={{ color: "#F8F9F9", fontSize: "1.5rem", fontWeight: "600" }}
          >
            SnookerPlay
          </h1>
        </div>

        {/* Navigation Links */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "2rem",
            margin: 0,
            padding: 0,
          }}
        >
          {pages.map((page) => (
            <li key={page.name}>
              <NavLink
                to={page.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "#F8F9F9",
                  fontWeight: "500",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  borderBottom: isActive ? "2px solid #F4A261" : "none",
                })}
              >
                {page.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #F8F9F9",
                  color: "#F8F9F9",
                  backgroundColor: "transparent",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#F4A261",
                  color: "#1B3A2F",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
