const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_ID = "admin";
const ADMIN_PASS = "admin123";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public")));

// Serve homepage explicitly (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Vote submission
app.post("/vote", (req, res) => {
  const { name, candidate } = req.body;

  if (!name || !candidate) {
    return res.status(400).json({ message: "Invalid vote data" });
  }

  const votesPath = path.join(__dirname, "votes.json");

  let data = { votes: [] };
  if (fs.existsSync(votesPath)) {
    data = JSON.parse(fs.readFileSync(votesPath, "utf-8"));
  }

  data.votes.push({
    name,
    candidate,
    time: new Date().toISOString()
  });

  fs.writeFileSync(votesPath, JSON.stringify(data, null, 2));

  res.json({ message: "Vote submitted successfully" });
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
app.get("/admin/votes", (req, res) => {
  const votesPath = path.join(__dirname, "votes.json");

  let data = { votes: [] };
  if (fs.existsSync(votesPath)) {
    data = JSON.parse(fs.readFileSync(votesPath, "utf-8"));
  }

  res.json(data.votes);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
