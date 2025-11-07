import "../CSS/forumStyles.css";
import BitcoinImage from "/bitcoin.png";

export default function Forum() {
  return (
    <div className="mission-container">
      <div className="title">
        <h1>
          crypt0.current_
          <br />
          <br />- Forum
        </h1>
      </div>
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
