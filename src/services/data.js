const GOOGLE_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlPsGq-SypD4WPitvnR7JcluA8_6-5ePtuzyf5zFGJ31eppN55iUIHsKo0oduOZ9AVyVTf6VkPvTyu/pub?output=csv";
const RESULTS_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP2AF0yixedvzkQcGkkLxnAP4fKl26f46dCFHdL6f11_QbeZP6NHLDshKqBkKtZdYLkyH8Rqrtedp5/pub?output=csv";
const CALENDAR_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?output=csv";
const CLASI_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=25895170&single=true&output=csv";
const RESULT_CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq8sBXfzKkBmGEUxaqB57exxTbF_0yYsHVaRsQ2F7HzCXoMVK8zW8630R4vtSvRn590pj-N65vFQek/pub?gid=1225782575&single=true&output=csv";

const SHEET_URL = `https://corsproxy.io/?url=${encodeURIComponent(GOOGLE_CSV_LINK)}`;
const RESULTS_URL = `https://corsproxy.io/?url=${encodeURIComponent(RESULTS_CSV_LINK)}`;
const CALENDAR_URL = `https://corsproxy.io/?url=${encodeURIComponent(CALENDAR_CSV_LINK)}`;
const CLASI_URL = `https://corsproxy.io/?url=${encodeURIComponent(CLASI_CSV_LINK)}`;
const RESULT_URL = `https://corsproxy.io/?url=${encodeURIComponent(RESULT_CSV_LINK)}`;

export async function fetchWithRetry(url, maxRetries = 3) {
    const timestamp = new Date().getTime();
    const cacheBusterUrl = `${url}&_t=${timestamp}`;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(cacheBusterUrl);
            if (response.ok) return response;
        } catch (error) {
            if (i < maxRetries - 1) {
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

        if (parts.length >= 8) {
            drivers.push({
                name: parts[0].trim(),
                team: parts[1].trim(),
                points: parseInt(parts[2].trim()) || 0,
                photo: parts[3] ? parts[3].trim() : "https://www.w3schools.com/howto/img_avatar.png",
                podiums: parseInt(parts[4].trim()) || 0,
                poles: parseInt(parts[5].trim()) || 0,
                wins: parseInt(parts[6].trim()) || 0,
                division: parseInt(parts[7].trim()) || 0,
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

        if (parts.length >= 9) {
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

        if (parts.length >= 3) {
            events.push({
                id_circuito: parts[0] ? parts[0].trim() : '',
                nombre: parts[1] ? parts[1].trim() : 'Carrera sin nombre',
                fecha: parts[2] ? parts[2].trim() : '',
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

        if (parts.length >= 4) {
            results.push({
                piloto: parts[0] ? parts[0].trim() : 'Desconocido',
                posicion: parseInt(parts[1].trim()) || 99,
                id_circuito: parts[2] ? parts[2].trim() : '',
                fecha: parts[3] ? parts[3].trim() : '',
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
    const response = await fetchWithRetry(CALENDAR_URL);
    const data = await response.text();
    return parseCalendarCSV(data);
}

export async function getRaceDetails() {
    const [clasiData, resultData] = await Promise.all([
        fetchWithRetry(CLASI_URL).then(r => r.text()),
        fetchWithRetry(RESULT_URL).then(r => r.text())
    ]);
    return {
        clasi: parseRaceDetailCSV(clasiData),
        results: parseRaceDetailCSV(resultData)
    };
}
