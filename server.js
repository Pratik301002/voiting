const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Admin credentials
const ADMIN_ID = "admin";
const ADMIN_PASS = "admin123";

app.use(express.json());
app.use(express.static("public"));

const votesFile = path.join(__dirname, "votes.json");

// Vote submission
app.post("/vote", (req, res) => {
  const { name, candidate } = req.body;

  if (!name || !candidate) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const data = JSON.parse(fs.readFileSync(votesFile));
  data.votes.push({
    name,
    candidate,
    time: new Date().toISOString()
  });

  fs.writeFileSync(votesFile, JSON.stringify(data, null, 2));
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
  const data = JSON.parse(fs.readFileSync(votesFile));
  res.json(data.votes);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
