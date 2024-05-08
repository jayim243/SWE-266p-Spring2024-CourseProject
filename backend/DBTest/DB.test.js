const sqlite3 = require('sqlite3').verbose();

jest.setTimeout(10000);

let db;
beforeAll(done => {
    db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error('Error opening database', err);
            return done(err);
        }
        console.log('Connected to the SQLite database.');
        db.run("CREATE TABLE accounts (userid INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, balance REAL NOT NULL)", (err) => {
            if (err) {
                console.error("Error creating table", err);
                return done(err);
            }
            done();
        });
    });
});

describe('Database Operations', () => {
    test('inserts a user into the accounts table', done => {
        db.run(`INSERT INTO accounts (username, password, balance) VALUES (?, ?, ?)`, ['bob', 'securepassword', 200.00], function (err) {
            expect(err).toBeNull();
            expect(this.lastID).toBeDefined();
            done();
        });
    });

    test('retrieves users from the accounts table', done => {
        db.all(`SELECT * FROM accounts`, [], (err, rows) => {
            expect(err).toBeNull();
            expect(rows.length).toBeGreaterThan(0);
            expect(rows[0].username).toEqual('bob');
            done();
        });
    });
});

afterAll(done => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database', err);
        }
        console.log('Closed the database connection.');
        done();
    });
});