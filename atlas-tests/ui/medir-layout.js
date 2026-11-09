const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const out = [];
  for (const [w, h] of [[1920, 1080], [1366, 768], [768, 1024], [375, 667]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto("http://127.0.0.1:3350/login", { waitUntil: "networkidle" });
    await p.fill('input[type="text"]', "admin"); await p.fill('input[type="password"]', "admin");
    await p.click('button[type="submit"]'); await p.waitForURL(/\/home/, { timeout: 30000 }); await p.waitForTimeout(5000);
    const m = await p.evaluate(() => {
      const nav = [...document.querySelectorAll("nav,aside,[class*=Drawer],[class*=drawer]")].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 100 && r.height > 300).sort((a, b) => b.height - a.height)[0];
      const main = document.querySelector("main") ? document.querySelector("main").getBoundingClientRect() : null;
      return { menuAncho: nav ? Math.round(nav.width) : null, mainAncho: main ? Math.round(main.width) : null, ventana: innerWidth };
    });
    out.push({ ancho: w, ...m, porcentajeMenu: m.menuAncho ? Math.round((100 * m.menuAncho) / w) : null });
    await p.close();
  }
  fs.writeFileSync(path.join(__dirname, "..", "evidence", "ui-layout.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out)); await b.close();
})();
