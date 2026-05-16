import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: DatabaseType = new Database(path.join(__dirname, '..', 'database.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase(): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS pilots (
            name TEXT, team TEXT, photo TEXT, division INTEGER,
            season TEXT DEFAULT '2026', championship TEXT,
            dotdTimes INTEGER DEFAULT 0,
            PRIMARY KEY (name, team, division, season)
        );
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pilot TEXT, id_circuito TEXT, date TEXT, division INTEGER,
            pos_clasificacion INTEGER, pos_final INTEGER,
            tiempo_vuelta TEXT, es_vuelta_rapida INTEGER DEFAULT 0,
            condicion TEXT DEFAULT 'Seco', investigating INTEGER DEFAULT 0,
            replaces TEXT, tiempo_qualy TEXT, temporada TEXT DEFAULT '2026'
        );
        CREATE TABLE IF NOT EXISTS teams (
            name TEXT PRIMARY KEY, logo TEXT
        );
        CREATE TABLE IF NOT EXISTS calendar (
            id_circuito TEXT, nombre TEXT, fecha TEXT,
            activa TEXT, terminada TEXT, division INTEGER,
            temporada TEXT DEFAULT '2026',
            PRIMARY KEY (id_circuito, fecha, division)
        );
        CREATE TABLE IF NOT EXISTS race_notifications (
            id_circuito TEXT NOT NULL,
            fecha TEXT NOT NULL,
            division INTEGER NOT NULL,
            nombre TEXT,
            chat_id TEXT,
            message_id INTEGER,
            sent_at TEXT,
            responded_at TEXT,
            activated INTEGER DEFAULT 0,
            notified_pilots INTEGER DEFAULT 0,
            PRIMARY KEY (id_circuito, fecha, division)
        );
    `);

    try {
        db.exec(`ALTER TABLE results ADD COLUMN kart TEXT DEFAULT ''`);
    } catch {
        // Column already exists
    }

    try {
        db.exec(`ALTER TABLE results ADD COLUMN sancion INTEGER DEFAULT 0`);
    } catch {
        // Column already exists
    }

    try {
        db.exec(`ALTER TABLE results ADD COLUMN amonestacion INTEGER DEFAULT 0`);
    } catch {
        // Column already exists
    }
}

export default db;
