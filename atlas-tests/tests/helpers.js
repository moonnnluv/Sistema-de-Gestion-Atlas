// Utilidades compartidas por la bateria de pruebas de Atlas.
// Patron aplicado: "Test Helper / Object Mother" (datos de prueba centralizados)
// y "Recorder" (cada verificacion queda registrada como evidencia en JSON).
const fs = require("fs");
const path = require("path");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const BASE = process.env.ATLAS_URL || "http://localhost:4450";
const DB_URL =
  process.env.ATLAS_DB || "postgres://postgres:postgres@localhost:15432/atlas";
// Secreto publicado en el README/.env del repositorio (se usa en CP-19)
const SECRETO_PUBLICADO =
  process.env.JWT_SECRET ||
  "0d1d8132f0fde5beabb417b434ff10f1cae8635a461686b0f46ac9c2bbfbd0e8";

const api = () => request(BASE);
const pool = new Pool({ connectionString: DB_URL });
const unico = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const EVIDENCE = path.join(__dirname, "..", "evidence");
const RESULTS_FILE = path.join(EVIDENCE, "results.json");
const resultados = {};

/** Registra una verificacion de un caso de prueba. */
function registrar(id, descripcion, ok, observado) {
  if (!resultados[id]) resultados[id] = { id, subpruebas: [] };
  resultados[id].subpruebas.push({
    descripcion,
    resultado: ok ? "APROBADO" : "FALLIDO",
    observado: String(observado),
  });
  return ok;
}

function guardarResultados() {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(resultados, null, 2));
}

async function login(nombre_usuario, password) {
  const t0 = Date.now();
  const r = await api()
    .post("/autenticacion/login")
    .send({ nombre_usuario, password });
  return { token: r.body.token, status: r.status, ms: Date.now() - t0 };
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

function estadisticas(muestras) {
  const s = [...muestras].sort((a, b) => a - b);
  const pct = (p) => s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)];
  const prom = s.reduce((a, b) => a + b, 0) / s.length;
  return {
    n: s.length,
    promedio: Math.round(prom),
    p95: pct(95),
    p99: pct(99),
    max: s[s.length - 1],
  };
}

/** PDF minimo valido; se rellena con comentarios hasta alcanzar `bytes`. */
function pdfDePrueba(bytes = 600) {
  const base =
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n";
  const relleno = Buffer.alloc(Math.max(0, bytes - base.length - 12), "%");
  return Buffer.concat([Buffer.from(base), relleno, Buffer.from("\n%%EOF\n")]);
}

const { spawnSync } = require("child_process");

/** Busca un texto/regex en todos los archivos de una carpeta (multiplataforma, sin grep). */
function buscarEnArchivos(dir, regex, excluir = /node_modules|\.git|dist|atlas-tests/) {
  let total = 0;
  const visitar = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const ruta = path.join(d, e.name);
      if (excluir.test(ruta)) continue;
      if (e.isDirectory()) visitar(ruta);
      else if (/\.(js|jsx|json|yml|yaml|sh|md|env|sql)$|Dockerfile$/.test(e.name)) {
        const lineas = fs.readFileSync(ruta, "utf8").split(/\r?\n/);
        total += lineas.filter((l) => regex.test(l)).length;
      }
    }
  };
  visitar(dir);
  return total;
}

/** Ejecuta una herramienta de PostgreSQL (local o dentro del contenedor atlas-postgres). */
function pg(herramienta, args, entrada) {
  const docker = process.env.USE_DOCKER_PG === "1";
  const bin = process.env.PG_BIN || "";
  const cmd = docker ? "docker" : bin + herramienta;
  const base = docker ? ["exec", "-i", "atlas-postgres", herramienta] : ["-h", "localhost", "-p", "15432"];
  const res = spawnSync(cmd, [...base, ...(docker ? [] : []), "-U", "postgres", ...args], { input: entrada, maxBuffer: 1 << 28, encoding: "buffer" });
  if (res.status !== 0 && !/dropdb/.test(herramienta)) throw new Error(`${herramienta} fallo: ${res.stderr}`);
  return res.stdout;
}

module.exports = {
  buscarEnArchivos,
  pg,
  BASE,
  SECRETO_PUBLICADO,
  api,
  pool,
  unico,
  registrar,
  guardarResultados,
  resultados,
  login,
  auth,
  estadisticas,
  pdfDePrueba,
  jwt,
};
