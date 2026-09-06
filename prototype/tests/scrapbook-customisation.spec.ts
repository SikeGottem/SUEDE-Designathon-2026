// Covers the user-visible scrapbook controls and exact handoff compatibility.
import LZString from "lz-string";
import { expect, test, type Locator, type Page } from "@playwright/test";

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = LZString;

// Captured from an ordinary deployed 86fbec5 handoff before the scrapbook extension.
const LEGACY_HASH = "#v3.NoRgNARA7ghgTgWwLQDMCuAvDBLApgZyQBNcEB7CSAUQBcALGAO0ogFkYBPGFgTTLQAECGCQH1cAlNjj4aAqLlwBrAdkYCYAxrigCADgBsYAYwkpFByTATYD2eADoBfQYzI1spovIZyAklqKJN4ARrgoZHASAUraunRkujRkGvhKDpTAALqQcGgGuEQsUlEoBhwsjNgA5nQ0maAADACsjWAATACcjW0AzADsbUitfQAcbc3tY0OTfYNgI2BI-a1g3UMrQ+tZOcAQegnJEDkA3hBKakUAXBD41oa4EAC+YIz5Bq-vYNnfORCMMAAbhVvsA2qN2ksQA5mmAQLskL0ACxQ-oANiWvThCKRkJAaLaeN2uLhaNGS3aMOx31GGKQIH65P61OASE6eJAkKQ5Ph33ZcPaGNh8L+ITIBiKoIgNFwAA8aEgCtUTCCIC4hCIJOJJNJZPJFCo1BpArpDCYzBYrDY7I5nPwtO5PIUfDB-IFCs6whEogIYnEBAkkikYGkMr9vuCudDhTsdkA";

async function startComposer(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "make it for them" }).click();
  await page.getByRole("button", { name: "create something" }).click();
  await page.getByLabel("Who is this for?").fill("Maya");
  await page.getByRole("button", { name: "Start making for Maya" }).click();
}

async function addSamplePhoto(page: Page) {
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "photo", exact: true }).click();
  await expect(page.getByText("Photos stay here until you prepare the keepsake to give.")).toBeVisible();
  await page.getByRole("button", { name: "use sample moment" }).click();
}

async function continueToHandoff(page: Page) {
  await page.getByRole("button", { name: /Next: fold and decorate the envelope/ }).click();
  await page.getByRole("button", { name: "choose how it travels" }).click();
  await page.getByRole("button", { name: "see it ready to give" }).click();
  await page.getByRole("button", { name: "give this privately" }).click();
}

function itemSignature(container: Locator) {
  return container.locator("[data-item-id]").evaluateAll((items) => items.map((item) => ({
    id: item.getAttribute("data-item-id"),
    kind: item.getAttribute("data-item-kind"),
    order: item.getAttribute("data-layer-order"),
    layout: item.getAttribute("data-layout"),
    frame: item.getAttribute("data-frame"),
    mark: item.getAttribute("data-mark-kind"),
    ink: item.getAttribute("data-ink"),
    align: item.getAttribute("data-text-align"),
    size: item.getAttribute("data-text-size"),
    weight: item.getAttribute("data-text-weight"),
    text: item.textContent,
  })));
}

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: "reduce" }); });

function silentWav(seconds = 2) {
  const rate = 8000;
  const dataSize = rate * seconds;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write("RIFF", 0); wav.writeUInt32LE(36 + dataSize, 4); wav.write("WAVEfmt ", 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate, 28);
  wav.writeUInt16LE(1, 32); wav.writeUInt16LE(8, 34); wav.write("data", 36); wav.writeUInt32LE(dataSize, 40);
  wav.fill(128, 44);
  return wav;
}

async function installSyntheticRecorder(page: Page) {
  await page.addInitScript(() => {
    const stream = { getTracks: () => [{ stop: () => undefined }] };
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: async () => stream } });
    class SyntheticRecorder {
      static isTypeSupported() { return true; }
      mimeType = "audio/wav";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      constructor(_stream: MediaStream) {}
      start() {}
      stop() { this.ondataavailable?.({ data: new Blob([new Uint8Array(64)], { type: this.mimeType }) } as BlobEvent); this.onstop?.(); }
    }
    Object.defineProperty(window, "MediaRecorder", { configurable: true, value: SyntheticRecorder });
  });
}

