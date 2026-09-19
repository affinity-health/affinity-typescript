import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { practices } from "../src/workflow.server";

const origin = "https://affinity-sdk-emr-example.harborrun.workers.dev";
const password = process.env.AFFINITY_EXAMPLE_PASSWORD;
if (!password) throw new Error("Run with the demo's Doppler config.");
assert.equal((await fetch(origin)).status, 401);
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ httpCredentials: { username: "demo", password } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  for (const mode of ["test", "live"] as const) {
    const expected = await practices(undefined, mode);
    await page
      .getByRole("button", {
        name: mode === "test" ? "Test practices" : "Live practices",
        exact: true,
      })
      .click();
    await page
      .getByText(`Showing ${expected.data.length} practices on this page.`, { exact: true })
      .waitFor();
    for (const practice of expected.data) {
      const row = page.getByRole("listitem").filter({ hasText: practice.id });
      await row.getByText(practice.name, { exact: true }).waitFor();
      assert.ok(
        (await row.innerText()).includes(
          practice.liveEnabled ? "Live enabled" : "Live not enabled",
        ),
      );
      if (mode === "live")
        assert.equal(await row.getByRole("button", { name: "Read only" }).isDisabled(), true);
    }
    console.log(
      `Hosted ${mode} directory matches SDK: ${expected.data.length} practices, hasMore=${expected.hasMore}.`,
    );
  }
  await page.getByRole("button", { name: "Test practices", exact: true }).click();
  await page.getByRole("button", { name: "Use practice" }).first().click();
  assert.equal(
    await page.getByRole("button", { name: "Create synthetic patient" }).isEnabled(),
    true,
  );
  for (const [width, height] of [
    [1440, 800],
    [1280, 720],
    [1920, 1080],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
  }
  const html = await page.content();
  for (const value of [
    password,
    process.env.AFFINITY_EXAMPLE_API_KEY,
    process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY,
  ]) {
    if (value) assert.ok(!html.includes(value), "A server secret reached page HTML");
  }
  assert.deepEqual(errors, []);
  console.log(
    "Hosted selection, read-only Live rows, responsive layout, and secret isolation passed. No patient/order writes performed.",
  );
  await context.close();
} finally {
  await browser.close();
}
