// Convierte los textos de evidencia (salida real de comandos) en capturas PNG legibles.
const fs = require("fs"); const path = require("path"); const { chromium } = require("playwright");
const dir = path.join(__dirname, "..", "evidence");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const p = await b.newPage({ viewport: { width: 1280, height: 400 }, deviceScaleFactor: 2 });
  for (const f of fs.readdirSync(path.join(dir, "txt")).filter((x) => x.endsWith(".txt"))) {
    const txt = fs.readFileSync(path.join(dir, "txt", f), "utf8");
    const html = `<body style="margin:0;background:#0c0c0c"><div style="padding:6px 14px;background:#1f1f1f;color:#ddd;font:13px Arial">Terminal - Atlas (entorno de pruebas)</div>
    <pre style="margin:0;padding:16px;color:#e6e6e6;font:14px/1.45 'DejaVu Sans Mono',monospace;white-space:pre-wrap;word-break:break-all;width:1250px">${esc(txt)
      .replace(/^(\$ .*)$/gm, '<span style="color:#7ee787">$1</span>')
      .replace(/\[FALLA\]/g, '<span style="color:#ff7b72">[FALLA]</span>').replace(/\[OK\]/g, '<span style="color:#7ee787">[OK]</span>')
      .replace(/✕/g, '<span style="color:#ff7b72">✕</span>').replace(/✓/g, '<span style="color:#7ee787">✓</span>')}</pre></body>`;
    await p.setContent(html);
    await p.screenshot({ path: path.join(dir, f.replace(".txt", ".png")), fullPage: true });
  }
  await b.close();
})();
