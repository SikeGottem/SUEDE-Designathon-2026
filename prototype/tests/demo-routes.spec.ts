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
  await expect(previewAdvance).toBeVisible();
  await previewAdvance.click();
}

async function openDemoReceive(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/receive");
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "remove it", exact: true })).toBeVisible();
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

test("the prepared creator is a fully editable template with the normal maker tools", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/create");
  await page.getByRole("button", { name: "make it for them", exact: true }).click();
  await page.getByRole("button", { name: "create something", exact: true }).click();
  await expect(page.getByLabel("Who is this for?")).not.toHaveAttribute("readonly", "");
  await page.getByRole("button", { name: `Start making for ${canonicalRecipient}`, exact: true }).click();
  await expectCanonicalCreator(page);

  const text = page.locator(".story-layer-text");
  await drag(page, text, 82, -58);
  await expect(text).not.toHaveAttribute("tabindex", "-1");
  await text.dblclick();
  await expect(page.getByLabel(/Write directly on the paper/)).toBeVisible();
  await page.getByLabel(/Write directly on the paper/).fill(`${canonicalMessage} I am glad you are here.`);
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await expect(page.getByRole("group", { name: "Paper character" })).toBeVisible();
  await page.getByRole("button", { name: "grid", exact: true }).click();
  await page.getByRole("button", { name: "Use rust ink", exact: true }).click();
  await page.getByRole("button", { name: "Add burst mark", exact: true }).click();
  await expect(page.locator(".story-tool-dock")).toBeVisible();
  await expect(page.locator(".story-paper-sheet")).toHaveClass(/paper-grid/);
  await expect(page.locator(".story-layer-burst")).toBeVisible();
});

test("the demo handoff sends the exact edited template through a v3 receiver URL", async ({ browser }) => {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDemoCreate(page);
  const revisedMessage = `${canonicalMessage} Thank you for making it feel like home.`;
  await page.locator(".story-layer-text").dblclick();
  await page.getByLabel(/Write directly on the paper/).fill(revisedMessage);
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "grid", exact: true }).click();
  await page.getByRole("button", { name: "for Maya", exact: true }).click();
  await page.getByLabel("Who is this for?").fill("Noor");
  await page.getByRole("button", { name: "done", exact: true }).click();
  await page.getByRole("button", { name: /Next: fold and decorate the envelope/ }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await page.getByRole("radio", { name: "plane", exact: true }).click();
  await expect(page.getByRole("radio", { name: "plane", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await reachHandoffFromPreview(page);

  const url = await page.locator(".private-link span").innerText();
  expect(url).toMatch(/\/demo\/receive#v3\./);
  await expect(page.getByRole("button", { name: "show the broken-link state", exact: true })).toBeVisible();

  const receiver = await browser.newPage();
  try {
    await receiver.emulateMedia({ reducedMotion: "reduce" });
    await receiver.goto(url);
    await expect(receiver.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
    await expect(receiver.getByRole("button", { name: "remove it", exact: true })).toBeVisible();
    await expect(receiver.getByText("for Noor", { exact: true })).toBeVisible();
    await expect(receiver.getByLabel("Double tap the plane to open")).toBeVisible();
    await receiver.getByRole("button", { name: "open it", exact: true }).click();
    const paper = receiver.locator(".receiver-paper-final .authored-paper");
    await expect(paper.locator(".story-layer-text")).toContainText(revisedMessage);
    await expect(paper).toHaveClass(/paper-grid/);
  } finally {
    await Promise.all([receiver.close(), page.close()]);
  }
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
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), normalCabinetKey)).toBe(normalCabinetValue);
});

test("demo receiver rejects legacy and malformed payload hashes instead of replacing them with the fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const hash of ["#v1.not-a-demo-payload", "#v2.not-a-demo-payload", "#v3.not-a-demo-payload"]) {
    await page.goto(`/demo/receive${hash}`);
    await expect(page.getByRole("heading", { name: "this one cannot be opened." })).toBeVisible();
    await expect(page.getByRole("button", { name: "open it", exact: true })).toHaveCount(0);
  }

  await page.goto("/demo/");
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toBeVisible();
});

test("the receiver demo cannot escape into the normal home or create flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/receive");
  await page.getByRole("button", { name: "another time", exact: true }).click();
  await expect(page.getByRole("heading", { name: "left for another time." })).toBeVisible();
  await page.getByRole("button", { name: "leave", exact: true }).click();
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toHaveCount(0);
});

test("the normal root route remains the unseeded home entry", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "make it for them", exact: true })).toBeVisible();
  await expect(page.locator(".story-paper-sheet")).toHaveCount(0);
  await expect(page.getByText(`for ${canonicalRecipient}`, { exact: true })).toHaveCount(0);
});
