import { getLeaderboardDataV2, getTeamsDataV2, getResultsDataV2 } from './dataAggregation';
// Removed static import to avoid circular dependency with backendService.js
const GOOGLE_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlPsGq-SypD4WPitvnR7JcluA8_6-5ePtuzyf5zFGJ31eppN55iUIHsKo0oduOZ9AVyVTf6VkPvTyu/pub?output=csv";
const RESULTS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP2AF0yixedvzkQcGkkLxnAP4fKl26f46dCFHdL6f11_QbeZP6NHLDshKqBkKtZdYLkyH8Rqrtedp5/pub?output=csv";
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Flag to use mock data for development
const USE_MOCK_DATA = false;

const CALENDAR_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?output=csv";
const CLASI_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=25895170&single=true&output=csv";
const RESULT_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=1225782575&single=true&output=csv";

const CONFIG_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzmcWDtElCuePL4NN3FT5fyBVdLNovmMa0QcibtaeeFAqpVkdioNT14QaG81zbgjrnEtHRsLxKSi17/pub?output=csv";
const UPDATE_CONFIG_EXEC = "https://script.google.com/macros/s/AKfycbwPsWOaN1WkF7eq5SXDWASonFNJUBW69HmdDSs8EpOZlCAQ8d_ShIQtvGaUaV0-YhZUtA/exec";
const DRIVER_OF_THE_DAY_EXEC = "https://script.google.com/macros/s/AKfycbxa4ahCzg9IieNBR3y4OxPHnqeBwA10oU9XrEG9yYIWYbH82cw8Fmkes-ivheETAsFupg/exec";
const DOTD_RESULTS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLNZjbf5AjIxBl659WE4OZsK1RpOpu7HSwa55-b3Dbxxp2Rrggu5lDdjXLyhvZYXpB7uYE6LaEP_G2/pub?output=csv";

export const DEFAULT_PILOT_PHOTO = "https://www.shutterstock.com/image-photo/formula-1-pilot-profile-silhouette-600nw-2666928449.jpg";
const NEWS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRguh21pKudFW_SOQW1wyjW-D95dzJ_Rn8LK-tHeaes0zKbRPVQbzRcKy_4xJ1l-tXRyTff4nfkbOLm/pub?output=csv";
export const RESULTS_V2_EXEC = "https://script.google.com/macros/s/AKfycbxA5js_Adt78HAQHW6851VtqZCtMzZoFEVuqi4A31752DUCM_tc0EtYRrPTGJTBLgap/exec";



// Direct URLs - Google Sheets published CSVs are already CORS-enabled
const DOTD_RESULTS_URL = DOTD_RESULTS_CSV_LINK;
const CONFIG_URL = CONFIG_CSV_LINK;
const SHEET_URL = GOOGLE_CSV_LINK;
const RESULTS_URL = RESULTS_CSV_LINK;
const CALENDAR_URL = CALENDAR_CSV_LINK;
const CLASI_URL = CLASI_CSV_LINK;
const RESULT_URL = RESULT_CSV_LINK;

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function clearCache() {
    cache.clear();
    console.log('Cache cleared');
}


