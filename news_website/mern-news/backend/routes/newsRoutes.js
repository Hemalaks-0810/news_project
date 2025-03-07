import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import News from "../models/News.js";

const router = express.Router();

// **Create News Article**
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const newNews = new News({
      title,
      content,
      category,
      image,
      author: req.user.id,
    });

    await newNews.save();
    res.status(201).json({ message: "News added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Get All News**
router.get("/", async (req, res) => {
  try {
    const news = await News.find().populate("author", "name");
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Get Single News by ID**
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name");
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Update News (Only Author)**
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    // Check if the user is the author
    if (news.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Update news fields
    const { title, content, category, image } = req.body;
    news.title = title || news.title;
    news.content = content || news.content;
    news.category = category || news.category;
    news.image = image || news.image;

    await news.save();
    res.json({ message: "News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Delete News (Only Author)**
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    if (news.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await news.deleteOne();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
