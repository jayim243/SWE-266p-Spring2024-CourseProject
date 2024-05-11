const sqlite3 = require("sqlite3").verbose();

// Connect to the SQLite database in memory
const db = new sqlite3.Database(
  "./bank.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log("Connected to the bank database.");
  }
);

// // Delete all data from the table
// db.run("DELETE FROM accounts", (err) => {
//   if (err) {
//     console.error("Error deleting data:", err);
//   } else {
//     console.log("All data deleted successfully.");
//   }
// });
// // Reset any autoincrement counters
// db.run("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='accounts'", (err) => {
//   if (err) {
//     console.error("Error resetting sequence:", err);
//   }
// });

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0
  )`);
});

module.exports = db;
