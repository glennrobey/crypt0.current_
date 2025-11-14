import "../CSS/loginStyles.css";
import React, { useState, useEffect } from "react";
import BitcoinImage from "/bitcoin.png";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // If already logged in, redirect or show message
  useEffect(() => {
    if (user) {
      console.log("Logged in as:", user.username);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log(res);

      const data = await res.json();

      if (data.token) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        alert(`Logged in as ${data.username}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check console.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="mission-container">
      <div className="title">
        <h1>
          crypt0.current_
          <br />- Login
        </h1>
      </div>

      <nav className="sidebar">
        <ul id="sidebar-menu">
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

      {!user ? (
        <form className="login-form" onSubmit={handleLogin}>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      ) : (
        <div>
          <p className="login-message">
            Logged in as {user.username} {user.is_admin ? "(Admin)" : ""}
          </p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