test("audio pieces select, arrange, play, and replace independently on desktop and a coarse phone", async ({ browser }) => {
  test.setTimeout(45_000);
  const devices = [
    { name: "desktop", options: { viewport: { width: 1100, height: 1100 } } },
    { name: "coarse phone", options: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ] as const;

  for (const device of devices) {
    const context = await browser.newContext(device.options);
    const page = await context.newPage();
    try {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await installSyntheticRecorder(page);
      await startComposer(page);
      await page.getByRole("button", { name: "add", exact: true }).click();
      await page.getByRole("button", { name: "song", exact: true }).click();
      await page.getByRole("button", { name: "choose file", exact: true }).click();
      await page.getByLabel("Choose an audio file for this keepsake").setInputFiles({
        name: "first-song.wav", mimeType: "audio/wav", buffer: silentWav(),
      });

      const piece = page.locator('[data-item-kind="song"]');
      await expect(piece).toHaveCount(1);
      await expect(page.getByRole("region", { name: "Customise selected item" })).toBeVisible();
      await page.getByRole("button", { name: "Done customising" }).click();

      // The card remains a normal selectable piece while its dedicated play button stays playback-only.
      const cardLabel = piece.locator(":scope > .story-layer-paper > .audio-paper-piece > span");
      if (device.name === "coarse phone") await cardLabel.tap();
      else await cardLabel.click();
      const tools = page.getByRole("region", { name: "Customise selected item" });
      await expect(tools).toBeVisible();
      const beforeDrag = await piece.getAttribute("data-layout");
      const labelBox = await cardLabel.boundingBox();
      expect(labelBox).not.toBeNull();
      await page.mouse.move(labelBox!.x + labelBox!.width / 2, labelBox!.y + labelBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(labelBox!.x + labelBox!.width / 2 + 28, labelBox!.y + labelBox!.height / 2 + 18, { steps: 3 });
      await page.mouse.up();
      await expect(piece).not.toHaveAttribute("data-layout", beforeDrag!);
      await tools.getByRole("tab", { name: "arrange" }).click();
      const beforeNudge = await piece.getAttribute("data-layout");
      await tools.getByRole("button", { name: "Move right" }).click();
      await expect(piece).not.toHaveAttribute("data-layout", beforeNudge!);
      const arrangedLayout = await piece.getAttribute("data-layout");
      await tools.getByRole("button", { name: "Done customising" }).click();
      const playback = piece.locator(".audio-paper-playback");
      await playback.focus();
      await page.keyboard.press("Enter");
      await expect(playback).toHaveAttribute("aria-label", /Pause song/);
      await page.keyboard.press("Space");
      await expect(playback).toHaveAttribute("aria-label", /Play song/);
      await expect(tools).toHaveCount(0);

      await page.getByRole("button", { name: "add", exact: true }).click();
      await page.getByRole("button", { name: "Add burst mark" }).click();
      await page.getByRole("button", { name: "Done customising" }).click();
      if (device.name === "coarse phone") await cardLabel.tap();
      else await cardLabel.click();
      const originalOrder = await piece.getAttribute("data-layer-order");
      await tools.getByRole("button", { name: "choose another song" }).click();
      await page.getByLabel("Choose a replacement audio file").setInputFiles({
        name: "replacement-song.wav", mimeType: "audio/wav", buffer: silentWav(),
      });
      await expect(piece).toContainText("replacement-song");
      await expect(piece).toHaveAttribute("data-layout", arrangedLayout!);
      await expect(piece).toHaveAttribute("data-layer-order", originalOrder!);

      await tools.getByRole("button", { name: "Done customising" }).click();
      await page.getByRole("button", { name: "add", exact: true }).click();
      await page.getByRole("button", { name: "voice", exact: true }).click();
      await page.getByRole("button", { name: "start recording" }).click();
      await page.getByRole("button", { name: "keep this voice" }).click();
      const voice = page.locator('[data-item-kind="voice"]');
      await expect(voice).toHaveCount(1);
      await page.getByRole("button", { name: "Done customising" }).click();
      const voiceLabel = voice.locator(":scope > .story-layer-paper > .audio-paper-piece > span");
      if (device.name === "coarse phone") await voiceLabel.tap();
      else await voiceLabel.click();
      const voiceLayout = await voice.getAttribute("data-layout");
      await tools.getByRole("button", { name: "record again" }).click();
      await page.getByRole("button", { name: "cancel", exact: true }).click();
      await expect(voice).toHaveAttribute("data-layout", voiceLayout!);
      await expect(voice).toContainText("voice note");
    } finally {
      await context.close();
    }
  }
});

test("adds independent photos up to four, then styles, captions, and removes only the selected photo", async ({ page }) => {
  await startComposer(page);
  for (let count = 0; count < 4; count += 1) await addSamplePhoto(page);
  const photos = page.locator('[data-item-kind="photo"]');
  await expect(photos).toHaveCount(4);
  expect(new Set(await photos.evaluateAll((items) => items.map((item) => item.getAttribute("data-item-id")))).size).toBe(4);

  await page.getByRole("button", { name: "add", exact: true }).click();
  await expect(page.getByRole("button", { name: "photo", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "close", exact: true }).click();

  const firstId = await photos.first().getAttribute("data-item-id");
  await photos.nth(1).click();
  const tools = page.getByRole("region", { name: "Customise selected item" });
  await tools.getByRole("button", { name: "polaroid", exact: true }).click();
  await tools.getByRole("button", { name: "caption", exact: true }).click();
  await page.getByLabel("Photo caption").fill("The day we finally laughed about it.");
  await tools.getByRole("button", { name: "done caption" }).click();
  await expect(photos.nth(1)).toHaveAttribute("data-frame", "polaroid");
  await expect(photos.nth(1).locator(".photo-caption")).toHaveText("The day we finally laughed about it.");
  await tools.getByRole("button", { name: "remove", exact: true }).click();
  await expect(photos).toHaveCount(3);
  await expect(page.locator(`[data-item-id="${firstId}"]`)).toBeVisible();
});

test("gives text and repeated marks their own style and identities", async ({ page }) => {
  await startComposer(page);
  await page.getByRole("button", { name: "write", exact: true }).click();
  await page.getByLabel(/Write directly on the paper/).fill("You made room for me.");
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  const text = page.locator('[data-item-kind="text"]').first();
  await text.click();
  const tools = page.getByRole("region", { name: "Customise selected item" });
  await tools.getByRole("button", { name: "Use rust ink" }).click();
  await tools.getByRole("button", { name: "Align text center" }).click();
  await tools.getByRole("button", { name: "large", exact: true }).click();
  await tools.getByRole("button", { name: "emphasis" }).click();
  await tools.getByRole("button", { name: "duplicate", exact: true }).click();
  await expect(page.locator('[data-item-kind="text"]')).toHaveCount(2);
  await expect(text).toHaveAttribute("data-ink", "rust");
  await expect(text).toHaveAttribute("data-text-align", "center");
  await expect(text).toHaveAttribute("data-text-size", "large");

  await page.getByRole("button", { name: "Done customising" }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "Add burst mark" }).click();
  await page.getByRole("button", { name: "Done customising" }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "Add burst mark" }).click();
  const marks = page.locator('[data-item-kind="mark"][data-mark-kind="burst"]');
  await expect(marks).toHaveCount(2);
  expect(new Set(await marks.evaluateAll((items) => items.map((item) => item.getAttribute("data-item-id")))).size).toBe(2);
});

test("preserves ordered scrapbook pieces through the exact receiver URL and browser-local cabinet", async ({ page, context }) => {
  await startComposer(page);
  await addSamplePhoto(page);
  await addSamplePhoto(page);
  const photo = page.locator('[data-item-kind="photo"]').first();
  await photo.click();
  let tools = page.getByRole("region", { name: "Customise selected item" });
  await tools.getByRole("button", { name: "polaroid", exact: true }).click();
  await tools.getByRole("button", { name: "caption", exact: true }).click();
  await page.getByLabel("Photo caption").fill("A very ordinary, very good day.");
  await tools.getByRole("button", { name: "done caption" }).click();
  await tools.getByRole("button", { name: "Done customising" }).click();
  await page.getByRole("button", { name: "write", exact: true }).click();
  await page.getByLabel(/Write directly on the paper/).fill("I notice your kindness.");
  await page.getByRole("button", { name: "done writing", exact: true }).click();
  await page.locator('[data-item-kind="text"]').click();
  tools = page.getByRole("region", { name: "Customise selected item" });
  await tools.getByRole("button", { name: "Use rust ink" }).click();
  await tools.getByRole("button", { name: "Align text center" }).click();
  await tools.getByRole("tab", { name: "arrange" }).click();
  await tools.getByRole("button", { name: "backward", exact: true }).click();
  await tools.getByRole("button", { name: "Done customising" }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "Add burst mark" }).click();
  await page.getByRole("button", { name: "Done customising" }).click();
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "Add burst mark" }).click();
  tools = page.getByRole("region", { name: "Customise selected item" });
  await tools.getByRole("tab", { name: "arrange" }).click();
  await tools.getByRole("button", { name: "backward", exact: true }).click();
  await tools.getByRole("button", { name: "Done customising" }).click();
  const source = page.locator(".story-paper-sheet");
  const expected = await itemSignature(source);
  await continueToHandoff(page);
  const url = await page.getByRole("textbox", { name: "Receiver link" }).inputValue();
  expect(url).toContain("#v3.");

  const receiver = await context.newPage();
  await receiver.emulateMedia({ reducedMotion: "reduce" });
  await receiver.goto(url);
  await receiver.getByRole("button", { name: "open it", exact: true }).click();
  expect(await itemSignature(receiver.locator(".receiver-paper-final"))).toEqual(expected);
  await receiver.getByRole("button", { name: "what should this become?", exact: true }).click();
  await receiver.getByRole("button", { name: "keep", exact: true }).click();
  await receiver.getByRole("button", { name: "Open kept object from Ethan for Maya" }).click();
  await expect(receiver.locator(".receiver-paper-final [data-item-id]")).toHaveCount(expected.length);
  expect(await itemSignature(receiver.locator(".receiver-paper-final"))).toEqual(expected);
  await receiver.close();
});

