import "../CSS/loginStyles.css";
import React from "react";
import BitcoinImage from "/bitcoin.png";
import BackgroundImage from "/background.jpg";

export default function Login() {
  return (
    <div className="mission-container">
      <div className="title">
        <h1>
          crypt0.current_
          <br />- Login
        </h1>
      </div>
      <nav className="sidebar">
        <ul>
          <li>
            <a href="/"> - Home</a>
          </li>
          <li>
            <a href="/mission"> - Mission</a>
          </li>
          <li>
            <a href="/forum"> - Forum</a>
          </li>
          <li>
            <a href="/login"> - Login</a>
          </li>
          <li>
            <a href="/register"> - Register</a>
          </li>
        </ul>
      </nav>
      <label>Username:</label>
      <input type="text" placeholder="Enter username" required />

      <label>Password:</label>
      <input type="password" placeholder="Enter password" required />

      <button type="submit">Login</button>
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
