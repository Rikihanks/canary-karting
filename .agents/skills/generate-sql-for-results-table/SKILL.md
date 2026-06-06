---
name: generate-sql-for-results-table
description: >
  Usa esta skill cada vez que el usuario pida generar las queries SQL para insertar
  los resultados de una carrera en la tabla results. Se activa cuando el usuario
  menciona "generar SQL", "insertar resultados", "queries de la carrera", o cuando
  adjunta imágenes de resultados de karting.
---

# generate-sql-for-results-table

## Reglas inamovibles generales ANTES de empezar
- **No repitas verificaciones.** Cada dato se extrae una vez. Si ya lo tienes, no lo recompruebes.
- **No escribas "pero espera" ni "voy a verificar de nuevo".** Una vez extraído un valor, es definitivo salvo corrección explícita del usuario.
- **Avanza siempre al siguiente paso** en cuanto el paso actual esté completo.
- **Si hay ambigüedad**, haz UNA sola pregunta al usuario y espera respuesta. No intentes resolver la ambigüedad por tu cuenta.
- **Seguir las skills exactamente como están escritas, sin interpretar ni optimizar. Las skills son instrucciones, no sugerencias.** 
- No necesitas "mejorar" el flujo ni tomar atajos. Si hay ambigüedad, debo preguntar, no asumir.
- **Importante informar al usuario de que estas haciendo en cada momento**

---

## PASO 1 — Extraer datos de las imágenes

Se reciben **tres imágenes**:
- **Qualy**: título contiene "ENT-LIBRES" o similar
- **Carrera**: título contiene "FINAL" o similar
- **Sorteo de karts**: una imagen en la que se mapan los nombres de los pilotos a los kart asociados. La fuente de datos irrefutable para la asignacion de los karts no son las hojas de tiempo, es la imagen del sorteo que te doy, tomala como fuente de la verdad y no te fies de los numeros de los karts que salen en las hojas de tiempo pues esos son los numeros de los transponders, que no siempre coinciden con el kart.

Para las imagen de qualy y carrera:
Ambas tienen la fecha. Extráela una vez en formato `DD/MM/YYYY`.

De cada imagen, leer **una sola vez**:
- Posición de cada piloto (columna = piloto)
- Nombre abreviado
- Número de kart
- Tiempos por vuelta (fila por vuelta)
- La vuelta más rápida aparece en color más oscuro

**Circuito:** si el nombre contiene "carretera la esperanza" → `id_circuito = 1`, en cualquier otro caso → `id_circuito = 2`

Para la imagen del sorteo, leer el nombre del piloto y su número de kart.

✅ Cuando tengas todos los datos en memoria, pasa al PASO 2. No vuelvas a leer las imágenes.

---

## PASO 2 — Calcular los valores por piloto

Calcula estos valores **una sola vez por piloto**, en orden:

### pos_clasificacion
Extraer de los números escritos a mano al pie de las columnas en la hoja de Qualy.
Si no existen, derivar del orden de las columnas (1er lugar = 1, 2º lugar = 2…).

### pos_final
Extraer del orden de columnas en la hoja de Carrera (1er lugar = 1, 2º lugar = 2…).

### tiempo_qualy
Vuelta más rápida del piloto en Qualy, **contando solo las vueltas que TODOS los pilotos hayan completado**.
- Determina el mínimo número de vueltas completadas por todos → ese es el límite.
- Busca el mínimo tiempo dentro de ese rango para cada piloto.
- Este valor se calcula una sola vez. No se recalcula.

### tiempo_vuelta
Vuelta más rápida del piloto en la Carrera (celda de color más oscuro en su columna).

### es_vuelta_rapida
`1` para el único piloto con el tiempo absoluto más rápido de toda la carrera. `0` para todos los demás.
Confirmar con las notas manuscritas de la hoja de carrera si existen ("vta rapida [Piloto] [Tiempo]").

✅ Cuando tengas todos los valores calculados, pasa al PASO 3. No recalcules nada.

---

## PASO 3 — Mapear nombres de pilotos

Usar esta tabla. **Una sola pasada**, sin iterar:

| Abreviatura | Nombre completo |
|---|---|
| JOSEP | Josep Borras |
| WALTER | Walter Prieto |
| SERGIO | Sergio García |
| VINCENZ / VINCENZO | Vincenzo Marinov |
| ADAN | Adán Díaz |
| ENRIQU / ENRIQUE | Enrique García |
| LUIS | Luis Hidalgo |
| WILL | Will Reverón |
| ALEJANDR | Alejandro Sacramento |
| DANIEL | Daniel Ramos |
| CHRISTIAN | Christian del Castillo |
| ANTONIO | Antonio Chaparro |
| ALFREDO | Alfredo Diaz |
| ROBERTO | Roberto Serra |
| JAVIER | Javier Darias |
| FRAN | Fran López |
| RICARDO | Ricardo García |
| NAHUEL | Nahuel Falabella |
| TOMAS | Tomas Serpa |
| EDUARDO | Eduardo Dominguez |
| MIGUEL | Miguel Mesa |
| JORGE | Jorge Maury-Verdugo |
| PABLO | Pablo Yanes |
| MATIAS | Matias Santana |
| ADRIAN | Adrian Fernández |
| SANTIAGO | Santiago Orozco |
| MATEO | Mateo Pérez |
| RAYCO | Rayco Hernández |

**Reglas de mapeo:**
- Si el nombre abreviado no está en la tabla → usar `UNDETERMINED`
- Si hay un piloto **CARLOS** → **parar aquí** y preguntar al usuario: *"¿Cuál es el nombre completo del piloto Carlos?"* Esperar respuesta antes de continuar.
- Si la misma abreviatura puede corresponder a más de un piloto → usar `UNDETERMINED`

✅ Cuando todos los nombres estén mapeados (o marcados como UNDETERMINED), pasa al PASO 4.

---

## PASO 4 — Preguntas al usuario (UNA SOLA VEZ)

Hacer estas tres preguntas juntas en un solo mensaje:

> 1. ¿Hay alguna sustitución en esta carrera? (si sí, indica el piloto sustituto y el piloto sustituido)
> 2. ¿Para qué división es esta carrera?
> 3. ¿En qué condición se corrió esta carrera? Mojado / Saco

Esperar respuesta. Con esa respuesta:
- `replaces`: debe ser null si no hay sustitución. Si hay sustitución, el campo `replaces` del sustituto lleva el nombre del piloto sustituido.
- `division`: el valor que indique el usuario. **No puede ser NULL.**

✅ Con las respuestas, pasa al PASO 5. No vuelvas a preguntar.

---

## PASO 5 — Generar las queries SQL

**Valores fijos para todas las queries:**
```
investigating = 0
sancion       = 0
amonestacion  = 0
temporada     = 2026
```

**IDs:** usar `last_id + 1`, `last_id + 2`… Si no se conoce el `last_id`, usar placeholders `{ID_1}`, `{ID_2}`

**Formato exacto** (salto de línea tras VALUES):
```sql
INSERT INTO "main"."results" ("id", "pilot", "id_circuito", "date", "division", "pos_clasificacion", "pos_final", "tiempo_vuelta", "es_vuelta_rapida", "condicion", "investigating", "replaces", "tiempo_qualy", "temporada", "sancion", "amonestacion", "kart")
VALUES ({id}, '{pilot}', {id_circuito}, '{date}', {division}, {pos_clasificacion}, {pos_final}, '{tiempo_vuelta}', {es_vuelta_rapida}, 'mojado', 0, {replaces}, '{tiempo_qualy}', 2026, 0, 0, '{numero_de_kart}');
```

- `replaces`: escribir `NULL` (sin comillas) si no hay sustitución, o `'{nombre}'` si la hay.
- Tiempos en formato `SS.mmm` (ej: `43.507`).

Generar **una query por piloto**, sin comentarios intermedios, sin re-verificaciones.

✅ Cuando todas las queries estén generadas, pasa al PASO 6.

---

## PASO 6 — Presentar al usuario para revisión

Mostrar dos cosas en el mismo mensaje:

1. **Las queries SQL** en bloque de código
2. **Una tabla resumen** con este formato:

| # | Piloto | Pos Qualy | Pos Final | T. Qualy | T. Vuelta | Vuelta Rápida | División | Sustitución | Kart |
|---|---|---|---|---|---|---|---|---|
| 1 | Josep Borras | 1 | 1 | 45.519 | 43.507 | ✅ | 1 | — | 34 |
| … | … | … | … | … | … | … | … | … |

Terminar con:
> *"Por favor revisa los datos. Si todo es correcto, confirma y continuaré con la skill `copy-production-database`. Si hay algo incorrecto, indícame qué cambiar."*

---

## PASO 7 — Tras confirmación del usuario

- Si el usuario confirma que todo es correcto → continuar con la skill **`copy-production-database`**
- Si el usuario indica correcciones → aplicar **únicamente los cambios indicados**, regenerar solo las queries afectadas, y volver a mostrar la tabla completa actualizada. Luego esperar confirmación final antes de continuar.