test("accepts the captured pre-scrapbook v3 link and rejects a malformed rich extension", async ({ page }) => {
  await page.goto(`/for/legacy${LEGACY_HASH}`);
  await page.getByRole("button", { name: "open it", exact: true }).click();
  await expect(page.locator(".receiver-paper-final .story-layer-photo")).toBeVisible();
  await expect(page.locator(".receiver-paper-final")).toContainText("You made the first week in a new place feel familiar.");

  const compact = JSON.parse(decompressFromEncodedURIComponent(LEGACY_HASH.slice(4))!);
  compact.push({ p: [], m: [], o: ["not-a-live-item"] });
  await page.goto(`/for/corrupt#v3.${compressToEncodedURIComponent(JSON.stringify(compact))}`);
  await expect(page.getByRole("heading", { name: "this one cannot be opened." })).toBeVisible();
});

test("keeps non-empty legacy words when an old compact snapshot has an empty text-block list", async ({ page }) => {
  const compact = JSON.parse(decompressFromEncodedURIComponent(LEGACY_HASH.slice(4))!);
  compact[19] = [];
  await page.goto(`/for/legacy-empty-text#v3.${compressToEncodedURIComponent(JSON.stringify(compact))}`);
  await page.getByRole("button", { name: "open it", exact: true }).click();
  await expect(page.locator(".receiver-paper-final")).toContainText("You made the first week in a new place feel familiar.");
});

