import { fetchWithRetry, getDOTDResults } from './data';
import { getBackendData } from './backendService';

// ==========================================
// NEW V2 SPREADSHEET LINKS (PLACEHOLDERS)
// ==========================================
const PILOTS_V2_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuMlsT6eU1TXBGack6DMmfi_b0V5WiyVljgfx_FvMJss8szInsydh8IYWlX1xC5W9OCAaTvVDFMdvq/pub?output=csv"; // REEMPLAZAR CON TU LINK PUBICADO
const RESULTS_V2_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMne6l5w7ujgcLU3ePvvjCEi1w0iCLBecjA45Iw9bWYYtjgAcGfGRgdI9z9QKycTLvFv7lYnIgwAnD/pub?output=csv"; // REEMPLAZAR CON TU LINK PUBICADO
const CALENDAR_V2_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?output=csv"; // Utiliza el mismo calendario que V1
const TEAMS_V2_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGiW1xkyLsAjvjeVK9w_EYJy-rXPRpZEd1ZXt-fHBJt09Uva1szI-bfRQj9qgLmFmOPobb6opJwTBt/pub?output=csv"; // Opcional, si quieres definir los logos de los equipos y la division de cada uno

const POINTS_SYSTEM = {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1
};

const POLE_POINTS = 1;
const WIN_BONUS = 0;
const FAST_LAP_POINTS = 1;

// ==========================================
// PARSERS FOR V2 SHEETS
// ==========================================

export function parsePilotsV2CSV(csvText) {
    const lines = csvText.split('\n');
    const pilots = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 5) {
            pilots.push({
                name: parts[0].trim(),
                team: parts[1].trim(),
                photo: parts[2] ? parts[2].trim() : "https://www.shutterstock.com/image-photo/formula-1-pilot-profile-silhouette-600nw-2666928449.jpg",
                division: parseInt(parts[3].trim()) || 0,
                season: parts[4] ? parts[4].trim() : "2026",
                championship: parts[5] ? parts[5].trim() : "0",
                dotdTimes: parts[6] ? parseInt(parts[6].trim()) : 0
            });
        }
    }
    return pilots;
}

export function parseResultsV2CSV(csvText) {
    const lines = csvText.split('\n');
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');

        // Expected columns: Piloto, ID_Circuito, Fecha, Division, Posicion_Clasificacion, Posicion_Final, Tiempo_Vuelta_Rapida, Es_Vuelta_Rapida, Condicion, Investigando, Sustituye_A, Tiempo_Vuelta_Rapida_Clasi
        if (parts.length >= 8) {
            results.push({
                pilot: parts[0].trim(),
                id_circuito: parts[1].trim(),
                date: parts[2].trim(),
                division: parseInt(parts[3].trim()) || 0,
                pos_clasificacion: parseInt(parts[4].trim()) || 0,
                pos_final: parseInt(parts[5].trim()) || 0,
                tiempo_vuelta: parts[6].trim(),
                es_vuelta_rapida: parts[7].trim().toUpperCase() === 'TRUE' || parts[7].trim().toUpperCase() === 'SI' || parts[7].trim() === '1',
                condicion: parts[8] ? parts[8].trim() : "Seco",
                investigating: parts[9] ? (parseInt(parts[9].trim()) || 0) : 0,
                replaces: parts[10] ? parts[10].trim() : "",
                tiempo_qualy: parts[11] ? parts[11].trim() : "",
                temporada: parts[12] ? parts[12].trim() : "2026"
            });
        }
    }
    return results;
}

export function parseTeamsV2CSV(csvText) {
    const lines = csvText.split('\n');
    const teams = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 2) {
            teams.push({
                name: parts[0].trim(),
                logo: parts[1] ? parts[1].trim() : "",
            });
        }
    }
    return teams;
}

// ==========================================
// AGGREGATION ENGINE
// ==========================================

let aggregationCache = null;

