import { config } from '../config.js';
import fetch from 'node-fetch';

export async function sendNotification(
    title: string,
    message: string,
    url?: string,
    playerIds?: string[]
): Promise<{ success: boolean; error?: string }> {
    if (!config.oneSignalAppId || !config.oneSignalApiKey) {
        console.warn('OneSignal not configured');
        return { success: false, error: 'OneSignal not configured' };
    }

    try {
        const res = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Key ${config.oneSignalApiKey}`,
            },
            body: JSON.stringify({
                app_id: config.oneSignalAppId,
                headings: { en: title, es: title },
                contents: { en: message, es: message },
                ...(playerIds && playerIds.length > 0
                    ? { include_player_ids: playerIds }
                    : { included_segments: ['17984fb4-d163-4b47-838b-21b22264b96a'] }),
                url: url || 'https://canarykarting.github.io/canary-karting-app/',
            }),
        });
        const data = await res.json() as Record<string, unknown>;
        console.log('OneSignal sent:', data);
        return { success: true };
    } catch (err) {
        console.error('OneSignal error:', err);
        return { success: false, error: (err as Error).message };
    }
}
