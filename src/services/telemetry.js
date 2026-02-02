const TELEMETRY_EXEC = "https://script.google.com/macros/s/AKfycbz_We0Ar00LX9rvYVzz0Fb9qEtyKOOTAebrkYYOCKdTXz-ZMCLPKOMeX_8j_ZAaqXw/exec"; // PLACEHOLDER

export const logEvent = async (eventName, details = {}) => {
    return;
    try {
        const userEmail = localStorage.getItem('user') || 'anonymous';

        // Gather Public Browser Data
        const telemetryData = {
            timestamp: new Date().toISOString(),
            event: eventName,
            user: userEmail,
            data: JSON.stringify(details),
            // Browser Metrics
            os: getOS(),
            browser: getBrowser(),
            screen: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            displayMode: getDisplayMode(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent
        };

        console.log(`[Tel] ${eventName}`, telemetryData);

        // Send to Google Sheets (no-cors for GAS support)
        // We use text/plain to avoid preflight OPTIONS requests that GAS doesn't handle well
        fetch(TELEMETRY_EXEC, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(telemetryData),
        }).catch(err => console.warn('Telemetry delivery failed (muted):', err));

    } catch (error) {
        console.warn('Telemetry gathering failed:', error);
    }
};

function getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("X11") !== -1) return "UNIX";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    return "Unknown";
}

function getBrowser() {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

function getDisplayMode() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return 'standalone (pwa)';
    }
    if (window.navigator.standalone === true) {
        return 'standalone (ios)';
    }
    return 'browser';
}
