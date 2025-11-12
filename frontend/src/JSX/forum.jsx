import "../CSS/forumStyles.css";
import BitcoinImage from "/bitcoin.png";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export default function Forum() {
  // --- Auth ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // --- Posts ---
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState({});

  // --- Fetch posts ---
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to fetch posts:", text);
        return;
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- Posts CRUD ---
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage) return;

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to create post:", text);
        return;
      }

      const data = await res.json();
      setPosts([data, ...posts]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to delete post:", text);
        return;
      }

      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (e, postId) => {
    e.preventDefault();
    const replyText = replyMessages[postId];
    if (!replyText) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: replyText }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to reply:", text);
        return;
      }

      const data = await res.json();

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, data] }
            : post
        )
      );

      setReplyMessages({ ...replyMessages, [postId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="mission-container">
      {/* Title */}
      <div className="title">
        <h1>
          crypt0.current_
          <br />- Forum
        </h1>
      </div>

      {/* Sidebar */}
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

          {!user ? (
            <>
              <li>
                <a href="/login"> - Login</a>
              </li>
              <li>
                <a href="/register"> - Register</a>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>Logout ({user.username})</button>
            </li>
          )}
        </ul>
      </nav>

      {/* Forum Main */}
      <div className="forum-main">
        {user && (
          <div className="new-post">
            <h2>Create a New Post</h2>
            <form onSubmit={handlePost}>
              <textarea
                placeholder="Write your post here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
              <button type="submit">Post</button>
            </form>
          </div>
        )}

        <div className="posts">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <p>
                <b>{post.user_name}:</b> {post.message}
              </p>

              {/* Delete button only for admins or post owner */}
              {user && (user.is_admin || user.id === post.user_id) && (
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              )}

              <div className="comments">
                {post.comments.map((c) => (
                  <p key={c.id}>
                    <i>{c.user_name}:</i> {c.message}
                  </p>
                ))}

                {user && (
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
                )}
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
