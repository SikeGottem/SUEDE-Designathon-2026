// Verifies the authored multi-text composer can freely arrange and transport meaningful paper layouts.
import { expect, test, type Locator, type Page } from "@playwright/test";

type RelativePosition = { x: number; y: number };

async function drag(page: Page, locator: Locator, deltaX: number, deltaY: number, steps = 8) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Drag target has no bounding box");
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(startX + (deltaX * step) / steps, startY + (deltaY * step) / steps);
  }
  await page.mouse.up();
}

async function relativePosition(layer: Locator, paper: Locator): Promise<RelativePosition> {
  const [layerBox, paperBox] = await Promise.all([layer.boundingBox(), paper.boundingBox()]);
  if (!layerBox || !paperBox) throw new Error("Expected an authored layer inside the paper");
  return {
    x: Number((((layerBox.x + layerBox.width / 2) - paperBox.x) / paperBox.width).toFixed(3)),
    y: Number((((layerBox.y + layerBox.height / 2) - paperBox.y) / paperBox.height).toFixed(3)),
  };
}

async function startComposer(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them" }).click();
  await page.getByRole("button", { name: "create something" }).click();
  await page.getByLabel("Who is this for?").fill("Maya");
  await page.getByRole("button", { name: "Start making for Maya" }).click();
  await expect(page.locator(".story-paper-sheet")).toBeVisible();
}

async function addTextBlock(page: Page, copy: string, action: "write" | "add words") {
  await page.getByRole("button", { name: action, exact: true }).click();
  const editor = page.getByLabel(/Write directly on the paper/).last();
  await editor.fill(copy);
  await page.getByRole("button", { name: "done writing", exact: true }).click();
}

