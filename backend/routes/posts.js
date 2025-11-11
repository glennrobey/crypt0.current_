import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all posts with comments
router.get("/", async (req, res) => {
  try {
    const postRes = await pool.query(
      `SELECT posts.*, users.username AS user_name
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY created_at DESC`
    );

    const posts = await Promise.all(
      postRes.rows.map(async (post) => {
        const commentRes = await pool.query(
          `SELECT comments.*, users.username AS user_name
           FROM comments
           JOIN users ON comments.user_id = users.id
           WHERE post_id = $1
           ORDER BY created_at ASC`,
          [post.id]
        );
        return { ...post, comments: commentRes.rows };
      })
    );

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// CREATE a new post
router.post("/", authenticateToken, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });

  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, message) VALUES ($1, $2) RETURNING *",
      [req.user.id, message]
    );
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// UPDATE a post
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });

  try {
    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (!postRes.rows.length)
      return res.status(404).json({ message: "Post not found" });
    if (postRes.rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updatedPost = await pool.query(
      "UPDATE posts SET message = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [message, id]
    );
    res.json(updatedPost.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// DELETE a post
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (!postRes.rows.length)
      return res.status(404).json({ message: "Post not found" });
    if (postRes.rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ADD comment to a post
router.post("/:id/comments", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });

  try {
    const newComment = await pool.query(
      "INSERT INTO comments (post_id, user_id, message) VALUES ($1, $2, $3) RETURNING *",
      [id, req.user.id, message]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
