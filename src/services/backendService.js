const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://resistant-clinic-luxury-believes.trycloudflare.com'
    : 'https://resistant-clinic-luxury-believes.trycloudflare.com';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const USE_V3 = window.location.hostname.includes('rikihanks') || isLocalhost;

export async function getBackendData() {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    console.log("Calling v3");
    const response = await fetch(`${API_BASE_URL}/api/v3/data`);
    if (!response.ok) throw new Error('Error fetching from backend');
    return await response.json();
}

export async function saveResultToBackend(payload) {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const response = await fetch(`${API_BASE_URL}/api/v3/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Error saving to backend');
    return await response.json();
}

// --- Schema Management ---

export async function getTablesV3() {
    if (!USE_V3) return { success: false, tables: [] };
    const response = await fetch(`${API_BASE_URL}/api/v3/tables`);
    if (!response.ok) throw new Error('Error fetching tables');
    return await response.json();
}

export async function getTableSchemaV3(table) {
    if (!USE_V3) return { success: false, columns: [] };
    const response = await fetch(`${API_BASE_URL}/api/v3/schema/${table}`);
    if (!response.ok) throw new Error('Error fetching schema');
    return await response.json();
}

export async function modifySchemaV3(payload) {
    if (!USE_V3) return { success: false, error: 'V3 Disabled' };
    const response = await fetch(`${API_BASE_URL}/api/v3/schema/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Error modifying schema');
    return await response.json();
}
