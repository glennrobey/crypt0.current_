import "../CSS/missionStatementStyles.css";
import BitcoinImage from "/bitcoin.png";
import BackgroundImage from "/background.jpg";
import TitleSidebarBackground from "/title-sidebar-background.jpg";

export default function Mission() {
  return (
    <div className="mission-container">
      {/* Title */}
      <div className="title">
        <h1>
          crypt0.current_ <br />- Mission Statement
        </h1>
      </div>

      {/* Sidebar navigation */}
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

      {/* Mission statement body */}
      <div className="body">
        <p className="description">
          Since the initial rise of cryptocurrency, years ago, there is still
          very little knowledge of what can be done with it and how it will
          grow. It remains a rather niche concept for the most part, with not
          many people looking into it or even getting mainstream attention.
          Crypto may never be used by the mainstream, but that doesn't reflect
          on its importance.
        </p>

        <p className="description">
          What is yet to be done with crypto can quite potentially{" "}
          <b>change the world</b> with the{" "}
          <i>way people view currency as a whole</i>. This unconventional
          currency is what is called <i>decentralized currency</i>: simply put,
          no governments or banks can regulate it. One concept that underground
          internet culture has always embraced is the idea of
          <i>
            <u> freedom of information</u>
          </i>
          . Cryptocurrency fits that role, as everything involved with it, from
          the blockchain to purchasing and spending it, is completely
          transparent in the public domain.
        </p>

        <p className="description">
          In all actuality,{" "}
          <b>
            cryptocurrencies cannot and should not be regulated by any bank or
            government.
          </b>
          This is because cryptocurrency offers an ideal alternative to those
          who want truly free currency. No entity can manipulate it; it is a
          currency{" "}
          <b>
            <i>for and by the people</i>
          </b>
          .
        </p>

        <p className="description">
          crypt0.current_ is an app that allows any exchange rate calculations
          to be made from any currency to one another: centralized or not. It
          also provides a dedicated forum for those interested and/or involved
          in any currency exchanges. The total purpose of crypt0.current_ is to
          provide a free, lightweight platform to get currency exchange
          information as well as to discuss currency-related ideas.
        </p>
      </div>

      {/* Bottom-left image */}
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
