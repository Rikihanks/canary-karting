---
name: copy-production-database
description: >
  Usa esta skill cuando el agente necesite conectarse a un servidor Ubuntu remoto,
  descargar el archivo `database.sqlite` y reemplazar el archivo local del proyecto.
  Actívala siempre que el usuario mencione "bajar la base de datos del servidor",
  "sincronizar sqlite", "traer el database del servidor", "actualizar la db desde remoto",
  o cuando haya que reemplazar el sqlite local con el del servidor.
  Las credenciales se leen del archivo `.env` del proyecto.
---

# Skill: Sincronizar SQLite desde servidor remoto

## Flujo
**Importante informar al usuario de que estas haciendo en cada momento**
1. Leer credenciales del `.env`
2. Conectarse al servidor Ubuntu por SCP/SSH
3. Descargar `database.sqlite` desde la ruta remota
4. Hacer backup del archivo local actual
5. Reemplazar el archivo local con el descargado

---

## Variables esperadas en `.env`

```env
SSH_HOST=123.456.789.0
SSH_USER=ubuntu
SSH_PASSWORD=tu_password        # opcional si usas clave privada
SSH_KEY_PATH=C:/Users/tu/.ssh/id_rsa   # opcional si usas password
SSH_REMOTE_DB_PATH=/var/www/miapp/database.sqlite
LOCAL_DB_PATH=./database.sqlite  # ruta local donde dejar el archivo
```

Si `SSH_KEY_PATH` y `SSH_PASSWORD` están ambos definidos, se usa la clave privada primero.

---

## Paso 1: Leer el `.env`

Buscar `.env` en el directorio del proyecto. Si no se encuentra, pedirlo al usuario.

```bash
# Localizar .env
find . /home/claude -name ".env" -maxdepth 3 2>/dev/null | head -3
```

Parsear las variables necesarias:
```bash
set -a && source .env && set +a
echo "Host: $SSH_HOST | User: $SSH_USER | Remote: $SSH_REMOTE_DB_PATH"
```

En Windows/PowerShell:
```powershell
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
    }
}
```

---

## Paso 2: Elegir método de conexión

### Opción A — SCP (bash / WSL) ✅ recomendado

**Con clave privada:**
```bash
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no \
    "$SSH_USER@$SSH_HOST:$SSH_REMOTE_DB_PATH" \
    ./database_remote.sqlite
```

**Con password (requiere `sshpass`):**
```bash
# Instalar sshpass si no está: sudo apt install sshpass
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "$SSH_USER@$SSH_HOST:$SSH_REMOTE_DB_PATH" \
    ./database_remote.sqlite
```

### Opción B — PowerShell nativo (Windows, sin WSL)

Requiere tener OpenSSH instalado (viene por defecto en Windows 10/11):
```powershell
# Con clave privada
scp -i $env:SSH_KEY_PATH -o StrictHostKeyChecking=no `
    "$($env:SSH_USER)@$($env:SSH_HOST):$($env:SSH_REMOTE_DB_PATH)" `
    ".\database_remote.sqlite"
```

**Con password en PowerShell** (usando plink de PuTTY si está disponible):
```powershell
& plink -ssh "$($env:SSH_USER)@$($env:SSH_HOST)" `
    -pw $env:SSH_PASSWORD `
    "cat $($env:SSH_REMOTE_DB_PATH)" | `
    Set-Content -Encoding Byte ".\database_remote.sqlite"
```

### Opción C — Python `paramiko` (funciona en Windows y Linux sin herramientas externas)

```bash
pip install paramiko
```

```python
import paramiko, os, shutil
from dotenv import dotenv_values

cfg = dotenv_values(".env")

host      = cfg["SSH_HOST"]
user      = cfg["SSH_USER"]
remote    = cfg["SSH_REMOTE_DB_PATH"]
local_out = cfg.get("LOCAL_DB_PATH", "./database.sqlite")
key_path  = cfg.get("SSH_KEY_PATH")
password  = cfg.get("SSH_PASSWORD")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

if key_path:
    ssh.connect(host, username=user, key_filename=key_path)
else:
    ssh.connect(host, username=user, password=password)

sftp = ssh.open_sftp()

# Backup del archivo local actual
if os.path.exists(local_out):
    shutil.copy2(local_out, local_out + ".bak")
    print(f"[backup] {local_out}.bak creado")

sftp.get(remote, local_out)
print(f"[ok] {remote} → {local_out}")

sftp.close()
ssh.close()
```

**Instalar dependencias:**
```bash
pip install paramiko python-dotenv
```

---

## Paso 3: Reemplazar el archivo local

Si se descargó a un nombre temporal (`database_remote.sqlite`):

```bash
# Bash
mv database.sqlite database.sqlite.bak 2>/dev/null || true
mv database_remote.sqlite "$LOCAL_DB_PATH"
echo "[ok] database.sqlite reemplazado"
```

```powershell
# PowerShell
if (Test-Path "database.sqlite") { Move-Item "database.sqlite" "database.sqlite.bak" -Force }
Move-Item "database_remote.sqlite" $env:LOCAL_DB_PATH -Force
Write-Host "[ok] database.sqlite reemplazado"
```

---

## Paso 4: Verificar

```bash
sqlite3 "$LOCAL_DB_PATH" "SELECT COUNT(*) FROM results;" 2>/dev/null \
    && echo "[ok] archivo válido" \
    || echo "[warn] verificar manualmente"
```

Mostrar al usuario:
- Ruta local del archivo reemplazado
- Tamaño del archivo
- Confirmación de que es un SQLite válido

---

## Manejo de errores

| Error | Acción |
|---|---|
| `.env` no encontrado | Pedir al usuario la ruta o las credenciales manualmente |
| `Connection refused` | Verificar IP y que el puerto 22 esté abierto en el servidor |
| `Permission denied` | Revisar clave privada o contraseña; comprobar permisos del archivo remoto |
| `No such file` (remoto) | Confirmar `SSH_REMOTE_DB_PATH` con el usuario |
| `sshpass` no instalado | Usar Opción C (paramiko) como fallback |
| Archivo local en uso | Avisar al usuario para cerrar la aplicación antes de reemplazar |

---

## Notas

- El backup `.bak` se crea siempre antes de reemplazar; si algo falla se puede restaurar.
- **Nunca loguear** `SSH_PASSWORD` ni `SSH_KEY_PATH` en la salida.
- Si el agente corre en Claude.ai (sandbox), usar siempre la Opción C (paramiko) ya que SCP y PowerShell no están disponibles en ese entorno.
- Para conexiones frecuentes, recomendar al usuario configurar clave SSH sin passphrase para evitar gestionar passwords.


## Paso 5:
Para asegurarnos de que todo ha ido bien leerás la tabla results de la base de datos que has copiado y le enseñarás al usuario el ultimo registro de esa tabla. Preguntarás si lo ve correcto. Si la respuesta es si, te moverás a la skill "insert-sql-into-db". Si la respuesta es no pararás la ejecución con un mensaje aclarativo.