async function addSamplePhoto(page: Page) {
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "photo", exact: true }).click();
  await page.getByRole("button", { name: "use sample moment", exact: true }).click();
  await expect(page.locator(".story-layer-photo")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("authors two independent text blocks on one paper", async ({ page }) => {
  await startComposer(page);
  await addTextBlock(page, "I noticed how kind you were.", "write");
  await addTextBlock(page, "Thank you for making room for me.", "add words");

  const blocks = page.locator(".story-layer-text[data-text-block-id]");
  await expect(blocks).toHaveCount(2);
  await expect(blocks.nth(0)).toContainText("I noticed how kind you were.");
  await expect(blocks.nth(1)).toContainText("Thank you for making room for me.");

  const ids = await blocks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-text-block-id")));
  expect(new Set(ids).size).toBe(2);
  expect(ids.every(Boolean)).toBe(true);
});

test("moves an authored text block materially beyond the old centre barrier", async ({ page }) => {
  await startComposer(page);
  await addTextBlock(page, "This should be able to sit near the edge.", "write");

  const block = page.locator(".story-layer-text[data-text-block-id]").first();
  await block.click();
  const before = await block.boundingBox();
  if (!before) throw new Error("Text block is not measurable");
  await drag(page, block, 94, -96);
  const after = await block.boundingBox();
  if (!after) throw new Error("Text block disappeared after dragging");

  // The old x clamp was ±16px. A genuine full-paper canvas must allow substantially more movement.
  expect(after.x - before.x).toBeGreaterThan(48);
  expect(after.y - before.y).toBeLessThan(-48);
  const paper = page.locator(".story-paper-sheet");
  const finalPosition = await relativePosition(block, paper);
  expect(finalPosition.x).toBeGreaterThan(0.58);
  expect(finalPosition.y).toBeLessThan(0.6);
});

test("resizes selected text and photo pieces through their dedicated handles", async ({ page }) => {
  await startComposer(page);
  await addTextBlock(page, "A little note that needs more room.", "write");
  await addSamplePhoto(page);

  const text = page.locator(".story-layer-text[data-text-block-id]").first();
  await text.click();
  const textPaper = text.locator(".story-layer-paper");
  const textBefore = await textPaper.boundingBox();
  if (!textBefore) throw new Error("Text paper is not measurable");
  await drag(page, text.getByRole("button", { name: /^Resize / }), 54, 48);
  const textAfter = await textPaper.boundingBox();
  if (!textAfter) throw new Error("Text paper disappeared after resizing");
  expect(textAfter.width).toBeGreaterThan(textBefore.width * 1.15);

  const photo = page.locator(".story-layer-photo");
  await photo.click();
  const photoPositionBefore = await photo.boundingBox();
  if (!photoPositionBefore) throw new Error("Photo is not measurable before moving");
  await drag(page, photo, -96, 74);
  const photoPositionAfter = await photo.boundingBox();
  if (!photoPositionAfter) throw new Error("Photo disappeared after moving");
  expect(photoPositionAfter.x - photoPositionBefore.x).toBeLessThan(-48);
  expect(photoPositionAfter.y - photoPositionBefore.y).toBeGreaterThan(36);

  await photo.click();
  const photoPaper = photo.locator(".story-layer-paper");
  const photoBefore = await photoPaper.boundingBox();
  if (!photoBefore) throw new Error("Photo paper is not measurable");
  await drag(page, photo.getByRole("button", { name: /^Resize / }), 58, 52);
  const photoAfter = await photoPaper.boundingBox();
  if (!photoAfter) throw new Error("Photo paper disappeared after resizing");
  expect(photoAfter.width).toBeGreaterThan(photoBefore.width * 1.15);
});

test("keeps both text blocks' content and layout in the exact receiver link", async ({ page, context }) => {
  await startComposer(page);
  const authoredCopy = ["The first thing I wanted to say.", "The second thing I did not want to lose."];
  await addTextBlock(page, authoredCopy[0], "write");
  await addTextBlock(page, authoredCopy[1], "add words");

  const senderBlocks = page.locator(".story-layer-text[data-text-block-id]");
  await senderBlocks.nth(0).click();
  await drag(page, senderBlocks.nth(0), -78, -92);
  await senderBlocks.nth(1).click();
  await drag(page, senderBlocks.nth(1), 86, 112);
  const senderState = await Promise.all((await senderBlocks.all()).map(async (block, index) => ({
    id: await block.getAttribute("data-text-block-id"),
    text: authoredCopy[index],
    layout: await block.getAttribute("data-layout"),
  })));

  await page.getByRole("button", { name: /Next: fold and decorate the envelope/ }).click();
  await page.getByRole("button", { name: "choose how it travels" }).click();
  await page.getByRole("button", { name: "see it ready to give" }).click();
  await page.getByRole("button", { name: "give this privately" }).click();
  const receiverUrl = await page.locator(".private-link span").innerText();
  expect(receiverUrl).toContain("/for/");

  const receiver = await context.newPage();
  await receiver.emulateMedia({ reducedMotion: "reduce" });
  await receiver.goto(receiverUrl);
  await receiver.getByRole("button", { name: "open it", exact: true }).click();

  const receiverBlocks = receiver.locator(".receiver-paper-final .story-layer-text[data-text-block-id]");
  await expect(receiverBlocks).toHaveCount(2);
  for (const expected of senderState) {
    const received = receiverBlocks.filter({ has: receiver.getByText(expected.text, { exact: true }) });
    await expect(received).toHaveCount(1);
    await expect(received).toHaveAttribute("data-text-block-id", expected.id!);
    await expect(received).toHaveAttribute("data-layout", expected.layout!);
  }

  await receiver.getByRole("button", { name: "what should this become?", exact: true }).click();
  await receiver.getByRole("button", { name: "keep", exact: true }).click();
  await expect(receiver.getByRole("heading", { name: "things you kept." })).toBeVisible();
  await receiver.getByRole("button", { name: "Open kept object from Ethan for Maya" }).click();

  const keptBlocks = receiver.locator(".receiver-paper-final .story-layer-text[data-text-block-id]");
  await expect(keptBlocks).toHaveCount(2);
  for (const expected of senderState) {
    const kept = keptBlocks.filter({ has: receiver.getByText(expected.text, { exact: true }) });
    await expect(kept).toHaveAttribute("data-text-block-id", expected.id!);
    await expect(kept).toHaveAttribute("data-layout", expected.layout!);
  }
  await receiver.close();
});

test("offers keyboard movement, resizing, rotation, and removal for a text block", async ({ page }) => {
  await startComposer(page);
  await addTextBlock(page, "I can arrange this without a pointer.", "write");

  const block = page.locator(".story-layer-text[data-text-block-id]").first();
  await block.focus();
  const before = (await block.getAttribute("data-layout"))!.split(",").map(Number);
  await page.keyboard.press("Shift+ArrowRight");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("]");
  await page.keyboard.press("=");
  const after = (await block.getAttribute("data-layout"))!.split(",").map(Number);

  expect(after[0]).toBeGreaterThan(before[0]);
  expect(after[1]).toBeLessThan(before[1]);
  expect(after[2]).toBeGreaterThan(before[2]);
  expect(after[3]).toBeGreaterThan(before[3]);

  await page.keyboard.press("Delete");
  await expect(block).toHaveCount(0);
});
