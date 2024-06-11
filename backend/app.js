const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors()); // Allows requests from all domains
app.use(express.json()); // Parses JSON-formatted request bodies

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// JWT middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN_VALUE

  if (token == null) return res.sendStatus(401); // if no token, return unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if token is not valid, return forbidden
    req.user = user;
    next();
  });
};

const isPasswordStrong = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Register User
app.post("/register", async (req, res) => {
  const { username, password, balance } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO accounts (username, password, balance) VALUES ('${username}', '${hashedPassword}', '${balance}')`;

  db.run(query, function (err) {
    if (err) {
      if (err.code == "SQLITE_CONSTRAINT") {
        return res.status(500).json({ error: "Invalid Input" });
      } else {
        return res.status(500).json({ error: "An Unknown Error has occured" });
      }
    }
    const token = jwt.sign({ userid: user.userid }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(201).json({ token, userid: this.lastID });
  });
});

// Login User
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM accounts WHERE username = '${username}'`;

  db.get(query, async (err, user) => {
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
  });
});

// Balance checking
app.get("/balance", authenticateToken, (req, res) => {
  const userid = req.user.userid;

  const query = `SELECT balance FROM accounts WHERE userid = '${userid}'`;

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ balance: row.balance });
  });
});

// Deposit
app.post("/deposit", authenticateToken, (req, res) => {
  const userid = req.user.userid;
  const amount = req.body.amount;

  if (amount <= 0) {
    return res.status(400).json({ error: "Deposit amount must be positive" });
  }

  const query = `UPDATE accounts SET balance = balance + ${amount} WHERE userid = '${userid}'`;

  db.run(query, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Retrieve the updated balance

    const query2 = `SELECT balance FROM accounts WHERE userid = '${userid}'`;

    db.get(query2, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Deposit successful", balance: row.balance });
    });
  });
});

// Withdrawal
app.post("/withdraw", authenticateToken, (req, res) => {
  const userid = req.user.userid;
  const amount = req.body.amount;

  if (amount <= 0) {
    return res
      .status(400)
      .json({ error: "Withdrawal amount must be positive" });
  }
  const query = `SELECT balance FROM accounts WHERE userid = '${userid}'`;

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Account not found" });
    }
    if (row.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    db.run(
      "UPDATE accounts SET balance = balance - ? WHERE userid = ?",
      [amount, userid],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Retrieve the updated balance
        db.get(
          "SELECT balance FROM accounts WHERE userid = ?",
          [userid],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({
              message: "Withdrawal successful",
              balance: row.balance,
            });
          }
        );
      }
    );
  });
});

//IDOR (Insecure Direct Object References) vulnerability
app.get("/user/:id", authenticateToken, (req, res) => {
  const userId = req.params.id; // Directly using user input

  db.get(`SELECT * FROM users WHERE id = ${userId}`, (err, result) => {
    if (err) {
      res.status(500).send("Server error");
    } else if (result) {
      res.json(result);
    } else {
      res.status(404).send("User not found");
    }
  });
});
