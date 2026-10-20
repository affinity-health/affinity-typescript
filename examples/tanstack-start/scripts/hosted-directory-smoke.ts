import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { practices } from "../src/workflow.server";

const origin = process.env.AFFINITY_EXAMPLE_URL;
const password = process.env.AFFINITY_EXAMPLE_PASSWORD;
if (!origin || !password) throw new Error("Set the private Test demo URL and password.");
assert.equal((await fetch(origin)).status, 401);
const expected = await practices();
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ httpCredentials: { username: "demo", password } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  await page.getByRole("button", { name: "Load practices", exact: true }).click();
  await page
    .getByText(`Showing ${expected.data.length} practices on this page.`, { exact: true })
    .waitFor();
  for (const practice of expected.data) {
    const row = page.getByRole("listitem").filter({ hasText: practice.id });
    await row.getByText(practice.name, { exact: true }).waitFor();
  }
  const html = await page.content();
  for (const value of [password, process.env.AFFINITY_EXAMPLE_API_KEY])
    if (value) assert.ok(!html.includes(value), "A server secret reached page HTML");
  assert.deepEqual(errors, []);
  console.log("Private Test directory matches SDK; no secrets in HTML or API writes.");
  await context.close();
} finally {
  await browser.close();
}
