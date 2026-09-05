// Verifies stable demo URLs present the canonical sender and receiver walkthroughs without changing normal entry.
import { expect, test, type Page } from "@playwright/test";

const canonicalRecipient = "Maya";
const canonicalMessage = "You made the first week in a new place feel familiar. You noticed what I needed before I knew how to ask.";
const normalCabinetKey = "warm-fuzzies-cabinet-v1";

async function drag(page: Page, locator: ReturnType<Page["locator"]>, deltaX: number, deltaY: number, steps = 8) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected a measurable authored layer");
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(startX + (deltaX * step) / steps, startY + (deltaY * step) / steps);
  }
  await page.mouse.up();
}

async function openDemoCreate(page: Page) {
  await page.goto("/demo/create");
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "make it for them", exact: true }).click();
  await expect(page.getByRole("button", { name: "look in your box", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "create something", exact: true }).click();

  const recipient = page.getByLabel("Who is this for?");
  await expect(recipient).toHaveValue(canonicalRecipient);
  await page.getByRole("button", { name: `Start making for ${canonicalRecipient}`, exact: true }).click();
  await expect(page.locator(".story-paper-sheet")).toBeVisible();
}

async function expectCanonicalCreator(page: Page) {
  await expect(page.getByRole("button", { name: `for ${canonicalRecipient}`, exact: true })).toBeVisible();
  await expect(page.locator(".story-layer-text")).toContainText(canonicalMessage);
  await expect(page.locator(".story-layer-photo")).toBeVisible();
}

async function reachHandoffFromPreview(page: Page) {
  const previewAdvance = page.locator(".preview-next");
  await expect(previewAdvance).not.toContainText(/private/i);
  await previewAdvance.click();
}

async function openDemoReceive(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/receive");
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "open it", exact: true }).click();
  await expect(page.locator(".receiver-paper-final .authored-paper")).toBeVisible();
}

async function expectCanonicalReceiver(page: Page) {
  const paper = page.locator(".receiver-paper-final .authored-paper");
  await expect(paper).toHaveClass(/paper-ruled/);
  await expect(paper.locator(".story-layer-text")).toContainText(canonicalMessage);
  await expect(paper.locator(".story-layer-photo")).toBeVisible();
}

test("/demo/create ignores query/hash overrides and walks through the normal sender setup into the prepared canonical canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/create?screen=handoff#v3.not-a-rehearsal-payload");
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toBeVisible();
  await openDemoCreate(page);
  await expectCanonicalCreator(page);
});

test("/demo/create reloads to its normal home entry without another navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDemoCreate(page);
  await expectCanonicalCreator(page);

  await page.reload();
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toBeVisible();
  await expect(page.locator(".story-paper-sheet")).toHaveCount(0);
});

test("the prepared creator is read-only and its tools cannot alter the canonical artifact", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/create");
  await page.getByRole("button", { name: "make it for them", exact: true }).click();
  await page.getByRole("button", { name: "create something", exact: true }).click();
  await expect(page.getByLabel("Who is this for?")).toHaveAttribute("readonly", "");
  await page.getByRole("button", { name: `Start making for ${canonicalRecipient}`, exact: true }).click();
  await expectCanonicalCreator(page);

  const text = page.locator(".story-layer-text");
  const photo = page.locator(".story-layer-photo");
  const [textBefore, photoBefore] = await Promise.all([text.boundingBox(), photo.boundingBox()]);
  if (!textBefore || !photoBefore) throw new Error("Prepared artifact is not measurable");
  await drag(page, text, 82, -58);
  await drag(page, photo, -76, 64);
  const [textAfter, photoAfter] = await Promise.all([text.boundingBox(), photo.boundingBox()]);
  if (!textAfter || !photoAfter) throw new Error("Prepared artifact changed unexpectedly");
  expect(textAfter.x).toBeCloseTo(textBefore.x, 0);
  expect(textAfter.y).toBeCloseTo(textBefore.y, 0);
  expect(photoAfter.x).toBeCloseTo(photoBefore.x, 0);
  expect(photoAfter.y).toBeCloseTo(photoBefore.y, 0);
  await text.dblclick();
  await expect(page.getByLabel(/Write directly on the paper/)).toHaveCount(0);

  await expect(page.locator(".story-tool-dock")).toHaveCount(0);
});

test("the presenter handoff remains canonical and exposes only the fixed audience route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDemoCreate(page);
  await page.getByRole("button", { name: /Next: fold and decorate the envelope/ }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await expect(page.getByRole("radio", { name: "firefly", exact: true })).toHaveAttribute("aria-checked", "true");
  const carrierOptionsLocked = await page.getByRole("radiogroup", { name: "Delivery carrier" }).evaluate((element) => element.hasAttribute("inert") || Array.from(element.querySelectorAll<HTMLButtonElement>("button")).every((button) => button.disabled || button.getAttribute("aria-disabled") === "true"));
  expect(carrierOptionsLocked).toBe(true);
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await reachHandoffFromPreview(page);

  await expect(page.locator(".private-link span")).toHaveText(`${new URL(page.url()).origin}/demo/receive`);
  await expect(page.getByRole("button", { name: "finish giving", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "show the broken-link state", exact: true })).toHaveCount(0);
  await expect(page.locator(".handoff-page")).not.toContainText(/private|bearer link/i);
});

test("/demo/receive presents the same canonical receiver object in separate browser contexts", async ({ browser }) => {
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const first = await firstContext.newPage();
  const second = await secondContext.newPage();
  try {
    await openDemoReceive(first);
    await expectCanonicalReceiver(first);
    await openDemoReceive(second);
    await expectCanonicalReceiver(second);
  } finally {
    await Promise.all([firstContext.close(), secondContext.close()]);
  }
});

test("/demo/receive reloads back to the repeatable arrival journey", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDemoReceive(page);
  await expectCanonicalReceiver(page);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toBeVisible();
});

test("/demo/receive keeps only in its ephemeral demo cabinet", async ({ page }) => {
  const normalCabinetValue = JSON.stringify([{ id: "normal-user-object", marker: "must-survive-demo" }]);
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), { key: normalCabinetKey, value: normalCabinetValue });
  await openDemoReceive(page);
  await page.getByRole("button", { name: "what should this become?", exact: true }).click();
  await page.getByRole("button", { name: "keep", exact: true }).click();
  await expect(page.getByText(/things you kept|kept locally|nothing kept here yet/i)).toBeVisible();
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), normalCabinetKey)).toBe(normalCabinetValue);

  await page.getByRole("button", { name: "Make a new letter", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), normalCabinetKey)).toBe(normalCabinetValue);
});

test("legacy and trailing-slash receiver URLs cannot be overridden", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/?screen=studio#v3.not-a-rehearsal-payload");
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toBeVisible();
  await expect(page.locator(".story-paper-sheet")).toHaveCount(0);
});

test("the receiver demo cannot escape into the normal home or create flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/receive");
  await page.getByRole("button", { name: "another time", exact: true }).click();
  await expect(page.getByRole("heading", { name: "left for another time." })).toBeVisible();
  await page.getByRole("button", { name: "leave", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ethan made something for you." })).toBeVisible();
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toHaveCount(0);
});

test("the normal root route remains the unseeded home entry", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toBeVisible();
  await expect(page.locator(".story-paper-sheet")).toHaveCount(0);
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toHaveCount(0);
});
