const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");

const JWT_SECRET = "secret";

const app = express();
app.use(cors()); // Allows requests from all domains
app.use(express.json()); // Parses JSON-formatted request bodies

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// JWT middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_VALUE

  if (token == null) return res.sendStatus(401); // if no token, return unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // if token is not valid, return forbidden
      req.user = user;
      next();
  });
};


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


// Balance checking
app.get('/balance', authenticateToken, (req, res) => {
  const userid = req.user.userid;
  db.get('SELECT balance FROM accounts WHERE userid = ?', [userid], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (!row) {
          return res.status(404).json({ error: 'Account not found' });
      }
      res.json({ balance: row.balance });
  });
});


// Deposit
app.post('/deposit', authenticateToken, (req, res) => {
  const userid = req.user.userid;
  const amount = req.body.amount;

  if (amount <= 0) {
      return res.status(400).json({ error: 'Deposit amount must be positive' });
  }

  db.run('UPDATE accounts SET balance = balance + ? WHERE userid = ?', [amount, userid], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Deposit successful', amount });
  });
});


// Withdrawal
app.post('/withdraw', authenticateToken, (req, res) => {
  const userid = req.user.userid;
  const amount = req.body.amount;

  if (amount <= 0) {
      return res.status(400).json({ error: 'Withdrawal amount must be positive' });
  }

  db.get('SELECT balance FROM accounts WHERE userid = ?', [userid], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (!row) {
          return res.status(404).json({ error: 'Account not found' });
      }
      if (row.balance < amount) {
          return res.status(400).json({ error: 'Insufficient funds' });
      }

      db.run('UPDATE accounts SET balance = balance - ? WHERE userid = ?', [amount, userid], function(err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Withdrawal successful', amount });
      });
  });
});

