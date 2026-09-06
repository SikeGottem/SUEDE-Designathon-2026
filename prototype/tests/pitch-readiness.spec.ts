// Protects the pitch-demo affordances that must work honestly in front of judges.
import { expect, test, type Page } from "@playwright/test";

async function startEmptyComposer(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them" }).click();
  await page.getByRole("button", { name: "create something" }).click();
  await page.getByLabel("Who is this for?").fill("Maya");
  await page.getByRole("button", { name: "Start making for Maya" }).click();
  await expect(page.locator(".story-paper-sheet")).toBeVisible();
}

async function seededHandoff(page: Page) {
  await page.goto("/?screen=handoff");
  await expect(page.getByRole("textbox", { name: "Receiver link" })).toHaveValue(/\/for\//);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("starts a normal blank paper with an explicit writing invitation", async ({ page }) => {
  await startEmptyComposer(page);

  const invitation = page.getByRole("button", { name: /start with a few words/i });
  await expect(invitation).toBeVisible();
  await invitation.click();
  await expect(page.getByLabel(/Write directly on the paper in text box 1/)).toBeVisible();
  await expect(invitation).toHaveCount(0);
  await page.getByLabel(/Write directly on the paper in text box 1/).fill("Thanks for the ordinary days.");
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await expect(page.locator("[data-phone-screen]")).toHaveJSProperty("scrollTop", 0);
});

test("makes the local-song limitation clear and keeps the five ink choices visually distinct", async ({ page }) => {
  await startEmptyComposer(page);
  await page.getByRole("button", { name: "add", exact: true }).click();

  const swatches = page.locator(".ink-swatch > span");
  await expect(swatches).toHaveCount(5);
  const colours = await swatches.evaluateAll((items) => items.map((item) => getComputedStyle(item).backgroundColor));
  expect(new Set(colours).size).toBe(5);

  await page.getByRole("button", { name: "song", exact: true }).click();
  const importNote = page.getByRole("region", { name: "Add a song" });
  await expect(importNote).toContainText("Audio stays on this device. Remove it before sharing a link or QR.");
  await importNote.getByRole("button", { name: "choose file" }).click();
  await page.getByLabel("Choose an audio file for this keepsake").setInputFiles({
    name: "for-maya.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.from([0x49, 0x44, 0x33, 0x04]),
  });
  await expect(page.getByText("for-maya", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Next: fold and decorate the envelope" }).click();
  await page.getByRole("button", { name: "choose how it travels" }).click();
  await page.getByRole("button", { name: "see it ready to give" }).click();
  await page.getByRole("button", { name: "give this privately" }).click();
  await expect(page.getByRole("button", { name: "Copy generated receiver link" })).toBeDisabled();
  await expect(page.locator(".private-link span")).toContainText("includes local media that cannot travel in a link");
  await expect(page.getByRole("button", { name: "finish giving" })).toHaveCount(0);
});

test("uses QR as the honest fallback when clipboard copying fails", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new Error("clipboard denied"); } },
    });
  });
  await seededHandoff(page);

  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  await expect(page.getByText("Your link is ready. Copy it from the selected field, or use the QR.")).toBeVisible();
  await expect(page.getByRole("button", { name: "finish giving" })).toHaveCount(0);

  await page.getByRole("button", { name: "Open receiver QR for this keepsake" }).click();
  await expect(page.getByRole("dialog", { name: "Receiver QR for this keepsake" })).toBeVisible();
  await page.getByRole("button", { name: "Close receiver QR" }).click();
  await expect(page.getByRole("button", { name: "finish giving" })).toBeVisible();
});

test("only unlocks finish giving after a successful clipboard copy", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await seededHandoff(page);

  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  await expect(page.getByRole("button", { name: "Copy generated receiver link" })).toHaveText("copied");
  await expect(page.getByRole("button", { name: "finish giving" })).toBeVisible();
});
