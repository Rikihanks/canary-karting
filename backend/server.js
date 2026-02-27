import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pilots (
    name TEXT,
    team TEXT,
    photo TEXT,
    division INTEGER,
    season TEXT DEFAULT '2026',
    championship TEXT,
    dotdTimes INTEGER DEFAULT 0,
    PRIMARY KEY (name, team, division, season)
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pilot TEXT,
    id_circuito TEXT,
    date TEXT,
    division INTEGER,
    pos_clasificacion INTEGER,
    pos_final INTEGER,
    tiempo_vuelta TEXT,
    es_vuelta_rapida INTEGER DEFAULT 0,
    condicion TEXT DEFAULT 'Seco',
    investigating INTEGER DEFAULT 0,
    replaces TEXT,
    tiempo_qualy TEXT,
    temporada TEXT DEFAULT '2026'
  );

  CREATE TABLE IF NOT EXISTS teams (
    name TEXT PRIMARY KEY,
    logo TEXT
  );

  CREATE TABLE IF NOT EXISTS calendar (
    id_circuito TEXT,
    nombre TEXT,
    fecha TEXT,
    activa TEXT,
    terminada TEXT,
    division INTEGER,
    temporada TEXT DEFAULT '2026',
    PRIMARY KEY (id_circuito, fecha, division)
  );
