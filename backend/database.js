const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to in-memory SQLite database.');
});


let sql = `
CREATE TABLE accounts (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    balance REAL NOT NULL
)`;


db.run(sql, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("Table 'accounts' created.");
});


db.close((err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Database connection closed');
});

module.exports = db;