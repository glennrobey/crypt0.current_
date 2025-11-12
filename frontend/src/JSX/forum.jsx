import "../CSS/forumStyles.css";
import BitcoinImage from "/bitcoin.png";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export default function Forum() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState({});

  // --- Fetch posts + auto-update ---
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Post CRUD ---
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage) return;
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
  };

  const handleReply = async (e, postId) => {
    e.preventDefault();
    const replyText = replyMessages[postId];
    if (!replyText) return;

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
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleEditPost = async (postId) => {
    const newText = prompt("Edit your post:");
    if (!newText) return;

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
          {!user && (
            <>
              <li>
                <a href="/login"> - Login</a>
              </li>
              <li>
                <a href="/register"> - Register</a>
              </li>
            </>
          )}
          {user && (
            <li>
              <button
                onClick={() => {
                  setUser(null);
                  localStorage.removeItem("user");
                }}
              >
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </nav>

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
            {(user?.id === post.user_id || user?.is_admin) && (
              <div>
                <button onClick={() => handleEditPost(post.id)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              </div>
            )}

            <div className="comments">
              {post.comments.map((c) => (
                <div key={c.id} className="comment">
                  <p>
                    <i>{c.user_name}:</i> {c.message}
                  </p>

                  {(user?.id === c.user_id || user?.is_admin) && (
                    <div className="comment-buttons">
                      <button
                        onClick={async () => {
                          const newText = prompt("Edit comment:", c.message);
                          if (!newText) return;

                          const res = await fetch(
                            `${API_URL}/posts/comments/${c.id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user.token}`,
                              },
                              body: JSON.stringify({ message: newText }),
                            }
                          );
                          const data = await res.json();
                          setPosts(
                            posts.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    comments: p.comments.map((cm) =>
                                      cm.id === c.id ? data : cm
                                    ),
                                  }
                                : p
                            )
                          );
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this comment?")) return;

                          await fetch(`${API_URL}/posts/comments/${c.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${user.token}` },
                          });

                          setPosts(
                            posts.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    comments: p.comments.filter(
                                      (cm) => cm.id !== c.id
                                    ),
                                  }
                                : p
                            )
                          );
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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

      <img
        src={BitcoinImage}
        alt="Bitcoin Logo"
        className="bottom-left-image"
      />
    </div>
  );
}