async function buildAggregatedData() {
    let pilotsData = [];
    let resultsData = [];
    let teamsMeta = [];
    let dataLoaded = false;

    // 1. Try V3 Backend
    try {
        const { getBackendData, USE_V3 } = await import('./backendService');
        if (USE_V3) {
            const backendResponse = await getBackendData();

            if (backendResponse.success) {
                pilotsData = backendResponse.data.pilots;
                resultsData = backendResponse.data.results;
                teamsMeta = backendResponse.data.teams;
                dataLoaded = true;
                console.log("V3 Data Loaded Successfully");
            }
        }
    } catch (e) {
        console.warn("V3 fetch failed, falling back to V2.", e);
    }

    // 2. V2 Sheets Fallback (Only if V3 didn't load)
    if (!dataLoaded) {
        try {
            const [pilotsRes, resultsRes, teamsRes] = await Promise.all([
                fetchWithRetry(PILOTS_V2_CSV_LINK, 1, false, false),
                fetchWithRetry(RESULTS_V2_CSV_LINK, 1, false, false),
                fetchWithRetry(TEAMS_V2_CSV_LINK, 1, false, false).catch(() => null)
            ]);

            pilotsData = parsePilotsV2CSV(await pilotsRes.text());
            resultsData = parseResultsV2CSV(await resultsRes.text());
            if (teamsRes) {
                teamsMeta = parseTeamsV2CSV(await teamsRes.text());
            }
            dataLoaded = true;
        } catch (e) {
            console.warn("V2 CSVs failed.", e);
            return { pilotsMap: new Map(), teamsMap: new Map(), resultsData: [] };
        }
    }

    const pilotsMap = new Map();
    const teamsMap = new Map();

    // Helper to generate unique pilot keys based on our new constraint
    const getPilotKey = (p) => `${p.name || ''}_${p.team || ''}_${p.division || 0}_${p.season || ''}`;

    // 1. Initialize Pilots Map from Pilotos_V2
    pilotsData.forEach(p => {
        const key = getPilotKey(p);
        pilotsMap.set(key, {
            name: p.name,
            team: p.team,
            photo: p.photo,
            division: p.division,
            season: p.season,
            championship: p.championship,
            dotdTimes: p.dotdTimes,
            points: 0,
            podiums: 0,
            poles: 0,
            wins: 0,
            investigating: 0,
        });
    });

    // 2. Initialize Teams Map
    Array.from(pilotsMap.values()).forEach(p => {
        const teamKey = `${p.team}_${p.division}_${p.season}`;
        if (!teamsMap.has(teamKey)) {
            const meta = teamsMeta.find(t => t.name.toLowerCase() === p.team.toLowerCase());
            teamsMap.set(teamKey, {
                name: p.team,
                points: 0,
                logo: meta ? meta.logo : "",
                podiums: 0,
                poles: 0,
                wins: 0,
                division: p.division,
                pilots: [],
                season: p.season
            });
        }
        const tState = teamsMap.get(teamKey);
        if (!tState.pilots.includes(p.name)) {
            tState.pilots.push(p.name);
        }
    });

    // 3. Process Race Results with Business Rules for Substitutions
    resultsData.forEach((r, idx) => {
        // Find the pilot in the right division and season
        // If season/temporada is null/missing (common in V3 experimental entries), default to '2026'
        const actingPilot = Array.from(pilotsMap.values()).find(p =>
            p.name === r.pilot &&
            p.division.toString() === r.division.toString() &&
            (p.season || "2026").toString() === (r.temporada || r.season || "2026").toString()
        );

        let replacedPilot = null;
        if (r.replaces) {
            replacedPilot = Array.from(pilotsMap.values()).find(p =>
                p.name === r.replaces &&
                p.division.toString() === r.division.toString() &&
                (p.season || "2026").toString() === (r.temporada || r.season || "2026").toString()
            );
        }

        if (!actingPilot && !replacedPilot) return;

        // Calculate points for this result
        let pts = 0;
        if (POINTS_SYSTEM[r.pos_final]) pts += POINTS_SYSTEM[r.pos_final];
        if (r.pos_final === 1) pts += WIN_BONUS;
        if (r.pos_clasificacion === 1) pts += POLE_POINTS;
        if (r.es_vuelta_rapida) pts += FAST_LAP_POINTS;

        // Determine target team key
        const pilotForTeam = replacedPilot || actingPilot;
        const teamKey = `${pilotForTeam.team}_${pilotForTeam.division}_${pilotForTeam.season}`;
        const tState = teamsMap.get(teamKey);

        if (replacedPilot) {
            if (tState) {
                tState.points += pts;
                if (r.pos_final === 1) tState.wins += 1;
                if (r.pos_final > 0 && r.pos_final <= 3) tState.podiums += 1;
                if (r.pos_clasificacion === 1) tState.poles += 1;
            }
            if (actingPilot && r.investigating === 1) actingPilot.investigating = 1;

        } else if (actingPilot) {
            actingPilot.points += pts;
            if (r.pos_final === 1) actingPilot.wins += 1;
            if (r.pos_final > 0 && r.pos_final <= 3) actingPilot.podiums += 1;
            if (r.pos_clasificacion === 1) actingPilot.poles += 1;
            if (r.investigating === 1) actingPilot.investigating = 1;

            if (tState) {
                tState.points += pts;
                if (r.pos_final === 1) tState.wins += 1;
                if (r.pos_final > 0 && r.pos_final <= 3) tState.podiums += 1;
                if (r.pos_clasificacion === 1) tState.poles += 1;
            }
        }
    });

    aggregationCache = { pilotsMap, teamsMap, resultsData };
    return aggregationCache;
}

export async function getLeaderboardDataV2(skipCache = false) {
    if (!aggregationCache || skipCache) {
        await buildAggregatedData();
    }
    // Devolvemos el array en el mismo formato que parseCSV() en data.js
    return Array.from(aggregationCache.pilotsMap.values());
}

export async function getTeamsDataV2(skipCache = false) {
    if (!aggregationCache || skipCache) {
        await buildAggregatedData();
    }
    return Array.from(aggregationCache.teamsMap.values());
}

export async function getResultsDataV2(skipCache = false) {
    if (!aggregationCache || skipCache) {
        await buildAggregatedData();
    }
    return aggregationCache.resultsData;
}
