import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
const db = new Database(dbPath);

const info = db.prepare("PRAGMA table_info(pilots)").all();
console.log(JSON.stringify(info, null, 2));
