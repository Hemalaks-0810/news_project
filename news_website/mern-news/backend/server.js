import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js"; // Import News Routes
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes); // Add News Routes

app.get("/", (req, res) => {
  res.send("MERN News API Running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
