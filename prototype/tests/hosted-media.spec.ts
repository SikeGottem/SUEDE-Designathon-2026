// Covers the normal hosted-media handoff without relying on a provisioned storage service.
import { expect, test } from "@playwright/test";
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL3zgAAAABJRU5ErkJggg==", "base64");
function wav() { const samples = Buffer.alloc(1600); const file = Buffer.alloc(44 + samples.length); file.write("RIFF", 0); file.writeUInt32LE(36 + samples.length, 4); file.write("WAVEfmt ", 8); file.writeUInt32LE(16, 16); file.writeUInt16LE(1, 20); file.writeUInt16LE(1, 22); file.writeUInt32LE(8000, 24); file.writeUInt32LE(16000, 28); file.writeUInt16LE(2, 32); file.writeUInt16LE(16, 34); file.write("data", 36); file.writeUInt32LE(samples.length, 40); samples.copy(file, 44); return file; }

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/publish-start", async (route) => {
    const request = route.request();
    expect(request.headers().authorization).toBeUndefined();
    const body = request.postDataJSON();
    expect(body.media).toHaveLength(1);
    expect(body.media[0]).toMatchObject({ slot: "photo-0", mime: "image/png" });
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ draftId: "draft-1", uploads: [{ slot: "photo-0", url: "https://upload.test/photo-0", headers: { "Content-Type": "image/png" } }] }) });
  });
  await page.route("https://upload.test/photo-0", (route) => route.fulfill({ status: 200 }));
  await page.route("**/api/publish-finalize", async (route) => {
    expect(route.request().headers().authorization).toMatch(/^Bearer /);
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ receiverId: "A".repeat(32), path: `/for/${"A".repeat(32)}` }) });
  });
});

