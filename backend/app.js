const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");

const JWT_SECRET = "change_this_secret"; // change the secret

const app = express();
app.use(cors()); // Allows requests from all domains
app.use(express.json()); // Parses JSON-formatted request bodies

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    `INSERT INTO accounts (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(username, password);
      const token = jwt.sign({ userid: this.lastID }, JWT_SECRET, {
        expiresIn: "24h",
      });
      res.status(201).json({ token, userid: this.lastID });
    }
  );
});

// Login User
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM accounts WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userid: user.userid }, JWT_SECRET, {
          expiresIn: "24h",
        });
        res.json({ token, userid: user.userid });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    }
  );
});

// Add more endpoints for balance checking, deposits, and withdrawals
