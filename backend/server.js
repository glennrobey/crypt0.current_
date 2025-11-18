import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
