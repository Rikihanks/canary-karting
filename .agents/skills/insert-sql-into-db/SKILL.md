---
name: insert-sql-into-db
description: >
  Usa esta skill cuando el agente necesite trabajar con una base de datos SQLite:
  leer el último ID de la tabla `results`, y luego ejecutar sentencias SQL de inserción
  usando IDs consecutivos (last_id + 1, last_id + 2, …). Actívala siempre que el usuario
  mencione "insertar en SQLite", "ejecutar SQLs", "añadir resultados a la base de datos",
  "last ID", o cuando el contexto ya contenga sentencias SQL listas para insertar.
---

# Skill: SQLite Insert con IDs consecutivos

## Cuándo se usa
- **Importante informar al usuario de que estas haciendo en cada momento**
- El agente tiene un conjunto de sentencias SQL (como string o lista en el contexto)
- Existe un archivo `.db` o `.sqlite` en el workspace o uploads
- Hay que insertar filas en la tabla `results` con IDs secuenciales a partir del último existente

---

## Pasos obligatorios

### 1. Localizar el archivo SQLite

Buscar en este orden:
```
/mnt/user-data/uploads/
/home/claude/
./
```

Comando para encontrarlo:
```bash
find /mnt/user-data/uploads /home/claude -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null | head -5
```

Si hay más de uno, preguntar al usuario cuál usar antes de continuar.

---

### 2. Leer el último ID de la tabla `results`

```bash
sqlite3 <ruta_al_archivo> "SELECT COALESCE(MAX(id), 0) FROM results;"
```

- Si la tabla está vacía, `COALESCE` devuelve `0`, por lo que el primer ID nuevo será `1`.
- Guardar el valor como `last_id`.

**Verificar que la tabla existe:**
```bash
sqlite3 <ruta_al_archivo> ".tables"
```

Si `results` no existe, detener y avisar al usuario con el listado de tablas disponibles.

---

### 3. Preparar los SQLs con IDs consecutivos

Los SQLs vienen como variable/string en el contexto. Pueden tener dos formas:

**Forma A — placeholder `{id}`:**
```sql
INSERT INTO results (id, col1, col2) VALUES ({id}, 'valor1', 'valor2');
```
Sustituir `{id}` por `last_id + N` para cada sentencia (N = 1, 2, 3…).

**Forma B — sin ID (columna auto-asignada):**
No hace falta modificar nada; el ID consecutivo se gestiona en el siguiente paso
insertando fila a fila y comprobando el resultado.

**Forma C — ID hardcodeado en el SQL:**
Reemplazar el valor de ID existente por `last_id + N`.

Usar Python o bash para hacer la sustitución de forma segura:
```bash
python3 - <<'EOF'
import sqlite3, re

db_path = "<ruta_al_archivo>"
sqls = [
    # Pegar aquí las sentencias del contexto, una por elemento de la lista
    "INSERT INTO results (id, name) VALUES ({id}, 'foo')",
    "INSERT INTO results (id, name) VALUES ({id}, 'bar')",
]

con = sqlite3.connect(db_path)
cur = con.cursor()
cur.execute("SELECT COALESCE(MAX(id), 0) FROM results")
last_id = cur.fetchone()[0]

for i, sql in enumerate(sqls, start=1):
    new_id = last_id + i
    final_sql = sql.replace("{id}", str(new_id))
    cur.execute(final_sql)
    print(f"[OK] id={new_id}: {final_sql}")

con.commit()
con.close()
print(f"\nInsertadas {len(sqls)} filas. Último ID usado: {last_id + len(sqls)}")
EOF
```
Si esto te falla para insertar puedes usar el archivo de python insert_results.py modificalo como necesites
---

### 4. Verificar la inserción

```bash
sqlite3 <ruta_al_archivo> "SELECT * FROM results ORDER BY id DESC LIMIT 10;"
```

**Debes mostrar las filas insertadas al usuario como confirmación.**

---

### 5. Finalización
**BAJO NINGUNA CIRCUNSTANCIA subirás el archivo database.sqlite modificado al servidor de nuevo.**
Repito. Tienes totalmente prohibido acceso de escritura al servidor en esta skill. Solo puedes modificarlo en local. NUNCA SUBIRLO AL SERVIDOR REMOTO.
Deja esto claro al usuario para evitar sustos innecesarios.


## Manejo de errores frecuentes

| Error | Acción |
|---|---|
| `no such table: results` | Listar tablas con `.tables` y preguntar al usuario |
| `UNIQUE constraint failed: results.id` | El ID ya existe; releer `MAX(id)` y reintentar |
| `no such column: id` | Inspeccionar esquema con `.schema results` y adaptar la query |
| Archivo no encontrado | Pedir al usuario que confirme la ruta o lo suba |

Inspeccionar el esquema si hay dudas:
```bash
sqlite3 <ruta_al_archivo> ".schema results"
```

---