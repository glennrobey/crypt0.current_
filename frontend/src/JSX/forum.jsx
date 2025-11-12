import "../CSS/forumStyles.css";
import BitcoinImage from "/bitcoin.png";
import { useState } from "react";
import TitleSidebarBackground from "/title-sidebar-background.jpg";

export default function Forum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "TestUser",
      message: "This is a sample forum post!",
      comments: [
        { id: 1, user: "TestGuy1", message: "Crypto is cool!" },
        { id: 2, user: "TestGuy2", message: "I disagree!" },
      ],
    },
    {
      id: 2,
      user: "TestGuy3",
      message: "I love money!",
      comments: [],
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState({});

  const handlePost = (e) => {
    e.preventDefault();
    if (!newMessage) return;
    const newPost = {
      id: posts.length + 1,
      user: "CurrentUser",
      message: newMessage,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewMessage("");
  };

  const handleReply = (e, postId) => {
    e.preventDefault();
    const replyText = replyMessages[postId];
    if (!replyText) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: post.comments.length + 1,
            user: "CurrentUser",
            message: replyText,
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );

    setReplyMessages({ ...replyMessages, [postId]: "" });
  };

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

      <div className="forum-main">
        <div className="new-post">
          <h2>Create a New Post</h2>
          <form onSubmit={handlePost}>
            <label>Message:</label>
            <textarea
              placeholder="Write your post here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Post</button>
          </form>
        </div>

        <div className="posts">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <p>
                <b>{post.user}:</b> {post.message}
              </p>

              <div className="comments">
                {post.comments.map((c) => (
                  <p key={c.id}>
                    <i>{c.user}:</i> {c.message}
                  </p>
                ))}

                {/* Reply form */}
                <form onSubmit={(e) => handleReply(e, post.id)}>
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyMessages[post.id] || ""}
                    onChange={(e) =>
                      setReplyMessages({
                        ...replyMessages,
                        [post.id]: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Reply</button>
                </form>
              </div>
            </div>
          ))}
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
