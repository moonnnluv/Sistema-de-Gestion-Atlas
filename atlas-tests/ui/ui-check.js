// Pruebas de interfaz (Playwright + axe-core) para Atlas.
// CP-22: responsividad en 4 resoluciones (NFR-COMPAT-2) y accesibilidad basica (NFR-USAB-1).
// Uso: node ui-check.js   (frontend en FRONT_URL, API en la URL con la que se construyo)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const FRONT = process.env.FRONT_URL || "http://127.0.0.1:3350";
const OUT = path.join(__dirname, "..", "evidence");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const VIEWPORTS = [
  { nombre: "desktop-1920x1080", width: 1920, height: 1080 },
  { nombre: "laptop-1366x768", width: 1366, height: 768 },
  { nombre: "tablet-768x1024", width: 768, height: 1024 },
  { nombre: "smartphone-375x667", width: 375, height: 667 },
];

async function medir(page) {
  return page.evaluate(() => {
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const textos = [...document.querySelectorAll("body *")].filter(
      (el) => vis(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    );
    const tamanos = textos.map((el) => parseFloat(getComputedStyle(el).fontSize));
    const chicos = textos.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30));
    const interactivos = [...document.querySelectorAll("a[href],button,input,select,textarea,[role=button]")].filter(vis);
    const peq24 = interactivos.filter((el) => { const r = el.getBoundingClientRect(); return r.width < 24 || r.height < 24; }).length;
    const peq44 = interactivos.filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).length;
    const sinNombre = [...document.querySelectorAll("input,select,textarea")].filter(vis).filter((el) => {
      const id = el.id;
      const lbl = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
      return !(lbl || el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.closest("label"));
    }).length;
    return {
      anchoDocumento: document.documentElement.scrollWidth,
      anchoVentana: window.innerWidth,
      desbordaHorizontal: document.documentElement.scrollWidth > window.innerWidth + 1,
      fuenteMinPx: tamanos.length ? Math.min(...tamanos) : null,
      textosMenores12px: chicos.length,
      ejemplosMenores12px: chicos.slice(0, 5),
      interactivos: interactivos.length,
      objetivosMenores24px: peq24,
      objetivosMenores44px: peq44,
      camposSinEtiqueta: sinNombre,
    };
  });
}

async function axe(page) {
  await page.evaluate(axeSource);
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] });
    return res.violations.map((v) => ({ id: v.id, impacto: v.impact, nodos: v.nodes.length, ayuda: v.help }));
  });
  return r;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const resultados = { viewports: [], teclado: null };
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(`${FRONT}/login`, { waitUntil: "networkidle" });
    const loginMed = await medir(page);
    const loginAxe = await axe(page);
    await page.screenshot({ path: path.join(OUT, `ui-login-${vp.nombre}.png`) });
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    const t0 = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/home/, { timeout: 30000 }).catch(() => {});
    const msLogin = Date.now() - t0;
    await page.waitForTimeout(6000); // el dashboard consulta endpoints con latencia
    const homeMed = await medir(page);
    const homeAxe = await axe(page);
    await page.screenshot({ path: path.join(OUT, `ui-home-${vp.nombre}.png`), fullPage: false });
    resultados.viewports.push({ ...vp, msLoginYRedireccion: msLogin, urlFinal: page.url(), login: loginMed, loginAxe, home: homeMed, homeAxe });
    await ctx.close();
  }
  // Navegacion por teclado en la pagina de login (1366x768)
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  await page.goto(`${FRONT}/login`, { waitUntil: "networkidle" });
  const pasos = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    pasos.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        const s = getComputedStyle(el);
        return {
          etiqueta: el.tagName.toLowerCase(),
          tipo: el.getAttribute("type"),
          texto: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 30),
          indicadorFoco: (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none",
        };
      })
    );
  }
  await page.screenshot({ path: path.join(OUT, "ui-teclado-login.png") });
  resultados.teclado = pasos;
  // Carga de la pagina principal (aprox. NFR-PERF-2) con red movil emulada (CDP)
  const ctx2 = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const p2 = await ctx2.newPage();
  const cdp = await ctx2.newCDPSession(p2);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  const t1 = Date.now();
  await p2.goto(`${FRONT}/login`, { waitUntil: "load" });
  resultados.cargaLogin3G_ms = Date.now() - t1;
  await browser.close();
  fs.writeFileSync(path.join(OUT, "ui-results.json"), JSON.stringify(resultados, null, 2));
  console.log(JSON.stringify(resultados, null, 2));
})();