export async function fetchWithRetry(url, maxRetries = 3, skipCache = false, persistent = false, customCacheDuration = null) {
    const now = new Date().getTime();
    const currentCacheDuration = customCacheDuration || CACHE_DURATION;

    // Check memory cache first - ONLY if not skipCache
    if (!skipCache && cache.has(url)) {
        const { data, timestamp } = cache.get(url);
        if (now - timestamp < currentCacheDuration) {
            console.log(`Serving from memory cache: ${url}`);
            return data.clone();
        } else {
            cache.delete(url);
        }
    }

    // Check localStorage - ONLY if persistent AND not skipCache
    if (persistent && !skipCache) {
        const saved = localStorage.getItem(`cache_${url}`);
        if (saved) {
            try {
                const { text, timestamp } = JSON.parse(saved);
                // Persistent cache can last longer (6x memory cache or custom duration)
                const persistentDuration = customCacheDuration ? customCacheDuration * 2 : CACHE_DURATION * 6;
                if (now - timestamp < persistentDuration) {
                    console.log(`Serving from localStorage: ${url}`);
                    return new Response(text);
                }
            } catch (e) {
                localStorage.removeItem(`cache_${url}`);
            }
        }
    }

    const timestamp = new Date().getTime();
    const cacheBusterUrl = `${url}&_t=${timestamp}`;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(cacheBusterUrl);
            if (response.ok) {
                const text = await response.text();

                // Update memory cache
                cache.set(url, {
                    data: new Response(text),
                    timestamp: now
                });

                // Update localStorage if persistent
                if (persistent) {
                    localStorage.setItem(`cache_${url}`, JSON.stringify({ text, timestamp: now }));
                }

                return new Response(text);
            }
        } catch (error) {
            if (i < maxRetries - 1) {
                console.log('Network request failed, retrying...', error);
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    throw new Error("Fallo al obtener los datos después de todos los reintentos.");
}

export function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const drivers = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');

        if (parts.length >= 11) {
            drivers.push({
                name: parts[0].trim(),
                team: parts[1].trim(),
                points: parseInt(parts[2].trim()) || 0,
                photo: parts[3] ? parts[3].trim() : "https://www.shutterstock.com/image-photo/formula-1-pilot-profile-silhouette-600nw-2666928449.jpg",
                podiums: parseInt(parts[4].trim()) || 0,
                poles: parseInt(parts[5].trim()) || 0,
                wins: parseInt(parts[6].trim()) || 0,
                division: parseInt(parts[7].trim()) || 0,
                season: parts[8] ? parts[8].trim() : "2025",
                championship: parts[9] ? parts[9].trim() : "0",
                dotdTimes: parseInt(parts[10].trim()) || 0,
                investigating: parseInt(parts[11].trim()) || 0,
            });
        }
    }
    return drivers;
}

export function parseResultsCSV(csvText) {
    const lines = csvText.split('\n');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');

        if (parts.length >= 10) {
            results.push({
                id: parts[0].trim(),
                name: parts[1].trim(),
                race: parts[2].trim(),
                date: parts[3].trim(),
                position: parseInt(parts[4].trim()) || 0,
                pole_pos: parseInt(parts[5].trim()) || 0,
                fastest_lap: parts[6] ? parts[6].trim() : "N/A",
                condition: parts[7].trim(),
                points_gained: parseInt(parts[8].trim()) || 0,
                season: parts[9] ? parts[9].trim() : "2026",
            });
        }
    }
    return results;
}

export function parseCalendarCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const events = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');

        if (parts.length >= 7) {
            events.push({
                id_circuito: parts[0] ? parts[0].trim() : '',
                nombre: parts[1] ? parts[1].trim() : 'Carrera sin nombre',
                fecha: parts[2] ? parts[2].trim() : '',
                activa: parts[3] ? (parseFloat(parts[3].trim()) == 1 ? '1' : '0') : '0',
                terminada: parts[4] ? (parseFloat(parts[4].trim()) == 1 ? '1' : '0') : '0',
                division: parts[5] ? parts[5].trim() : '1',
                temporada: parts[6] ? parts[6].trim() : '2026',
            });
        }
    }
    return events;
}

export function parseRaceDetailCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');

        if (parts.length >= 6) {
            results.push({
                piloto: parts[0] ? parts[0].trim() : 'Desconocido',
                posicion: parseInt(parts[1].trim()) || 99,
                id_circuito: parts[2] ? parts[2].trim() : '',
                fecha: parts[3] ? parts[3].trim() : '',
                division: parts[4] ? parts[4].trim() : '1',
                temporada: parts[5] ? parts[5].trim() : '2026',
                vuelta_rapida: parts[6] ? parts[6].trim() : '',
            });
        }
    }
    return results;
}

export async function getLeaderboardData(skipCache = false) {
    return await getLeaderboardDataV2(skipCache);
}

export async function getDriverResults() {
    const results = await getResultsDataV2();
    return results.map(r => ({
        name: r.pilot,
        race: r.id_circuito,
        date: r.date,
        position: r.pos_final,
        pole_pos: r.pos_clasificacion,
        fastest_lap: r.tiempo_vuelta || "N/A",
        condition: r.condicion || "Seco",
        points_gained: 0,
        season: r.temporada || r.season || "2026",
        sancion: r.sancion || 0,
        amonestacion: r.amonestacion || 0,
        investigating: r.investigating || 0,
        replaces: r.replaces || "",
        kart: r.kart || ""
    }));
}

