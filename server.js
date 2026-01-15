const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// ADMIN CREDENTIALS
// =======================
const ADMIN_ID = "admin";
const ADMIN_PASS = "admin123";

// =======================
// MONGODB CONNECTION
// =======================
mongoose.connect("mongodb+srv://pratik110301_db_user:bejfhXOQpNMq44kv@cluster0.9rykuvh.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// =======================
// SCHEMA & MODEL
// =======================
const voteSchema = new mongoose.Schema({
  name: String,
  candidate: String,
  time: { type: Date, default: Date.now }
});

const Vote = mongoose.model("Vote", voteSchema);

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// ROUTES
// =======================

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Submit vote
app.post("/vote", async (req, res) => {
  const { name, candidate } = req.body;

  if (!name || !candidate) {
    return res.status(400).json({ message: "Invalid vote data" });
  }

  try {
    await Vote.create({ name, candidate });
    res.json({ message: "Vote recorded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

// Admin login
app.post("/admin/login", (req, res) => {
  const { adminId, password } = req.body;

  if (adminId === ADMIN_ID && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// Get votes (admin)
app.get("/admin/votes", async (req, res) => {
  try {
    const votes = await Vote.find().sort({ time: -1 });
    res.json(votes);
  } catch {
    res.status(500).json([]);
  }
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
