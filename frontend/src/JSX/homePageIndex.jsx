import "../CSS/homePageStyles.css";
import React, { useEffect, useState } from "react";
import BitcoinImage from "/bitcoin.png";
import BackgroundImage from "/background.jpg";
import TitleSidebarBackground from "/title-sidebar-background.jpg";

export default function Home() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    )
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data)))
      .catch((err) => console.error("Error loading currencies:", err));
  }, []);

  const handleConvert = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      setResult("Please select both currencies and enter an amount");
      return;
    }

    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const rate = data[fromCurrency][toCurrency];
      const converted = (amount * rate).toFixed(2);
      setResult(
        `${amount} ${fromCurrency.toUpperCase()} = ${converted} ${toCurrency.toUpperCase()}`
      );
    } catch (err) {
      console.error(err);
      setResult("Conversion failed");
    }
  };

  return (
    <div className="mission-container">
      <div className="title">
        <h1>crypt0.current_</h1>
      </div>

      <div className="app">
        <h2>Currency Converter</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          <option value="" disabled>
            Select currency
          </option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>
        <span>to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          <option value="" disabled>
            Select currency
          </option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>
        <button onClick={handleConvert}>Convert</button>

        {result && <p>{result}</p>}
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

      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
