// Verifies ordinary exact-link creation and recovery when browser clipboard access is unavailable.
import { expect, test, type Page } from "@playwright/test";

async function makeLink(page: Page, words: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them", exact: true }).click();
  await page.getByRole("button", { name: "create something", exact: true }).click();
  await page.getByLabel("Who is this for?").fill("Link check");
  await page.getByRole("button", { name: "Start making for Link check", exact: true }).click();
  await page.getByRole("button", { name: /start with a few words/ }).click();
  await page.getByLabel(/Write directly on the paper/).fill(words);
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "Next: fold and decorate the envelope", exact: true }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await page.getByRole("button", { name: "give this privately", exact: true }).click();
  return page.getByRole("textbox", { name: "Receiver link" });
}

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: "reduce" }); });

test("an ordinary generated link opens the exact page without exposing the failure-test control", async ({ page, context }) => {
  const words = "Production handoff check — 6 September.";
  const link = await makeLink(page, words);
  await expect(link).toHaveAttribute("readonly", "");
  const url = await link.inputValue();
  expect(url).toMatch(/\/for\/wf-.+#v3\./);
  await expect(page.getByRole("button", { name: "show the broken-link state" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "open receiver", exact: true })).toHaveAttribute("href", url);
  const receiver = await context.newPage();
  await receiver.emulateMedia({ reducedMotion: "reduce" });
  await receiver.goto(url);
  await receiver.getByRole("button", { name: "open it", exact: true }).click();
  await expect(receiver.locator(".receiver-paper-final .story-layer-text")).toHaveText(words);
  await receiver.close();
});

test("removing local media restores an exact link and QR without silently dropping it", async ({ page, context }) => {
  const words = "The words remain after the local photo is removed.";
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them", exact: true }).click();
  await page.getByRole("button", { name: "create something", exact: true }).click();
  await page.getByLabel("Who is this for?").fill("Local media check");
  await page.getByRole("button", { name: "Start making for Local media check", exact: true }).click();
  await page.getByRole("button", { name: /start with a few words/ }).click();
  await page.getByLabel(/Write directly on the paper/).fill(words);
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "photo", exact: true }).click();
  await page.getByLabel("Choose a photo or video").setInputFiles({
    name: "local-moment.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
  });
  await page.getByRole("button", { name: "Next: fold and decorate the envelope", exact: true }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await page.getByRole("button", { name: "give this privately", exact: true }).click();

  await expect(page.getByRole("heading", { name: "remove local media to share this page." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("1 photo available only in this tab");
  await expect(page.getByRole("button", { name: "Copy generated receiver link" })).toHaveCount(0);
  await page.getByRole("button", { name: "review local media", exact: true }).click();
  await page.locator('[data-item-kind="photo"]').click();
  await page.getByRole("region", { name: "Customise selected item" }).getByRole("button", { name: "remove", exact: true }).click();

  await page.getByRole("button", { name: "Next: fold and decorate the envelope", exact: true }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await page.getByRole("button", { name: "give this privately", exact: true }).click();
  const link = page.getByRole("textbox", { name: "Receiver link" });
  const url = await link.inputValue();
  await expect(page.getByRole("button", { name: "Open receiver QR for this keepsake" })).toBeVisible();

  const receiver = await context.newPage();
  try {
    await receiver.emulateMedia({ reducedMotion: "reduce" });
    await receiver.goto(url);
    await receiver.getByRole("button", { name: "open it", exact: true }).click();
    await expect(receiver.locator(".receiver-paper-final .story-layer-text")).toHaveText(words);
    await expect(receiver.locator(".receiver-paper-final .story-layer-photo")).toHaveCount(0);
  } finally {
    await receiver.close();
  }
});

test("a dense exact link has manual-copy recovery when clipboard access and QR are unavailable", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }); });
  let state = 17;
  const words = Array.from({ length: 1800 }, () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return String.fromCharCode(33 + state % 90); }).join("");
  const link = await makeLink(page, words);
  const url = await link.inputValue();
  expect(url.length).toBeGreaterThan(1200);
  await expect(page.getByRole("button", { name: "Open receiver QR for this keepsake" })).toHaveCount(0);
  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  await expect(page.locator(".copy-recovery-note")).toContainText("Your link is ready.");
  expect(await link.evaluate((input: HTMLInputElement) => [input.selectionStart, input.selectionEnd])).toEqual([0, url.length]);
  await expect(page.getByRole("button", { name: "finish giving", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "I copied the link", exact: true }).click();
  await expect(page.getByRole("button", { name: "finish giving", exact: true })).toBeVisible();
  await expect(link).toHaveValue(url);
});


test("editing a copied keepsake requires sharing its new exact link again", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => undefined } }); });
  const link = await makeLink(page, "First live-link revision.");
  const original = await link.inputValue();
  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  await expect(page.getByRole("button", { name: "finish giving", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "back to the object", exact: true }).click();
  await page.getByRole("button", { name: "edit the inside", exact: true }).click();
  await page.getByRole("button", { name: "back to your paper", exact: true }).click();
  await page.locator(".story-layer-text").dblclick();
  await page.getByLabel(/Write directly on the paper/).fill("Second live-link revision.");
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.getByRole("button", { name: "Next: fold and decorate the envelope", exact: true }).click();
  await page.getByRole("button", { name: "choose how it travels", exact: true }).click();
  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await page.getByRole("button", { name: "give this privately", exact: true }).click();
  await expect(link).not.toHaveValue(original);
  await expect(page.getByRole("button", { name: "Copy generated receiver link" })).toHaveText("copy");
  await expect(page.getByRole("button", { name: "finish giving", exact: true })).toHaveCount(0);
});
