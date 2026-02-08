const GOOGLE_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlPsGq-SypD4WPitvnR7JcluA8_6-5ePtuzyf5zFGJ31eppN55iUIHsKo0oduOZ9AVyVTf6VkPvTyu/pub?output=csv";
const RESULTS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP2AF0yixedvzkQcGkkLxnAP4fKl26f46dCFHdL6f11_QbeZP6NHLDshKqBkKtZdYLkyH8Rqrtedp5/pub?output=csv";

// Flag to use mock data for development
const USE_MOCK_DATA = false;

const CALENDAR_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?output=csv";
const CLASI_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=25895170&single=true&output=csv";
const RESULT_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=1225782575&single=true&output=csv";

const CONFIG_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzmcWDtElCuePL4NN3FT5fyBVdLNovmMa0QcibtaeeFAqpVkdioNT14QaG81zbgjrnEtHRsLxKSi17/pub?output=csv";
const UPDATE_CONFIG_EXEC = "https://script.google.com/macros/s/AKfycbwPsWOaN1WkF7eq5SXDWASonFNJUBW69HmdDSs8EpOZlCAQ8d_ShIQtvGaUaV0-YhZUtA/exec";
const DRIVER_OF_THE_DAY_EXEC = "https://script.google.com/macros/s/AKfycbxa4ahCzg9IieNBR3y4OxPHnqeBwA10oU9XrEG9yYIWYbH82cw8Fmkes-ivheETAsFupg/exec";
const DOTD_RESULTS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLNZjbf5AjIxBl659WE4OZsK1RpOpu7HSwa55-b3Dbxxp2Rrggu5lDdjXLyhvZYXpB7uYE6LaEP_G2/pub?output=csv";
const NEWS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRguh21pKudFW_SOQW1wyjW-D95dzJ_Rn8LK-tHeaes0zKbRPVQbzRcKy_4xJ1l-tXRyTff4nfkbOLm/pub?output=csv";


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


export async function fetchWithRetry(url, maxRetries = 3, skipCache = false) {
    const now = new Date().getTime();

    // Check cache first
    if (!skipCache && cache.has(url)) {
        const { data, timestamp } = cache.get(url);
        if (now - timestamp < CACHE_DURATION) {
            console.log(`Serving from cache: ${url}`);
            return data.clone(); // Return a clone so the body can be read multiple times if needed
        } else {
            cache.delete(url);
        }
    }

    const timestamp = new Date().getTime();
    // Keep the timestamp for cache busting the ACTUAL network request, 
    // but we use the base URL as the key for OUR cache.
    const cacheBusterUrl = `${url}&_t=${timestamp}`;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(cacheBusterUrl);
            if (response.ok) {
                // Clone the response to store in cache and return
                const clonedResponse = response.clone();
                cache.set(url, {
                    data: clonedResponse,
                    timestamp: now
                });
                return response;
            }
        } catch (error) {
            if (i < maxRetries - 1) {
                console.log('trying again');

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
                activa: parts[3] ? parts[3].trim() : '0',
                terminada: parts[4] ? parts[4].trim() : '0',
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

        if (parts.length >= 7) {
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

export async function getLeaderboardData() {
    const response = await fetchWithRetry(SHEET_URL);
    const data = await response.text();
    return parseCSV(data);
}

export async function getDriverResults() {
    const response = await fetchWithRetry(RESULTS_URL);
    const data = await response.text();
    return parseResultsCSV(data);
}

export async function getCalendarData() {
    if (USE_MOCK_DATA) {
        const { mockCalendarData } = await import('./mockRaceData');
        return mockCalendarData;
    }
    const response = await fetchWithRetry(CALENDAR_CSV_LINK);
    const data = await response.text();
    return parseCalendarCSV(data);
}

export async function getDOTDResults() {
    const response = await fetchWithRetry(DOTD_RESULTS_URL);
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

export async function getTeamsData() {
    const response = await fetchWithRetry(TEAMS_URL);
    const data = await response.text();
    return parseTeamsCSV(data);
}

export async function getRaceDetails(id, date) {
    if (USE_MOCK_DATA) {
        console.log('Using mock race data');
        const { mockClasiData, mockResultData, mockCalendarData } = await import('./mockRaceData');
        const raceInfo = mockCalendarData.find(r => r.id_circuito === id && r.fecha === date);
        return {
            clasi: mockClasiData,
            results: mockResultData,
            raceInfo: raceInfo
        };
    }

    const [clasiData, resultData, calendarData] = await Promise.all([
        fetchWithRetry(CLASI_URL).then(r => r.text()),
        fetchWithRetry(RESULT_URL).then(r => r.text()),
        getCalendarData()
    ]);

    const raceInfo = calendarData.find(r => r.id_circuito === id && r.fecha === date);

    return {
        clasi: parseRaceDetailCSV(clasiData),
        results: parseRaceDetailCSV(resultData),
        raceInfo: raceInfo
    };
}

export function parseConfigCSV(csvText) {
    const lines = csvText.split('\n');
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
        const response = await fetchWithRetry(CONFIG_URL, 3, true); // Use fetchWithRetry if you want caching, or direct fetch if you want instant updates (maybe with lower cache duration)
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

export async function getNewsData() {
    try {
        const response = await fetchWithRetry(NEWS_CSV_LINK, 3, true);
        const data = await response.text();
        return parseNewsCSV(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}
