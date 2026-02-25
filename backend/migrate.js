import Database from 'better-sqlite3';
import fetch from 'node-fetch'; // Note: Node 18+ has built-in fetch, but for safety on older servers
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

// --- LINKS (Copied from dataAggregation.js) ---
const LINKS = {
    pilots: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuMlsT6eU1TXBGack6DMmfi_b0V5WiyVljgfx_FvMJss8szInsydh8IYWlX1xC5W9OCAaTvVDFMdvq/pub?output=csv",
    results: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMne6l5w7ujgcLU3ePvvjCEi1w0iCLBecjA45Iw9bWYYtjgAcGfGRgdI9z9QKycTLvFv7lYnIgwAnD/pub?output=csv",
    calendar: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?output=csv",
    teams: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGiW1xkyLsAjvjeVK9w_EYJy-rXPRpZEd1ZXt-fHBJt09Uva1szI-bfRQj9qgLmFmOPobb6opJwTBt/pub?output=csv"
};

async function migrate() {
    console.log("Starting migration from Google Sheets...");

    // 1. Migrate Pilots
    console.log("Migrating Pilots...");
    const pilotsCsv = await fetch(LINKS.pilots).then(r => r.text());
    const pilotsLines = pilotsCsv.split('\n').slice(1);
    const pilotStmt = db.prepare('INSERT OR REPLACE INTO pilots (name, team, photo, division, season, championship, dotdTimes) VALUES (?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        for (const line of pilotsLines) {
            const p = line.split(',').map(s => s?.trim());
            if (p.length >= 5) {
                pilotStmt.run(p[0], p[1], p[2], parseInt(p[3]) || 0, p[4] || '2026', p[5] || '0', parseInt(p[6]) || 0);
            }
        }
    })();

    // 2. Migrate Results
    console.log("Migrating Results...");
    const resultsCsv = await fetch(LINKS.results).then(r => r.text());
    const resultsLines = resultsCsv.split('\n').slice(1);
    const resultStmt = db.prepare('INSERT INTO results (pilot, id_circuito, date, division, pos_clasificacion, pos_final, tiempo_vuelta, es_vuelta_rapida, condicion, investigating, replaces, tiempo_qualy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    db.prepare('DELETE FROM results').run(); // Clear existing results for fresh migration
    db.transaction(() => {
        for (const line of resultsLines) {
            const r = line.split(',').map(s => s?.trim());
            if (r.length >= 8) {
                resultStmt.run(
                    r[0], r[1], r[2], parseInt(r[3]) || 0, parseInt(r[4]) || 0, parseInt(r[5]) || 0,
                    r[6], r[7]?.toUpperCase() === 'TRUE' ? 1 : 0, r[8] || 'Seco', parseInt(r[9]) || 0, r[10] || null, r[11] || null
                );
            }
        }
    })();

    // 3. Migrate Teams
    console.log("Migrating Teams...");
    const teamsCsv = await fetch(LINKS.teams).then(r => r.text());
    const teamsLines = teamsCsv.split('\n').slice(1);
    const teamStmt = db.prepare('INSERT OR REPLACE INTO teams (name, logo) VALUES (?, ?)');

    db.transaction(() => {
        for (const line of teamsLines) {
            const t = line.split(',').map(s => s?.trim());
            if (t.length >= 2) {
                teamStmt.run(t[0], t[1]);
            }
        }
    })();

    // 4. Migrate Calendar
    console.log("Migrating Calendar...");
    const calCsv = await fetch(LINKS.calendar).then(r => r.text());
    const calLines = calCsv.split('\n').slice(1);
    const calStmt = db.prepare('INSERT OR REPLACE INTO calendar (id_circuito, nombre, fecha, activa, terminada, division, temporada) VALUES (?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        for (const line of calLines) {
            const c = line.split(',').map(s => s?.trim());
            if (c.length >= 7) {
                calStmt.run(c[0], c[1], c[2], c[3], c[4], parseInt(c[5]) || 1, c[6] || '2026');
            }
        }
    })();

    console.log("Migration finished successfully!");
}

migrate().catch(console.error);
