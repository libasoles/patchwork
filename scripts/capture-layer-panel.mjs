import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 3,
});

const findStack = `(() => {
  const h2 = [...document.querySelectorAll('h2')].find((h) => /Layers|Capas|Calques/.test(h.textContent || ''));
  return h2 ? h2.closest('div.fixed') : null;
})()`;

// Run an evaluate that returns a truthy "done" flag; retry through HMR reloads.
async function until(expr, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await page.evaluate(`(() => { try { return (${expr}); } catch (e) { return null; } })()`);
      if (r) return r;
    } catch (e) {
      if (!/context was destroyed|navigation/i.test(e.message)) throw e;
    }
    await page.waitForTimeout(500);
  }
  throw new Error("until() timed out: " + expr);
}

const PORT = process.env.PORT || "3000";
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "commit" });
await page.waitForTimeout(5000);

// Wait for mount.
await until(`!!${findStack}`);

// Expand (idempotent: only click if the Add Layer button isn't already shown).
await until(`(() => {
  const s = ${findStack};
  if (!s) return false;
  const expanded = [...s.querySelectorAll('button')].some((b) => /Add Layer|capa|calque/i.test(b.textContent || ''));
  if (!expanded) { s.querySelector('button').click(); return false; }
  return true;
})()`);

// Ensure exactly 3 layers (rows have a trailing layer name + number). Add until >=3.
await until(`(() => {
  const s = ${findStack};
  if (!s) return false;
  const count = s.querySelectorAll('span.flex-1').length;
  if (count >= 3) return true;
  const add = [...s.querySelectorAll('button')].find((b) => /Add Layer|Agregar|Anadir|Ajouter/i.test(b.textContent || ''));
  if (add) add.click();
  return false;
})()`);

await page.waitForTimeout(500);
const rect = await until(`(() => {
  const s = ${findStack};
  if (!s) return null;
  const r = s.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
})()`);
console.log("rect", JSON.stringify(rect));

const pad = 18;
await page.screenshot({
  path: "public/articles/layers-panel.png",
  clip: {
    x: rect.x,
    y: Math.max(0, rect.y - pad),
    width: rect.width + pad,
    height: rect.height + pad * 2,
  },
});

await browser.close();
console.log("captured");
