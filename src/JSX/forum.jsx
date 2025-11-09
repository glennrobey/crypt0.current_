import "../CSS/forumStyles.css";
import BitcoinImage from "/bitcoin.png";
import BackgroundImage from "/background.jpg";

export default function Forum() {
  return (
    <div className="mission-container">
      <div className="title">
        <h1>
          crypt0.current_
          <br />- Forum
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
      {/* Forum Threads Section */}
      <div className="forum-main">
        {/* Thread input form */}
        <div className="new-post">
          <h2>Create a New Post</h2>
          <form>
            <label>Username:</label>
            <input type="text" placeholder="Your username" required />

            <label>Message:</label>
            <textarea placeholder="Write your post here..." required></textarea>

            <button type="submit">Post</button>
          </form>
        </div>

        {/* Existing posts */}
        <div className="posts">
          <div className="post">
            <p>
              <b>TestUser:</b> This is a sample forum post!
            </p>
          </div>
          <div className="post">
            <p>
              <b>TestUser:</b> Another example post!
            </p>
          </div>
          {/* More posts will appear here */}
        </div>
      </div>
      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
