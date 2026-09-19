import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Isolated, unaffiliated browser context. No real API credential is loaded.
delete process.env.AFFINITY_EXAMPLE_API_KEY;
delete process.env.AFFINITY_EXAMPLE_PRACTICE_ID;
const password = crypto.randomUUID() + crypto.randomUUID();
process.env.AFFINITY_EXAMPLE_PASSWORD = password;
const app = (await import(pathToFileURL(resolve("dist/server/server.js")).href)).default;
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (/^\/assets\/[a-zA-Z0-9_.-]+$/.test(path)) {
      const file = Bun.file(resolve(`dist/client${path}`));
      if (await file.exists()) return new Response(file);
    }
    return app.fetch(request);
  },
});
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ httpCredentials: { username: "demo", password } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [width, height] of [
    [1440, 800],
    [1280, 720],
    [1920, 1080],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(server.url.href);
    await page.getByRole("heading", { name: "From your EMR to an order." }).waitFor();
    await page.getByRole("button", { name: "Create synthetic patient" }).click();
    const alert = page.getByRole("alert");
    await alert.waitFor();
    assert.match(await alert.innerText(), /Set AFFINITY_EXAMPLE_API_KEY/);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    console.log(
      `Browser ${width}x${height}: hydrated, missing-key action fails closed, no page overflow.`,
    );
  }
  assert.deepEqual(errors, []);
  await context.close();
} finally {
  await browser.close();
  server.stop(true);
}
