// Verifies the newest account-free carrier handoff, exact QR, and stamp corrections.
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("the folded envelope always advances to carrier choice", async ({ page }) => {
  await page.goto("/?screen=envelope");

  const travel = page.getByRole("button", { name: "choose how it travels" });
  await expect(travel).toBeVisible({ timeout: 3_000 });
  await expect(page.locator(".envelope-stamp-choice")).not.toContainText("0");
  await travel.click();

  await expect(page.getByText("pick how it arrives.")).toBeVisible();
  await expect(page.getByRole("button", { name: "see it ready to give" })).toBeVisible();
});

test("each draft gets an exact downloadable QR with no demo substitution", async ({ page, context }) => {
  await page.goto("/?screen=handoff");

  const firstLink = await page.locator(".private-link span").innerText();
  const firstQrPath = await page.locator(".handoff-qr svg path").nth(1).getAttribute("d");
  expect(firstLink).toContain("/for/");
  expect(firstLink).not.toContain("/demo");
  await expect(page.getByText(/demo QR/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Open receiver QR for this keepsake" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "save this QR" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^warm-and-fuzzies-.*-qr\.svg$/);
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const svg = await readFile(downloadPath!, "utf8");
  expect(svg).toContain("<title>Scan to open this keepsake</title>");
  expect(svg).not.toContain("control-mark-close");
  await page.getByRole("button", { name: "Close receiver QR" }).click();

  await page.reload();
  const secondLink = await page.locator(".private-link span").innerText();
  const secondQrPath = await page.locator(".handoff-qr svg path").nth(1).getAttribute("d");
  expect(secondLink).not.toBe(firstLink);
  expect(secondQrPath).not.toBe(firstQrPath);

  const receiver = await context.newPage();
  await receiver.emulateMedia({ reducedMotion: "reduce" });
  await receiver.goto(firstLink);
  await expect(receiver.getByRole("heading", { name: "Ethan made something private for you." })).toBeVisible();
  await expect(receiver.getByRole("button", { name: /log in|sign up|create account/i })).toHaveCount(0);
  await receiver.close();
});