export async function getCalendarData(skipCache = false) {
    if (USE_MOCK_DATA) {
        const { mockCalendarData } = await import('./mockRaceData');
        return mockCalendarData;
    }

    const { getBackendData } = await import('./backendService');
    const backendResponse = await getBackendData();

    if (backendResponse.success && backendResponse.data.calendar.length > 0) {
        return backendResponse.data.calendar.map(r => ({
            ...r,
            activa: r.activa != null ? (parseFloat(r.activa) == 1 ? '1' : '0') : '0',
            terminada: r.terminada != null ? (parseFloat(r.terminada) == 1 ? '1' : '0') : '0'
        }));
    }
    return [];
}

export async function getDOTDResults(skipCache = false) {
    const response = await fetchWithRetry(DOTD_RESULTS_URL, 3, skipCache, true);
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const results = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            if (parts.length >= 4) {
                results.push({
                    date: parts[0].trim(),
                    division: parseInt(parts[1].trim()) || 0,
                    driver: parts[2].trim(),
                    votes: parseInt(parts[3].trim()) || 0
                });
            }
        }
    }
    return results;
}

const TEAMS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlPsGq-SypD4WPitvnR7JcluA8_6-5ePtuzyf5zFGJ31eppN55iUIHsKo0oduOZ9AVyVTf6VkPvTyu/pub?gid=1382697089&single=true&output=csv";
const TEAMS_URL = TEAMS_CSV_LINK; // Direct URL - Google Sheets published CSVs are already CORS-enabled

export function parseTeamsCSV(csvText) {
    const lines = csvText.split('\n');
    const teamsMap = new Map();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');

        if (parts.length >= 8) {
            const name = parts[0].trim();
            const pilotName = parts[1].trim();

            if (!teamsMap.has(name)) {
                teamsMap.set(name, {
                    name: name,
                    points: parseInt(parts[2].trim()) || 0,
                    logo: parts[3] ? parts[3].trim() : "",
                    podiums: parseInt(parts[4].trim()) || 0,
                    poles: parseInt(parts[5].trim()) || 0,
                    wins: parseInt(parts[6].trim()) || 0,
                    division: parseInt(parts[7].trim()) || 0,
                    pilots: [pilotName],
                    season: parts[8] ? parts[8].trim() : "2025",
                });
            } else {
                const team = teamsMap.get(name);
                if (pilotName && !team.pilots.includes(pilotName)) {
                    team.pilots.push(pilotName);
                }
            }
        }
    }
    return Array.from(teamsMap.values());
}

export async function getTeamsData(skipCache = false) {
    return await getTeamsDataV2(skipCache);
}

export async function getRaceDetails(id, date, division) {
    const [allResults, calendarData] = await Promise.all([
        getResultsDataV2(),
        getCalendarData()
    ]);

    const raceInfo = calendarData.find(r => r.id_circuito === id && r.fecha === date && (!division || r.division == division));
    const raceResults = allResults.filter(r => r.id_circuito === id && r.date === date && (!division || r.division == division));
    const ptsTable = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };

    const toUI = (r, isClasi) => {
        const pos = isClasi ? r.pos_clasificacion : r.pos_final;
        const ptsBase = isClasi ? 0 : (ptsTable[pos] || 0);
        return {
            piloto: r.replaces ? `${r.pilot} *` : r.pilot,
            posicion: pos,
            id_circuito: r.id_circuito,
            fecha: r.date,
            division: r.division,
            temporada: "2026",
            vuelta_rapida: isClasi ? r.tiempo_qualy : r.tiempo_vuelta,
            es_vuelta_rapida: !isClasi && r.es_vuelta_rapida,
            pole_pos: !isClasi && r.pos_clasificacion === 1 ? 1 : 0,
            sancion: r.sancion,
            amonestacion: r.amonestacion,
            kart: r.kart || "",
            pts: ptsBase + (r.pos_clasificacion === 1 ? 1 : 0) + (r.es_vuelta_rapida ? 1 : 0),
            pts_base: ptsBase
        };
    };

    return {
        clasi: raceResults.map(r => toUI(r, true)).sort((a, b) => a.posicion - b.posicion),
        results: raceResults.map(r => toUI(r, false)).sort((a, b) => a.posicion - b.posicion),
        raceInfo
    };
}