`);

// --- GET ENDPOINT (READ) ---
app.get('/api/v3/data', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    const { season, temporada } = req.query;
    const filterValue = season || temporada;

    try {
        let pilotsQuery = 'SELECT * FROM pilots';
        let resultsQuery = 'SELECT * FROM results';
        let calendarQuery = 'SELECT * FROM calendar';
        const params = [];

        if (filterValue) {
            pilotsQuery += ' WHERE season = ?';
            resultsQuery += ' WHERE temporada = ?';
            calendarQuery += ' WHERE temporada = ?';
            params.push(filterValue);
        }

        const pilots = db.prepare(pilotsQuery).all(...params);
        const results = db.prepare(resultsQuery).all(...params);
        const teams = db.prepare('SELECT * FROM teams').all();
        const calendar = db.prepare(calendarQuery).all(...params);

        res.json({
            success: true,
            data: {
                pilots,
                results: results.map(r => ({
                    ...r,
                    es_vuelta_rapida: !!r.es_vuelta_rapida
                })),
                teams,
                calendar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- SCHEMA MANAGEMENT ENDPOINTS ---

// List all tables
app.get('/api/v3/tables', (req, res) => {
    try {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
        res.json({ success: true, tables: tables.map(t => t.name) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get table schema
app.get('/api/v3/schema/:table', (req, res) => {
    const { table } = req.params;
    try {
        const columns = db.prepare(`PRAGMA table_info(${table})`).all();
        res.json({ success: true, columns });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Modify Table Schema (Add, Rename, Drop Columns)
app.post('/api/v3/schema/modify', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    const { table, action, columnName, newColumnName, columnType } = req.body;

    try {
        if (action === 'addColumn') {
            db.prepare(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType || 'TEXT'}`).run();
            return res.json({ success: true, message: `Column ${columnName} added to ${table}` });
        }

        if (action === 'renameColumn') {
            db.prepare(`ALTER TABLE ${table} RENAME COLUMN ${columnName} TO ${newColumnName}`).run();
            return res.json({ success: true, message: `Column ${columnName} renamed to ${newColumnName} in ${table}` });
        }

        if (action === 'dropColumn') {
            // Note: DROP COLUMN requires SQLite 3.35.0+
            db.prepare(`ALTER TABLE ${table} DROP COLUMN ${columnName}`).run();
            return res.json({ success: true, message: `Column ${columnName} dropped from ${table}` });
        }

        res.status(400).json({ success: false, error: 'Invalid schema action' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- POST ENDPOINT (WRITE) ---
app.post('/api/v3/results', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    const { action, ...payload } = req.body;

    try {
        if (action === 'addResult') {
            // Get columns dynamically to support expanded schema
            const columnsInfo = db.prepare("PRAGMA table_info(results)").all();
            const validColumns = columnsInfo.map(c => c.name).filter(c => c !== 'id');

            // Build dynamic insert
            const providedKeys = Object.keys(payload).filter(k => validColumns.includes(k));
            const placeholders = providedKeys.map(() => '?').join(', ');
            const columnsString = providedKeys.join(', ');
            const values = providedKeys.map(k => {
                const val = payload[k];
                if (typeof val === 'boolean') return val ? 1 : 0;
                return val;
            });

            const stmt = db.prepare(`INSERT INTO results (${columnsString}) VALUES (${placeholders})`);
            stmt.run(...values);
            return res.json({ success: true, message: 'Result added' });
        }

        if (action === 'updateResult') {
            // Get columns dynamically
            const columnsInfo = db.prepare("PRAGMA table_info(results)").all();
            const validColumns = columnsInfo.map(c => c.name).filter(c => !['id', 'pilot', 'id_circuito', 'date', 'division'].includes(c));

            const updateParts = [];
            const values = [];

            Object.keys(payload).forEach(key => {
                if (validColumns.includes(key)) {
                    updateParts.push(`${key} = ?`);
                    let val = payload[key];
                    if (typeof val === 'boolean') val = val ? 1 : 0;
                    values.push(val);
                }
            });

            if (updateParts.length === 0) {
                return res.status(400).json({ success: false, error: 'No valid columns to update' });
            }

            // Where clause values
            values.push(payload.pilot, payload.id_circuito, payload.fecha, payload.division);

            const stmt = db.prepare(`
        UPDATE results SET ${updateParts.join(', ')}
        WHERE pilot = ? AND id_circuito = ? AND date = ? AND division = ?
      `);
            stmt.run(...values);
            return res.json({ success: true, message: 'Result updated' });
        }

        if (action === 'deleteResult') {
            const stmt = db.prepare(`
        DELETE FROM results 
        WHERE pilot = ? AND id_circuito = ? AND date = ? AND division = ?
      `);
            stmt.run(
                payload.pilot,
                payload.id_circuito,
                payload.fecha,
                payload.division
            );
            return res.json({ success: true, message: 'Result deleted' });
        }

        res.status(400).json({ success: false, error: 'Invalid action' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- GENERIC ENTITY MANAGEMENT (PILOTS, TEAMS, CALENDAR) ---
app.post('/api/v3/manage/:table', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    const { table } = req.params;
    const { action, ...payload } = req.body;

    try {
        const columnsInfo = db.prepare(`PRAGMA table_info(${table})`).all();
        if (columnsInfo.length === 0) return res.status(404).json({ success: false, error: 'Table not found' });

        const validColumns = columnsInfo.map(c => c.name);
        const pkColumns = columnsInfo.filter(c => c.pk > 0).map(c => c.name);
        const autoInc = columnsInfo.some(c => c.pk === 1 && c.type === 'INTEGER' && table === 'results'); // Simplified check

        if (action === 'addItem' || action === 'add') {
            const keys = Object.keys(payload).filter(k => validColumns.includes(k) && k !== 'id');
            const placeholders = keys.map(() => '?').join(', ');
            const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
            const values = keys.map(k => {
                const val = payload[k];
                return typeof val === 'boolean' ? (val ? 1 : 0) : val;
            });
            stmt.run(...values);
            return res.json({ success: true, message: 'Item added' });
        }

        if (action === 'updateItem' || action === 'update') {
            const updateKeys = Object.keys(payload).filter(k => validColumns.includes(k) && !pkColumns.includes(k));
            const setClause = updateKeys.map(k => `${k} = ?`).join(', ');
            const whereClause = pkColumns.map(k => `${k} = ?`).join(' AND ');

            const values = [
                ...updateKeys.map(k => {
                    const val = payload[k];
                    return typeof val === 'boolean' ? (val ? 1 : 0) : val;
                }),
                ...pkColumns.map(k => payload[k])
            ];

            const stmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`);
            stmt.run(...values);
            return res.json({ success: true, message: 'Item updated' });
        }

        if (action === 'deleteItem' || action === 'delete') {
            const whereClause = pkColumns.map(k => `${k} = ?`).join(' AND ');
            const values = pkColumns.map(k => payload[k]);
            const stmt = db.prepare(`DELETE FROM ${table} WHERE ${whereClause}`);
            stmt.run(...values);
            return res.json({ success: true, message: 'Item deleted' });
        }

        res.status(400).json({ success: false, error: 'Invalid action' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
