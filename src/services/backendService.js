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
