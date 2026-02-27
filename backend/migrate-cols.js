import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    db.exec(`
        ALTER TABLE results ADD COLUMN sancion INTEGER DEFAULT 0;
    `);
    console.log('Added sancion column.');
} catch (e) {
    if (e.message.includes('duplicate column name')) {
        console.log('sancion column already exists.');
    } else {
        console.error('Error adding sancion column:', e.message);
    }
}

try {
    db.exec(`
        ALTER TABLE results ADD COLUMN amonestacion INTEGER DEFAULT 0;
    `);
    console.log('Added amonestacion column.');
} catch (e) {
    if (e.message.includes('duplicate column name')) {
        console.log('amonestacion column already exists.');
    } else {
        console.error('Error adding amonestacion column:', e.message);
    }
}

console.log('Migration completed constraints checking.');
