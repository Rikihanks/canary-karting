import db from '../db.js';
import { sendRacePrompt } from '../services/telegram.js';

const CHECK_INTERVAL = 60 * 60 * 1000; // 60 minutes
let intervalHandle: ReturnType<typeof setInterval> | null = null;

interface CalendarRow {
    id_circuito: string;
    nombre: string;
    fecha: string;
    division: number;
    activa: string;
    terminada: string;
    temporada?: string;
}

function getDateNDaysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(0, 0, 0, 0);
    return d;
}

function dateToString(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

async function checkUpcomingRaces(): Promise<void> {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;

    try {
        const today = dateToString(getDateNDaysAgo(0));         // dd/mm/yyyy
        const future = dateToString(getDateNDaysAgo(7));        // dd/mm/yyyy (7 days ahead)

        // The calendar uses dd/mm/yyyy format in the 'fecha' column
        // We fetch all upcoming races and filter in JS since SQLite date comparison with string format is tricky
        const allRaces = db.prepare(`
            SELECT * FROM calendar
            WHERE activa = '0' AND terminada != '1'
            ORDER BY fecha ASC
        `).all() as CalendarRow[];

        function parseDate(str: string): Date {
            const [dd, mm, yyyy] = str.split('/').map(Number);
            return new Date(yyyy, mm - 1, dd);
        }

        const todayDate = parseDate(today);
        const futureDate = parseDate(future);

        const upcoming = allRaces.filter(r => {
            const d = parseDate(r.fecha);
            return d >= todayDate && d <= futureDate;
        });

        for (const race of upcoming) {
            const alreadySent = db.prepare(
                'SELECT 1 FROM race_notifications WHERE id_circuito = ? AND fecha = ? AND division = ?'
            ).get(race.id_circuito, race.fecha, race.division);

            if (alreadySent) continue;

            await sendRacePrompt(race.id_circuito, race.fecha, race.division, race.nombre);

            // Small delay to avoid flooding Telegram
            await new Promise(r => setTimeout(r, 1000));
        }
    } catch (err) {
        console.error('raceCheck error:', err);
    }
}

export function startRaceCheck(): void {
    if (intervalHandle) return;
    console.log('Starting race check cron (every 60 min)');
    checkUpcomingRaces(); // Run immediately on start
    intervalHandle = setInterval(checkUpcomingRaces, CHECK_INTERVAL);
}

export function stopRaceCheck(): void {
    if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
    }
}
