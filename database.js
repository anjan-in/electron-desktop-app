const Database = require('better-sqlite3');
const db = new Database('app.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
    )
`).run();

module.exports = db;
