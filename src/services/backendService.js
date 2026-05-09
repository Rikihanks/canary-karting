// Removed hardcoded URL to use Excel config dynamically
let cachedBaseUrl = null;

// Backend connection error event system
const _backendErrorListeners = new Set();

export function onBackendUnreachable(listener) {
    _backendErrorListeners.add(listener);
    return () => _backendErrorListeners.delete(listener);
}

export function offBackendUnreachable(listener) {
    _backendErrorListeners.delete(listener);
}

function _notifyBackendError(error) {
    _backendErrorListeners.forEach(cb => { try { cb(error); } catch (e) { } });
}

async function _v3Fetch(url, options) {
    let res;
    try {
        res = await fetch(url, options);
    } catch (err) {
        _notifyBackendError(err);
        throw err;
    }
    if (!res.ok) {
        const err = new Error(`Backend returned ${res.status}`);
        err.status = res.status;
        _notifyBackendError(err);
        throw err;
    }
    return res;
}


async function getApiBaseUrl() {
    /*if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3001';
    }*/
    if (cachedBaseUrl) return cachedBaseUrl;

    try {
        const { getConfigData } = await import('./data');
        const config = await getConfigData();
        console.log(config);

        // Fallback to the known working URL if not found in Excel
        cachedBaseUrl = config.backend_url || 'https://disk-drama-inherited-experimental.trycloudflare.com';
        return cachedBaseUrl;
    } catch (e) {
        console.error("Error fetching backend_url from config, using fallback", e);
        return 'https://disk-drama-inherited-experimental.trycloudflare.com';
    }
}


const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const USE_V3 = window.location.hostname === 'localhost' || window.location.hostname.includes('rikihanks') || window.location.hostname.includes('canarykarting');

export async function getBackendData() {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/data`);

    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'Error fetching from backend');
    }
    return data;
}

export async function saveResultToBackend(payload) {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/results`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'Error saving result');
    }
    return data;
}

// --- Schema Management ---

export async function getTablesV3() {
    if (!USE_V3) return { success: false, tables: [] };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/tables`);

    return await response.json();
}

export async function getTableSchemaV3(table) {
    if (!USE_V3) return { success: false, columns: [] };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/schema/${table}`);

    return await response.json();
}

export async function modifySchemaV3(payload) {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/schema/modify`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'Error modifying schema');
    }
    return data;
}

export async function saveItemV3(table, payload) {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const baseUrl = await getApiBaseUrl();
    const response = await _v3Fetch(`${baseUrl}/api/v3/manage/${table}`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || data.message || 'Error saving item');
    }
    return data;
}
