# Kit de pruebas Atlas (ISY1102, Encargo 2)

Pruebas automatizadas de integración, seguridad, carga e interfaz del Sistema de Gestión Atlas.

## Requisitos
- Node.js 18 o superior
- Docker Desktop (para levantar Atlas con `docker-compose up -d`)

## Pasos (PowerShell, desde esta carpeta)
1. En la carpeta del proyecto Atlas: `docker-compose down -v` y luego `docker-compose up -d` (estado inicial limpio).
2. Guardar el log de la API: `docker logs atlas-backend > server.log 2>&1` (se hace después de usar el sistema; para la primera corrida puede quedar vacío, repetir al terminar).
3. En esta carpeta: `npm install`
4. Variables de entorno:
   ```
   $env:ATLAS_URL="http://localhost:4450"
   $env:ATLAS_DB="postgres://postgres:postgres@localhost:15432/atlas"
   $env:ATLAS_REPO="C:\ruta\al\Sistema-de-Gestion-Atlas"
   $env:SERVER_LOG="C:\ruta\al\server.log"
   $env:USE_DOCKER_PG="1"
   ```
5. Batería de la API (CP-01 a CP-21, unos 2 minutos): `npm test`
6. Carga con 200 usuarios (CP-24): `node tests/carga.js`
7. Interfaz (CP-22): `cd ui`, `npm install`, `npx playwright install chromium`, `node ui-check.js`
   (el frontend debe estar en http://127.0.0.1:3350; con Docker usar `$env:FRONT_URL="http://localhost:3350"`).

Resultados: `evidence/results.json`, `evidence/carga.json` y `evidence/ui-results.json`.

## Notas
- Muchos casos FALLAN a propósito: el Atlas es intencionalmente vulnerable y cada fallo es un incidente a documentar.
- Cada corrida crea datos nuevos; para comparar resultados, reinicia la base con `docker-compose down -v`.
- `make_evidence.py` y `ui/render-evidence.js` generan capturas de terminal en Linux/macOS. En Windows conviene tomar capturas propias de `npm test` y de Postman o PowerShell.
