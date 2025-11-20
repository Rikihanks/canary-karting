const boton = document.getElementById("sortearBtn");
const copyHistBtn = document.getElementById("copyHistBtn");
const clearHistBtn = document.getElementById("clearHistBtn");

let lastAssignments = [];

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseHistory() {
  const raw = document.getElementById("historial").value.trim();
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
function findPerfectMatching(nombres, karts, history) {
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

function crearListaAnimada(karts, realKart) {
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

function sortear() {
  const nombres = document
    .getElementById("corredores")
    .value.trim()
    .split(/[\n,]+/)
    .map(n => n.trim())
    .filter(n => n);
  const karts = document
    .getElementById("karts")
    .value.trim()
    .split(",")
    .map(k => k.trim())
    .filter(k => k);
  const { map: history, originals } = parseHistory();
  const grid = document.getElementById("grid");
  
  // Limpiar grid
  grid.innerHTML = "";
  lastAssignments = [];

  if (nombres.length === 0 || karts.length === 0) {
    alert("⚠️ Debes introducir al menos un corredor y un kart.");
    return;
  }

  if (nombres.length > karts.length) {
    alert("⚠️ Hay más corredores que karts disponibles.");
    return;
  }

  let perfectMapping = findPerfectMatching(nombres, karts, history);

  if (!perfectMapping) {
    const cannotAvoidFor = [];
    nombres.forEach((nombre) => {
      const prevSet = history.get(nombre.toLowerCase().trim());
      if (prevSet && prevSet.size >= karts.length) {
        const displayName = originals.get(nombre.toLowerCase().trim()) || nombre;
        cannotAvoidFor.push(displayName);
      }
    });
    
    let confirmMsg = "No ha sido posible encontrar una asignación perfecta sin repeticiones.";
    if (cannotAvoidFor.length > 0) {
      confirmMsg = `No hay suficientes karts distintos para evitar repetir con: ${cannotAvoidFor.join(", ")}. ¿Deseas continuar permitiendo repeticiones?`;
    } else {
      confirmMsg += " ¿Continuar?";
    }
    
    if (!confirm(confirmMsg)) return;
  }

  let availableKarts = shuffle(karts.slice());

  // Tiempos de animación
  const fadeUpDelayPerItem = 100; 
  const kartLists = [];

  nombres.forEach((nombre, i) => {
    const card = document.createElement("div");
    card.className = "card fade-up";
    card.style.animationDelay = `${i * fadeUpDelayPerItem}ms`;

    const nombreEl = document.createElement("div");
    nombreEl.className = "nombre";
    nombreEl.textContent = nombre;

    const slot = document.createElement("div");
    slot.className = "kart-slot";

    const kartList = document.createElement("div");
    kartList.className = "kart-list";

    let kartAsignado = null;

    if (perfectMapping && Object.prototype.hasOwnProperty.call(perfectMapping, nombre)) {
      kartAsignado = perfectMapping[nombre];
      const idx = availableKarts.indexOf(kartAsignado);
      if (idx !== -1) availableKarts.splice(idx, 1);
    } else {
      // Greedy fallback
      const prevSet = history.get(nombre.toLowerCase().trim());
      if (availableKarts.length > 0) {
        for (let j = 0; j < availableKarts.length; j++) {
          const candidate = availableKarts[j];
          const candidateNorm = candidate.trim().toLowerCase();
          if (!prevSet || !prevSet.has(candidateNorm)) {
            kartAsignado = candidate;
            availableKarts.splice(j, 1);
            break;
          }
        }
        if (!kartAsignado) {
          kartAsignado = availableKarts.shift();
        }
      }
    }

    lastAssignments.push({ name: nombre, kart: kartAsignado });

    // Crear la tira de números para la animación
    const listaAnimada = crearListaAnimada(karts, kartAsignado);

    listaAnimada.forEach((kart) => {
      const item = document.createElement("div");
      item.textContent = kart; 
      kartList.appendChild(item);
    });

    slot.appendChild(kartList);
    card.appendChild(nombreEl);
    card.appendChild(slot);
    grid.appendChild(card);

    kartLists.push({ card, kartList, index: i });
  });

  // Scroll suave hacia resultados
  setTimeout(() => {
      const gridTop = document.getElementById("grid").offsetTop;
      window.scrollTo({ top: gridTop - 20, behavior: "smooth" });
  }, 100);

  // Disparar animación de "Tragaperras"
  const delayAfterFade = nombres.length * fadeUpDelayPerItem + 200;

  setTimeout(() => {
    kartLists.forEach(({ card, kartList }, idx) => {
      
      // Calcular la altura real del item basándonos en CSS
      const itemHeight = kartList.children[0]?.offsetHeight || 60;
      const itemsCount = kartList.children.length;
      const finalTop = -itemHeight * (itemsCount - 1);

      // Duración variable
      const duration = 2500 + (Math.random() * 1000); 

      kartList.animate(
        [
          { top: "0px", filter: "blur(0px)" },
          { top: `${finalTop * 0.8}px`, filter: "blur(2px)", offset: 0.6 },
          { top: `${finalTop}px`, filter: "blur(0px)" }
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.12, 0.8, 0.32, 1)",
          fill: "forwards"
        }
      ).onfinish = () => {
          card.classList.add("name-up");
      };
    });
  }, delayAfterFade);
}

copyHistBtn.addEventListener('click', () => {
  if (!lastAssignments || lastAssignments.length === 0) {
    alert('⚠️ No hay asignaciones recientes para copiar.');
    return;
  }
  const lines = lastAssignments.map(a => `${a.name}: ${a.kart}`);
  const currentHist = document.getElementById('historial').value;
  // Añadir al final si ya existe texto
  const separator = currentHist.trim() ? '\n' : '';
  document.getElementById('historial').value = currentHist.trim() + separator + lines.join('\n');
  
  const originalText = copyHistBtn.innerHTML;
  copyHistBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
  setTimeout(() => copyHistBtn.innerHTML = originalText, 2000);
});

clearHistBtn.addEventListener('click', () => {
  if (!document.getElementById('historial').value) return;
  if (confirm('¿Estás seguro de borrar todo el historial?')) {
    document.getElementById('historial').value = '';
  }
});

boton.addEventListener("click", () => {
  boton.disabled = true;
  boton.style.opacity = "0.7";
  boton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sorteando...';
  
  try {
    sortear();
  } finally {
    setTimeout(() => {
      boton.disabled = false;
      boton.style.opacity = "1";
      boton.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Sortear de nuevo';
    }, 3000);
  }
});
