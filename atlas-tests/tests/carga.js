// CP-24 Prueba de carga: 200 usuarios virtuales simultaneos (NFR-PERF-3).
// Uso: node tests/carga.js   (ATLAS_URL opcional). Sin dependencias externas (fetch nativo de Node 18+).
const fs = require("fs"); const path = require("path");
const BASE = process.env.ATLAS_URL || "http://localhost:4450";
const USUARIOS = Number(process.env.VUS || 200), SEGUNDOS = Number(process.env.SEG || 20);
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)] : 0; };
async function fase(nombre, ruta, token) {
  const tiempos = []; let errores = 0, total = 0; const fin = Date.now() + SEGUNDOS * 1000;
  const vu = async () => {
    while (Date.now() < fin) {
      const t = Date.now();
      try { const r = await fetch(BASE + ruta, { headers: { Authorization: `Bearer ${token}` } }); await r.arrayBuffer(); if (r.status !== 200) errores++; }
      catch { errores++; }
      tiempos.push(Date.now() - t); total++;
    }
  };
  await Promise.all(Array.from({ length: USUARIOS }, vu));
  const prom = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length);
  return { fase: nombre, ruta, usuarios: USUARIOS, segundos: SEGUNDOS, solicitudes: total, errores, tasaError: +(100 * errores / total).toFixed(2), promedioMs: prom, p95Ms: pct(tiempos, 95), p99Ms: pct(tiempos, 99), maxMs: Math.max(...tiempos), rps: +(total / SEGUNDOS).toFixed(1) };
}
(async () => {
  const lg = await (await fetch(BASE + "/autenticacion/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre_usuario: "admin", password: "admin" }) })).json();
  const res = [await fase("Lectura simple (GET cliente por id)", "/clientes/1", lg.token), await fase("Listado de clientes (GET /clientes)", "/clientes", lg.token)];
  fs.writeFileSync(path.join(__dirname, "..", "evidence", "carga.json"), JSON.stringify(res, null, 2));
  console.log(JSON.stringify(res, null, 2));
})();
