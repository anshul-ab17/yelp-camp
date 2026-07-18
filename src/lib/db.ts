import Database from 'better-sqlite3';
import path from 'path';

// Define SQLite database path inside the workspace
const dbPath = path.resolve(process.cwd(), 'yelp-camp.sqlite');

const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS campgrounds (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    geometry_lat REAL NOT NULL,
    geometry_lng REAL NOT NULL,
    images_json TEXT NOT NULL, -- JSON array of image objects: [{url, filename}]
    author_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    body TEXT NOT NULL,
    rating INTEGER NOT NULL,
    author_id TEXT NOT NULL,
    campground_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(campground_id) REFERENCES campgrounds(id) ON DELETE CASCADE
  );
`);

export default db;
