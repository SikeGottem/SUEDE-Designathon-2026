// Verifies uninterrupted carrier identity, paper-fold completion, and live reduced-motion changes.
import { expect, test } from "@playwright/test";

test("keeps one arrival carrier node through travel and only offers opening once it has settled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=arrival");

  const carrier = page.locator(".arrival-carrier-button");
  await expect(carrier).toBeVisible();
  await expect(page.locator("[data-arrival-state='travelling']")).toBeVisible();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toHaveCount(0);
  await carrier.evaluate((element) => { (window as Window & { arrivalCarrier?: Element }).arrivalCarrier = element; });

  await expect(page.locator("[data-arrival-state='landed']")).toBeVisible();
  await expect(carrier).toBeEnabled();
  await expect(carrier).toBeInViewport();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toBeVisible();
  expect(await carrier.evaluate((element) => element === (window as Window & { arrivalCarrier?: Element }).arrivalCarrier)).toBe(true);
});

test("switching to reduced motion mid-arrival settles immediately and does not replay on switch-back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=arrival");
  await expect(page.locator("[data-arrival-state='travelling']")).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-arrival-state='landed']")).toBeVisible({ timeout: 800 });
  await expect(page.locator(".arrival-carrier-button")).toBeInViewport();
  await expect(page.getByRole("button", { name: "open it", exact: true })).toBeVisible();
  await expect(page.locator(".arrival-courier-motion")).toHaveCount(0);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-arrival-state='landed']")).toBeVisible();
  await expect(page.locator(".arrival-courier-motion")).toHaveCount(0);
});

test("switching to reduced motion mid-fold opens the same received paper without a fold duplicate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=opening");

  const finalPaper = page.locator(".receiver-paper-final .authored-paper");
  const receivedCopy = await finalPaper.textContent();
  expect(receivedCopy?.trim()).toBeTruthy();
  await expect(page.locator("[data-opening-state='folding']")).toBeVisible();
  await expect(page.locator(".receiver-fold-panels")).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-opening-state='opened']")).toBeVisible({ timeout: 800 });
  await expect(page.locator(".receiver-fold-panels")).toHaveCount(0);
  await expect(page.locator(".opening-sealed-object")).toHaveCount(0);
  await expect(finalPaper).toBeVisible();
  await expect(finalPaper).toHaveText(receivedCopy ?? "");
  await expect(page.getByRole("button", { name: "what should this become?", exact: true })).toBeVisible();
});

test("the sender fold reaches the stamp workbench on a direct entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=envelope");
  await expect(page.locator(".paper-fold-fold")).toBeVisible();
  await expect(page.getByRole("button", { name: "choose how it travels", exact: true })).toBeVisible();
  await expect(page.locator(".paper-fold-fold")).toHaveCount(0);
});

test("the receiver unfolds exact paper at full size before exposing its controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Capture ephemeral geometry in the browser before network/load timing can outlast the fold.
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const finalPaper = document.querySelector<HTMLElement>(".receiver-paper-final .authored-paper");
      const panels = Array.from(document.querySelectorAll<HTMLElement>(".paper-fold-face > .authored-paper"));
      if (!finalPaper?.clientHeight || panels.length !== 3 || panels.some((panel) => !panel.clientHeight)) return;
      (window as Window & { foldGeometry?: unknown }).foldGeometry = {
        text: finalPaper.textContent,
        width: finalPaper.clientWidth,
        height: finalPaper.clientHeight,
        panels: panels.map((panel) => ({ text: panel.textContent, width: panel.clientWidth, height: panel.clientHeight })),
      };
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/?screen=opening");
  const geometry = await page.evaluate(() => (window as Window & { foldGeometry?: {
    text: string; width: number; height: number; panels: { text: string; width: number; height: number }[];
  } }).foldGeometry);
  expect(geometry).toBeTruthy();
  expect(geometry!.text.trim()).toBeTruthy();
  for (const panel of geometry!.panels) {
    expect(panel.text).toBe(geometry!.text);
    expect(panel.width).toBeCloseTo(geometry!.width, 0);
    expect(panel.height).toBeCloseTo(geometry!.height, 0);
  }
  await expect(page.locator("[data-opening-state='opened']")).toBeVisible();
  await expect(page.locator(".receiver-fold-panels")).toHaveCount(0);
  await expect(page.locator(".receiver-paper-final .authored-paper")).toHaveText(geometry!.text);
  await expect(page.getByRole("button", { name: "what should this become?", exact: true })).toBeVisible();
});

test("switching to reduced motion while sealing completes the fold without replay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=envelope");
  await expect(page.locator(".paper-fold-fold")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "choose how it travels", exact: true })).toBeVisible({ timeout: 800 });
  await expect(page.locator(".paper-fold-fold")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".paper-fold-fold")).toHaveCount(0);
});

for (const carrier of ["bottle", "firefly", "plane"] as const) {
  test(`${carrier} departure finishes before sender actions and arrival keeps its object`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => undefined } }); });
    await page.goto("/?screen=carrier");
    await page.getByRole("radio", { name: carrier, exact: true }).click();
    await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
    await page.getByRole("button", { name: "give this privately", exact: true }).click();
    const url = await page.getByRole("textbox", { name: "Receiver link" }).inputValue();
    await page.getByRole("button", { name: "Copy generated receiver link" }).click();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "finish giving", exact: true }).click();
    await expect(page.locator(".sent-completion")).toHaveCount(0);
    await expect(page.locator(".sent-completion")).toBeVisible({ timeout: 9000 });
    const receiver = await context.newPage();
    await receiver.emulateMedia({ reducedMotion: "no-preference" });
    await receiver.goto(url);
    const arriving = receiver.locator(".arrival-carrier-button");
    await arriving.evaluate((element) => { (window as Window & { arrivalCarrier?: Element }).arrivalCarrier = element; });
    await expect(receiver.getByRole("button", { name: "open it", exact: true })).toBeVisible();
    expect(await arriving.evaluate((element) => element === (window as Window & { arrivalCarrier?: Element }).arrivalCarrier)).toBe(true);
    if (carrier === "plane") await expect(receiver.locator(".arrival-plane-cloud")).toHaveCount(3);
    await receiver.close();
  });
}

test("switching to reduced motion during departure exposes completion without restarting the journey", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=sent");
  await expect(page.locator('[data-delivery-stage="departing"]')).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-delivery-stage="complete"]')).toBeVisible({ timeout: 800 });
  await expect(page.getByRole("button", { name: "make another one…", exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator('[data-delivery-stage="complete"]')).toBeVisible();
  await expect(page.locator(".sent-carrier-departure")).toHaveCount(0);
});
