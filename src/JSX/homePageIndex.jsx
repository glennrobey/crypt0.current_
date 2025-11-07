import "../CSS/homePageStyles.css";
import React from "react";
import BitcoinImage from "/bitcoin.png";

export default function Home() {
  return (
    <div className="mission-container">
      <div className="title">
        <h1>crypt0.current_</h1>
      </div>
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
