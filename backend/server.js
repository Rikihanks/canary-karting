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
    name TEXT PRIMARY KEY,
    team TEXT,
    photo TEXT,
    division INTEGER,
    season TEXT,
    championship TEXT,
    dotdTimes INTEGER DEFAULT 0
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
    replaces TEXT
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
    temporada TEXT,
    PRIMARY KEY (id_circuito, fecha, division)
  );
`);

// --- GET ENDPOINT (READ) ---
app.get('/api/v3/data', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    try {
        const pilots = db.prepare('SELECT * FROM pilots').all();
        const results = db.prepare('SELECT * FROM results').all();
        const teams = db.prepare('SELECT * FROM teams').all();
        const calendar = db.prepare('SELECT * FROM calendar').all();

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

// --- POST ENDPOINT (WRITE) ---
app.post('/api/v3/results', (req, res) => {
    if (process.env.ENABLE_V3 !== 'true') {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' });
    }
    const { action, ...payload } = req.body;

    try {
        if (action === 'addResult') {
            const stmt = db.prepare(`
        INSERT INTO results (pilot, id_circuito, date, division, pos_clasificacion, pos_final, tiempo_vuelta, es_vuelta_rapida, condicion, investigating, replaces)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run(
                payload.pilot,
                payload.id_circuito,
                payload.fecha,
                payload.division,
                payload.pos_clasificacion,
                payload.pos_final,
                payload.tiempo_vuelta,
                payload.es_vuelta_rapida ? 1 : 0,
                payload.condicion || 'Seco',
                payload.investigating || 0,
                payload.replaces || null
            );
            return res.json({ success: true, message: 'Result added' });
        }

        if (action === 'updateResult') {
            const stmt = db.prepare(`
        UPDATE results SET 
          pos_clasificacion = ?, 
          pos_final = ?, 
          tiempo_vuelta = ?, 
          es_vuelta_rapida = ?, 
          condicion = ?, 
          investigating = ?, 
          replaces = ?
        WHERE pilot = ? AND id_circuito = ? AND date = ? AND division = ?
      `);
            stmt.run(
                payload.pos_clasificacion,
                payload.pos_final,
                payload.tiempo_vuelta,
                payload.es_vuelta_rapida ? 1 : 0,
                payload.condicion || 'Seco',
                payload.investigating || 0,
                payload.replaces || null,
                payload.pilot,
                payload.id_circuito,
                payload.fecha,
                payload.division
            );
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
