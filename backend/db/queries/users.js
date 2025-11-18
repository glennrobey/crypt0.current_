import pool from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(username, password) {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const {
    rows: [user],
  } = await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, is_admin",
    [username, password_hash]
  );
  return user;
}
