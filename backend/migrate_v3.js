/**
 * MIGRACIÓN DE BASE DE DATOS - CANARY KARTING V3
 * Objetivo: Añadir soporte para pilotos inactivos y puntos de ajuste manuales.
 * 
 * Instrucciones:
 * 1. Copia el contenido de la sección 'SQL' y ejecútalo en tu cliente de SQLite.
 * 2. O ejecuta este archivo si tienes un entorno Node.js con 'better-sqlite3' instalado.
 */

/* SQL A EJECUTAR:

-- 1. Añadir columna para visibilidad (1 = visible en individual, 0 = solo suma a equipo)
ALTER TABLE pilots ADD COLUMN activo INTEGER DEFAULT 1;

-- 2. Añadir columna para puntos de ajuste/manuales
ALTER TABLE pilots ADD COLUMN puntos_ajuste INTEGER DEFAULT 0;

*/

// --- SCRIPT DE EJECUCIÓN AUTOMÁTICA (OPCIONAL) ---
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    console.log('--- Iniciando migración de base de datos ---');

    // Añadir columna activo
    try {
        db.prepare("ALTER TABLE pilots ADD COLUMN activo INTEGER DEFAULT 1").run();
        console.log('✅ Columna "activo" añadida correctamente.');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('ℹ️ La columna "activo" ya existe.');
        } else {
            throw e;
        }
    }

    // Añadir columna puntos_ajuste
    try {
        db.prepare("ALTER TABLE pilots ADD COLUMN puntos_ajuste INTEGER DEFAULT 0").run();
        console.log('✅ Columna "puntos_ajuste" añadida correctamente.');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('ℹ️ La columna "puntos_ajuste" ya existe.');
        } else {
            throw e;
        }
    }

    console.log('--- Migración finalizada con éxito ---');
} catch (error) {
    console.error('❌ Error durante la migración:', error.message);
}