export function parseConfigCSV(csvText) {
    const rawLines = csvText.split('\n');
    const lines = [];
    let currentLine = '';
    let inQuotes = false;

    for (const rawLine of rawLines) {
        const quoteCount = (rawLine.match(/"/g) || []).length;
        if (inQuotes) {
            currentLine += '\n' + rawLine;
        } else {
            currentLine = rawLine;
        }

        inQuotes = (inQuotes !== (quoteCount % 2 !== 0));

        if (!inQuotes) {
            lines.push(currentLine);
            currentLine = '';
        }
    }

    const config = {};

    lines.forEach(line => {
        const firstCommaIndex = line.indexOf(',');
        if (firstCommaIndex !== -1) {
            const key = line.substring(0, firstCommaIndex);
            const value = line.substring(firstCommaIndex + 1);

            if (key && value !== undefined) {
                const trimmedKey = key.trim();
                let trimmedValue = value.trim();

                // Remove surrounding quotes if present and handle escaped quotes
                if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
                    trimmedValue = trimmedValue.slice(1, -1).replace(/""/g, '"');
                }

                const upperValue = trimmedValue.toUpperCase();

                if (upperValue === 'TRUE') {
                    config[trimmedKey] = true;
                } else if (upperValue === 'FALSE') {
                    config[trimmedKey] = false;
                } else if (trimmedKey === 'clasi_arrows') {
                    // Try to parse clasi_arrows as JSON
                    try {
                        let jsonStr = trimmedValue;
                        // Replace single quotes from spreadsheet formatting with double quotes
                        if (jsonStr.startsWith("'")) jsonStr = jsonStr.substring(1);
                        if (jsonStr.endsWith("'")) jsonStr = jsonStr.slice(0, -1);
                        config[trimmedKey] = JSON.parse(jsonStr);
                    } catch (e) {
                        console.error("Error parsing clasi_arrows JSON. Fallback to default false.", e);
                        config[trimmedKey] = [
                            { división: 1, active: false },
                            { división: 2, active: false },
                            { división: 3, active: false }
                        ];
                    }
                } else if (trimmedKey === 'dotd') {
                    // Try to parse dotd as JSON
                    try {
                        let jsonStr = trimmedValue;
                        // Replace single quotes from spreadsheet formatting with double quotes
                        if (jsonStr.startsWith("'")) jsonStr = jsonStr.substring(1);
                        if (jsonStr.endsWith("'")) jsonStr = jsonStr.slice(0, -1);
                        config[trimmedKey] = JSON.parse(jsonStr);
                    } catch (e) {
                        console.error("Error parsing dotd JSON. Fallback to default false.", e);
                        config[trimmedKey] = [
                            { división: 1, active: 0 },
                            { división: 2, active: 0 },
                            { división: 3, active: 0 }
                        ];
                    }
                } else {
                    // Keep as string for things like messages/MOTD
                    config[trimmedKey] = trimmedValue;
                }
            }
        }
    });

    return config;
}

export async function getConfigData() {
    try {
        // ALWAYS skip cache and disable persistence for config
        const response = await fetchWithRetry(CONFIG_URL, 3, true, false);
        const data = await response.text();
        return parseConfigCSV(data);
    } catch (error) {
        console.error("Error fetching config:", error);
        // Fallback default config if fetch fails
        return {
            teams: true,
            races: true,
            inscripcion: false,
            sorteo: true,
            login: true,
            mantenimiento: false,
        };
    }
}

// Using the same Script URL for updates (User must update Backend to handle 'updateConfig' action)
export async function updateConfig(key, value, email) {
    try {
        const response = await fetch(UPDATE_CONFIG_EXEC, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script limitations often require no-cors for simple posts if not using proper CORS proxy for writes
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'updateConfig',
                key: key,
                value: value,
                email: email
            }),
        });

        // precise response handling with no-cors is limited (response type is opaque)
        // We assume success if no network error.
        return { success: true };
    } catch (error) {
        console.error("Error updating config:", error);
        return { success: false, message: error.message };
    }
}

export async function submitVote(driverName, division, votedBy) {
    const today = new Date().toISOString().split('T')[0];
    try {
        await fetch(DRIVER_OF_THE_DAY_EXEC, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'submitVote',
                driver: driverName,
                division: division,
                date: today,
                votedBy: votedBy
            }),
        });
        return { success: true };
    } catch (error) {
        console.error("Error submitting vote:", error);
        return { success: false, message: error.message };
    }
}

