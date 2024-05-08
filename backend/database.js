const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database in memory
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the in-memory SQLite database.');
});

// SQL to create a new table
let sql = `
CREATE TABLE accounts (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    balance REAL NOT NULL
)`;

// Running the SQL query to create a table
db.run(sql, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("Table 'accounts' created.");
});

// Closing the database connection should be done after all operations are complete
// Here for demonstration, I close it right away which is not practical for a real application
db.close((err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Database connection closed');
});

module.exports = db;