test("publishes an exact hosted object, copies its URL, and isolates the next recipient", async ({ page, browser }) => {
  test.setTimeout(45_000);
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them" }).click();
  await page.getByRole("button", { name: "create something" }).click();
  await page.getByLabel("Who is this for?").fill("Maya");
  await page.getByRole("button", { name: "Start making for Maya" }).click();
  await page.getByRole("button", { name: /write/ }).click();
  await page.getByLabel(/Write directly on the paper/).fill("A real photo should arrive too.");
  await page.getByRole("button", { name: "done writing" }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "photo" }).click();
  await page.getByLabel("Choose a photo or video").setInputFiles({ name: "moment.png", mimeType: "image/png", buffer: png });
  await page.getByRole("button", { name: "Next: fold and decorate the envelope" }).click();
  await page.getByRole("button", { name: "choose how it travels" }).click();
  await page.getByRole("button", { name: "see it ready to give" }).click();
  await page.getByRole("button", { name: "give this privately" }).click();
  await expect(page.getByLabel("presenter code")).toHaveCount(0);
  await page.getByRole("button", { name: /prepare to give/ }).click();
  const receiverLink = await page.getByRole("textbox", { name: "Receiver link" }).inputValue();
  expect(receiverLink).toMatch(/\/for\/A{32}$/);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value: string) => { (window as Window & { copiedHostedUrl?: string }).copiedHostedUrl = value; } } }));
  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  expect(await page.evaluate(() => (window as Window & { copiedHostedUrl?: string }).copiedHostedUrl)).toBe(receiverLink);


  const receiverContext = await browser.newContext();
  const receiver = await receiverContext.newPage();
  await receiverContext.route(`**/api/keepsake?id=${"A".repeat(32)}`, (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ snapshot: { v: 1, id: "canvas-1", sender: "Ethan", recipient: "Maya", words: "A real photo should arrive too.", crossedOut: [], paper: "dotted", carrier: "bottle", envelope: "mail", seal: [], pieces: ["photo"], capture: { kind: "photo", url: "media:photo-0" }, voice: null, song: null, doodles: [], stickers: [], inkColor: "navy", layouts: { words: { x: 0, y: 82, rotation: 0, scale: 1 }, photo: { x: 0, y: 0, rotation: 0, scale: 1 }, voice: { x: 0, y: 0, rotation: 0, scale: 1 }, song: { x: 0, y: 0, rotation: 0, scale: 1 }, burst: { x: 0, y: 0, rotation: 0, scale: 1 }, ribbon: { x: 0, y: 0, rotation: 0, scale: 1 }, stamp: { x: 0, y: 0, rotation: 0, scale: 1 } }, scrapbook: { photos: [{ id: "photo", asset: { kind: "photo", url: "media:photo-0" }, layout: { x: 0, y: 0, rotation: 0, scale: 1 }, frame: "tape", caption: "" }], marks: [], order: ["photo", "text-legacy"] } }, media: [{ slot: "photo-0", url: "https://download.test/photo-0", mime: "image/png", bytes: png.length }] }) }));
  await receiverContext.route("https://download.test/photo-0", (route) => route.fulfill({ contentType: "image/png", body: png }));
  await receiver.goto(receiverLink);
  await expect(receiver.getByRole("button", { name: "open it" })).toBeVisible();
  await receiver.getByRole("button", { name: "open it" }).click();
  const image = receiver.getByAltText("Your captured moment").first();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(1);
  await receiver.getByRole("button", { name: "what should this become?" }).click();
  await receiver.getByRole("button", { name: "keep" }).click();
  await expect(receiver.getByRole("button", { name: "Open kept object from Ethan for Maya" })).toBeVisible();
  await receiver.goto("/?screen=cabinet");
  await receiver.getByRole("button", { name: "Open kept object from Ethan for Maya" }).click();
  await expect(receiver.getByRole("button", { name: "open it" })).toBeVisible();
  await page.getByRole("button", { name: "finish giving", exact: false }).click();
  await page.getByRole("button", { name: "make another one…", exact: true }).click();
  await page.getByLabel("Who is this for?").fill("Bob");
  await page.getByRole("button", { name: "Start making for Bob" }).click();
  await page.getByRole("button", { name: /start with a few words/ }).click();
  await page.getByLabel(/Write directly on the paper/).fill("This new object is only for Bob.");
  await page.getByRole("button", { name: "done writing" }).click();
  await page.getByRole("button", { name: "Next: fold and decorate the envelope" }).click();
  await page.getByRole("button", { name: "choose how it travels" }).click();
  await page.getByRole("button", { name: "see it ready to give" }).click();
  await page.getByRole("button", { name: "give this privately" }).click();
  const nextLink = await page.getByRole("textbox", { name: "Receiver link" }).inputValue();
  expect(nextLink).not.toBe(receiverLink);
  expect(nextLink).toContain("#v3.");
  // Even a valid fragment for Bob cannot replace the immutable hosted object for Maya.
  await receiver.goto(receiverLink + new URL(nextLink).hash);
  await expect(receiver.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
  await receiver.getByRole("button", { name: "open it", exact: true }).click();
  await expect(receiver.locator(".receiver-paper-final .story-layer-text")).toHaveText("A real photo should arrive too.");
  await receiverContext.close();
});

test("hydrates and explicitly plays a valid hosted WAV", async ({ browser }) => {
  const context = await browser.newContext(); const page = await context.newPage(); const id = "B".repeat(32);
  const layouts = Object.fromEntries(["words", "photo", "voice", "song", "burst", "ribbon", "stamp"].map((key) => [key, { x: 0, y: 0, rotation: 0, scale: 1 }]));
  await context.route(`**/api/keepsake?id=${id}`, (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ snapshot: { v: 1, id: "audio-canvas", sender: "Ethan", recipient: "Maya", words: "Listen when you want.", crossedOut: [], paper: "dotted", carrier: "bottle", envelope: "mail", seal: [], pieces: ["voice"], capture: null, voice: { name: "voice note", url: "media:voice" }, song: null, doodles: [], stickers: [], inkColor: "navy", layouts, scrapbook: { photos: [], marks: [], order: ["text-legacy", "voice"] } }, media: [{ slot: "voice", url: "https://download.test/voice", mime: "audio/wav", bytes: wav().length }] }) }));
  await context.route("https://download.test/voice", (route) => route.fulfill({ contentType: "audio/wav", body: wav() }));
  await page.goto(`/for/${id}`); await page.getByRole("button", { name: "open it" }).click();
  const audio = page.locator("audio").first(); await expect.poll(() => audio.evaluate((element) => (element as HTMLAudioElement).readyState)).toBeGreaterThanOrEqual(1);
  await audio.evaluate((element) => (element as HTMLAudioElement).play()); await context.close();
});