export async function updateRaceStatus(raceName, raceDate, field, value, email) {
    try {
        const response = await fetch(ASSISTANCE_WEB_APP_URL_RAW, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'updateRace',
                raceName: raceName,
                raceDate: raceDate,
                field: field, // 'activa' or 'terminada'
                value: value,
                email: email
            }),
        });

        // no-cors assumption of success
        return { success: true };
    } catch (error) {
        console.error("Error updating race status:", error);
        return { success: false, message: error.message };
    }
}

const ASSISTANCE_WEB_APP_URL_RAW = 'https://script.google.com/macros/s/AKfycbwsVhj9xs6Lb3JmAHzYc_18fTsxJ_n8rHoZ7z4IvprYnIxVyT7p2UnUsctPvf88sYrOaw/exec';

/**
 * Confirms race assistance by sending data to Google Apps Script
 * @param {Object} assistanceData - The assistance confirmation data
 * @param {string} assistanceData.raceDate - The race date (YYYY-MM-DD format)
 * @param {string} assistanceData.email - The pilot's email
 * @param {string} assistanceData.division - The division name
 * @param {string} assistanceData.codigo - The verification code
 * @returns {Promise<Object>} Response object with success status and message
 */
export async function confirmAssistance(assistanceData) {
    try {
        const response = await fetch(ASSISTANCE_WEB_APP_URL_RAW, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(assistanceData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error confirming assistance:`, error);
        return { success: false, message: error.message };
    }
}

const LOGIN_API_URL = 'https://script.google.com/macros/s/AKfycbyWNeqQxfQRqW8V6gsQP7HtwKEXXduMIiv37e9cWVeJmh7eFVHwBkK5M-8QUfU-9vrtIg/exec';

export async function sendLoginRequest(email) {
    try {
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error sending login request:`, error);
        throw error;
    }
}

const EMAIL_VERIFICATION_API_URL = 'https://script.google.com/macros/s/AKfycbzNyEEuTQOJuSURBtpqz4TKDWJnO-RLCWSQZhq_GmTGr5xsbLY2cJ9Ru04Mz-CfvDpLzg/exec';

export async function sendEmailVerification(name, email, code) {
    try {
        const response = await fetch(EMAIL_VERIFICATION_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ nombre: name, correo: email, codigo: code }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error sending login request:`, error);
        throw error;
    }
}

const parseCSVLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
};

export function parseNewsCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const news = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = parseCSVLine(lines[i]);

        if (parts.length >= 7) {
            const title = parts[1] || '';
            if (!title) continue;

            news.push({
                id: parts[0] || '',
                title: title,
                date: parts[2] || '',
                category: parts[3] || '',
                image: parts[4] || '',
                summary: parts[5] || '',
                content: parts[6] || '',
            });
        }
    }
    return news;
}

export async function getNewsData(skipCache = false) {
    try {
        const response = await fetchWithRetry(NEWS_CSV_LINK, 3, skipCache, true);
        const data = await response.text();
        return parseNewsCSV(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

const ASSISTANCE_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=565419597&single=true&output=csv";

export function parseAssistanceCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 5 && parts[0].trim() && parts[1].trim()) {
            results.push({
                fecha_carrera: parts[0].trim(),
                email: parts[1].trim(),
                division: parts[2].trim(),
                codigo: parts[3].trim(),
                confirmado: parts[4].trim()
            });
        }
    }
    return results;
}

export async function getAssistanceData(skipCache = false) {
    try {
        const response = await fetchWithRetry(ASSISTANCE_CSV_LINK, 3, skipCache, true);
        const data = await response.text();
        return parseAssistanceCSV(data);
    } catch (error) {
        console.error("Error fetching assistance data:", error);
        return [];
    }
}

const PILOT_EMAIL_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP2AF0yixedvzkQcGkkLxnAP4fKl26f46dCFHdL6f11_QbeZP6NHLDshKqBkKtZdYLkyH8Rqrtedp5/pub?gid=1067641183&single=true&output=csv";

export function parsePilotEmailCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const map = {};
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 2 && parts[0].trim() && parts[1].trim()) {
            const email = parts[1].trim().toLowerCase();
            map[email] = parts[0].trim();
        }
    }
    return map;
}

export async function getPilotEmailMap(skipCache = false) {
    try {
        const response = await fetchWithRetry(PILOT_EMAIL_CSV_LINK, 3, skipCache, true);
        const data = await response.text();
        return parsePilotEmailCSV(data);
    } catch (error) {
        console.error("Error fetching pilot email map:", error);
        return {};
    }
}