test("normalizes a legacy text id that collides with the singular photo id", async ({ page }) => {
  const compact = JSON.parse(decompressFromEncodedURIComponent(LEGACY_HASH.slice(4))!);
  compact[19] = [["photo", compact[4], [], [0, 82, -1.5, 1]]];
  await page.goto(`/for/legacy-id-collision#v3.${compressToEncodedURIComponent(JSON.stringify(compact))}`);
  await page.getByRole("button", { name: "open it", exact: true }).click();
  const items = page.locator(".receiver-paper-final [data-item-id]");
  await expect(items).toHaveCount(2);
  const ids = await items.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-item-id")));
  expect(new Set(ids).size).toBe(2);
  await expect(page.locator(".receiver-paper-final .story-layer-photo")).toBeVisible();
  await expect(page.locator(".receiver-paper-final")).toContainText("You made the first week in a new place feel familiar.");
});

test("rejects a rich link when a later photo contains local blob media", async ({ page }) => {
  const compact = JSON.parse(decompressFromEncodedURIComponent(LEGACY_HASH.slice(4))!);
  const textId = compact[19][0][0];
  compact.push({
    p: [
      ["photo-a", { kind: "sample" }, [-34, -176, -3, 1], "tape", ""],
      ["photo-b", { kind: "photo", url: "blob:later-photo" }, [56, -80, 5, .8], "plain", ""],
    ],
    m: [],
    o: [textId, "photo-a", "photo-b"],
  });
  await page.goto(`/for/late-blob#v3.${compressToEncodedURIComponent(JSON.stringify(compact))}`);
  await expect(page.getByRole("heading", { name: "this one cannot be opened." })).toBeVisible();
});

