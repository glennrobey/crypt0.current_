import "../CSS/loginStyles.css";
import React from "react";
import BitcoinImage from "/bitcoin.png";

export default function Login() {
  return (
    <div className="mission-container">
      <div className="title">
        <h1>
          crypt0.current_
          <br />
          <br />- Login
        </h1>
      </div>
      <nav className="sidebar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/mission">Mission</a>
          </li>
          <li>
            <a href="/forum">Forum</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
        </ul>
      </nav>
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
