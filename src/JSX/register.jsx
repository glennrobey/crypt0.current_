import "../CSS/registerStyles.css";
import React, { useState } from "react";
import BitcoinImage from "/bitcoin.png";

const API_URL = "http://localhost:5000/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.token) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        alert(`Registered and logged in as ${data.username}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Check console.");
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
          <br />- Register
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

      {!user ? (
        <form className="register-form" onSubmit={handleRegister}>
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

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      ) : (
        <div>
          <p>
            Logged in as {user.username} {user.is_admin ? "(Admin)" : ""}
          </p>
          <button onClick={handleLogout}>Logout</button>
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
