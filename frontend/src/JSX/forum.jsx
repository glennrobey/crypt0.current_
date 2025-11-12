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

  // --- Fetch posts from backend ---
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- Create a new post ---
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
      const data = await res.json();
      setPosts([data, ...posts]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Edit a post ---
  const handleEditPost = async (postId) => {
    const newText = prompt("Edit your post:");
    if (!newText) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: newText }),
      });
      const data = await res.json();
      setPosts(posts.map((p) => (p.id === postId ? data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Delete a post ---
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Add a comment ---
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

  // --- Edit a comment ---
  const handleEditComment = async (postId, commentId) => {
    const newText = prompt("Edit your comment:");
    if (!newText) return;

    try {
      const res = await fetch(`${API_URL}/posts/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: newText }),
      });
      const data = await res.json();
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === commentId ? data : c
                ),
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // --- Delete a comment ---
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await fetch(`${API_URL}/posts/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== commentId),
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
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
        </ul>
      </nav>

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
                <b>{post.user_name || post.user}:</b> {post.message}
              </p>

              {user && (user.is_admin || user.id === post.user_id) && (
                <div>
                  <button onClick={() => handleEditPost(post.id)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </div>
              )}

              <div className="comments">
                {post.comments.map((c) => (
                  <p key={c.id}>
                    <i>{c.user_name || c.user}:</i> {c.message}
                    {user && (user.is_admin || user.id === c.user_id) && (
                      <>
                        <button
                          onClick={() => handleEditComment(post.id, c.id)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(post.id, c.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