test("keeps a local imported photo ready to prepare and does not make the phone scroll", async ({ page }) => {
  await startComposer(page);
  await page.getByRole("button", { name: "add", exact: true }).click();
  await page.getByRole("button", { name: "photo", exact: true }).click();
  await page.getByLabel("Choose a photo or video").setInputFiles({
    name: "moment.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
  });
  const photo = page.locator('[data-item-kind="photo"]');
  await expect(photo).toHaveCount(1);
  await photo.click();
  await expect(page.getByRole("region", { name: "Customise selected item" })).toBeVisible();
  expect(await page.locator("[data-phone-screen]").evaluate((screen) => screen.scrollTop)).toBe(0);
  await continueToHandoff(page);
  await expect(page.getByRole("button", { name: "Copy generated receiver link" })).toHaveCount(0);
  await expect(page.locator(".private-link span")).toContainText("1 photo");
  await expect(page.locator(".private-link span")).toContainText("ready to prepare");
  await expect(page.getByRole("button", { name: "review local media", exact: true })).toBeVisible();
});

test("keeps selected-item controls within a coarse-pointer 390 by 844 phone viewport", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await startComposer(page);
    await addSamplePhoto(page);
    await page.locator('[data-item-kind="photo"]').click();
    const tools = page.getByRole("region", { name: "Customise selected item" });
    await expect(tools).toBeVisible();
    const bounds = await tools.boundingBox();
    expect(bounds).not.toBeNull();
    expect((bounds?.y ?? 845) + (bounds?.height ?? 0)).toBeLessThanOrEqual(844);
    expect(await page.locator("[data-phone-screen]").evaluate((screen) => screen.scrollTop)).toBe(0);
  } finally { await context.close(); }
});

test("keeps the selected canonical text between the top bar and its compact dock without mutating its saved layout", async ({ browser }) => {
  const devices = [
    { name: "desktop", options: { viewport: { width: 1100, height: 1100 } } },
    { name: "coarse phone", options: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ] as const;

  for (const device of devices) {
    const context = await browser.newContext(device.options);
    const page = await context.newPage();
    try {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/demo/create");
      await page.getByRole("button", { name: "make it for them" }).click();
      await page.getByRole("button", { name: "create something" }).click();
      await page.getByRole("button", { name: "Start making for Maya" }).click();

      const text = page.locator('[data-item-kind="text"]').first();
      const layout = await text.getAttribute("data-layout");
      await text.click();
      const topBar = page.locator(".story-topbar");
      const dock = page.getByRole("region", { name: "Customise selected item" });
      await expect(dock).toBeVisible();
      await expect.poll(async () => {
        const [piece, bar, controls] = await Promise.all([text.boundingBox(), topBar.boundingBox(), dock.boundingBox()]);
        if (!piece || !bar || !controls) return false;
        return piece.y >= bar.y + bar.height + 36 && piece.y + piece.height <= controls.y - 20;
      }, { message: `${device.name} selected text should settle in the visible paper window` }).toBe(true);

      await page.screenshot({ path: test.info().outputPath(`${device.name.replace(" ", "-")}-selected-note.png`) });
      await page.getByRole("button", { name: "Done customising" }).click();
      await expect(text).toHaveAttribute("data-layout", layout!);
      await page.goto("/demo/receive");
      await page.getByRole("button", { name: "open it", exact: true }).click();
      const receivedNote = page.locator(".receiver-paper-final .story-layer-text .story-layer-paper");
      await expect(receivedNote).toBeVisible();
      await expect.poll(async () => {
        const [note, action] = await Promise.all([receivedNote.boundingBox(), page.getByRole("button", { name: "what should this become?", exact: true }).boundingBox()]);
        return Boolean(note && action && note.y + note.height < action.y);
      }, { message: `${device.name} complete receiver note stays above its action` }).toBe(true);
      await page.screenshot({ path: test.info().outputPath(`${device.name.replace(" ", "-")}-receiver.png`) });
    } finally { await context.close(); }
  }
});
