// Fisher-Yates shuffle
export function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function parseHistory(raw) {
    const map = new Map();
    const originals = new Map();
    if (!raw) return { map, originals };
    const lines = raw.split(/\r?\n/);
    lines.forEach((line) => {
        line = line.trim();
        if (!line) return;
        let name = "";
        let kartParts = [];
        if (line.includes(":")) {
            const parts = line.split(":");
            name = parts.shift().trim();
            kartParts = parts.join(":").split(",").map(s => s.trim()).filter(Boolean);
        } else {
            const parts = line.split(",").map(s => s.trim()).filter(Boolean);
            if (parts.length === 0) return;
            name = parts.shift();
            kartParts = parts;
        }
        if (name) {
            const normName = name.toLowerCase().trim();
            originals.set(normName, name);
            const normKarts = new Set(kartParts.map(k => k.trim().toLowerCase()).filter(Boolean));
            map.set(normName, normKarts);
        }
    });
    return { map, originals };
}

// Algoritmo de Kuhn para emparejamiento máximo bipartito
export function findPerfectMatching(nombres, karts, history) {
    const n = nombres.length;
    const m = karts.length;

    const kartOrder = shuffle(Array.from({ length: m }, (_, i) => i));
    const nameOrder = shuffle(Array.from({ length: n }, (_, i) => i));

    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
        const nameNorm = nombres[i].toLowerCase().trim();
        const prevSet = history.get(nameNorm);
        kartOrder.forEach(jIdx => {
            const kartNorm = karts[jIdx].trim().toLowerCase();
            if (!prevSet || !prevSet.has(kartNorm)) {
                adj[i].push(jIdx);
            }
        });
        adj[i] = shuffle(adj[i]);
    }

    for (let i = 0; i < n; i++) {
        if (adj[i].length === 0) return null;
    }

    const matchKart = new Array(m).fill(-1);

    function dfs(u, seen) {
        for (const v of adj[u]) {
            if (seen[v]) continue;
            seen[v] = true;
            if (matchKart[v] === -1 || dfs(matchKart[v], seen)) {
                matchKart[v] = u;
                return true;
            }
        }
        return false;
    }

    for (const u of nameOrder) {
        const seen = new Array(m).fill(false);
        if (!dfs(u, seen)) {
            return null;
        }
    }

    const result = {};
    for (let j = 0; j < m; j++) {
        const u = matchKart[j];
        if (u !== -1) {
            result[nombres[u]] = karts[j];
        }
    }
    return result;
}

export function crearListaAnimada(karts, realKart) {
    const totalItems = 50; // Más items para que la animación dure más suavemente
    const list = [];
    list.push("");
    for (let i = 0; i < totalItems - 2; i++) {
        // Añadir karts aleatorios decorativos
        const randomK = karts[Math.floor(Math.random() * karts.length)];
        list.push(randomK);
    }
    list.push(realKart);
    return list;
}
