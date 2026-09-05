// Covers the post-annotation scene, asset, motion, and envelope-layout corrections.
import { expect, test, type Locator } from "@playwright/test";

const COLLECTION = "/assets/illustrations/cecilia-collection/";

async function box(locator: Locator) {
  const result = await locator.boundingBox();
  expect(result).not.toBeNull();
  if (!result) throw new Error("Expected visible element to have a bounding box.");
  return result;
}

function overlaps(first: { x: number; y: number; width: number; height: number }, second: { x: number; y: number; width: number; height: number }) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
}

test.describe("annotated visual feedback", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("keeps the bottle receiver sun fully within the 393 by 852 app screen", async ({ page }) => {
    await page.goto("/?screen=arrival");

    const screen = await box(page.getByTestId("device-screen"));
    const sun = await box(page.locator('[data-asset-slot="arrival-sun"]'));
    expect(screen.width).toBe(393);
    expect(screen.height).toBe(852);
    expect(sun.x).toBeGreaterThanOrEqual(screen.x);
    expect(sun.y).toBeGreaterThanOrEqual(screen.y);
    expect(sun.x + sun.width).toBeLessThanOrEqual(screen.x + screen.width);
    expect(sun.y + sun.height).toBeLessThanOrEqual(screen.y + screen.height);
  });

  test("uses the authored firefly mesh rather than repeated outline figures on the hub", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "make it for them" }).click();

    const pattern = page.getByTestId("hub-pattern");
    await expect(pattern.locator(`img[src="${COLLECTION}couriers/firefly-mesh.png"]`)).toBeVisible();
    await expect(pattern.locator(`img[src="${COLLECTION}couriers/firefly-outline.png"]`)).toHaveCount(0);
  });

  test("shows a winged, coloured authored firefly when that carrier is selected", async ({ page }) => {
    await page.goto("/?screen=carrier");
    await page.getByRole("radio", { name: "firefly", exact: true }).click();

    const selectedArt = page.locator(".hero-carrier img");
    await expect(selectedArt).toBeVisible();
    await expect(selectedArt).toHaveAttribute(
      "src",
      new RegExp(`${COLLECTION}couriers/firefly-filled-[ab]\\.png$`),
    );
  });

  test("sends the bottle on a vertical, unrotated path", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/?screen=sent");

    const bottle = page.locator(".sent-carrier-departure-bottle");
    await expect(bottle).toBeVisible();
    await page.waitForTimeout(650);
    const start = await box(bottle);
    const startMatrix = await bottle.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      const matrix = new DOMMatrixReadOnly(transform === "none" ? undefined : transform);
      return { b: matrix.b, c: matrix.c };
    });
    await page.waitForTimeout(2_000);
    const middle = await box(bottle);
    const middleMatrix = await bottle.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      const matrix = new DOMMatrixReadOnly(transform === "none" ? undefined : transform);
      return { b: matrix.b, c: matrix.c };
    });

    // The visible object must travel vertically, not read as a bobbing or diagonal route.
    expect(Math.abs(middle.x - start.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(middle.y - start.y)).toBeGreaterThan(12);
    for (const matrix of [startMatrix, middleMatrix]) {
      expect(Math.abs(matrix.b)).toBeLessThanOrEqual(0.01);
      expect(Math.abs(matrix.c)).toBeLessThanOrEqual(0.01);
    }
  });

  test("builds the plane send scene from separate cloud elements", async ({ page }) => {
    await page.goto("/?screen=carrier");
    await page.getByRole("radio", { name: "plane", exact: true }).click();
    await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
    await page.getByRole("button", { name: "give this privately", exact: true }).click();
    await page.getByRole("button", { name: "Copy generated receiver link" }).click();
    await page.getByRole("button", { name: "finish giving", exact: true }).click();
    // The scene needs independent cloud pieces, rather than one pre-composed cloud backdrop.
    const clouds = page.locator('[data-asset-slot="plane-cloud"]');
    await expect(clouds).toHaveCount(3);
    const cloudBoxes = await Promise.all([0, 1, 2].map((index) => box(clouds.nth(index))));
    expect(overlaps(cloudBoxes[0], cloudBoxes[1])).toBeFalsy();
    expect(overlaps(cloudBoxes[0], cloudBoxes[2])).toBeFalsy();
    expect(overlaps(cloudBoxes[1], cloudBoxes[2])).toBeFalsy();
  });

  test("centres the envelope stamp and keeps its lower helper, choices, and CTA separate", async ({ page }) => {
    await page.goto("/?screen=envelope");
    await expect(page.getByRole("button", { name: "choose how it travels" })).toBeVisible();

    const envelope = await box(page.locator('[data-asset-slot="envelope-exterior"]'));
    const stamp = await box(page.getByRole("button", { name: "Draw your personal stamp" }));
    const helperAndChoices = await box(page.locator(".envelope-stamp-choice"));
    const cta = await box(page.getByRole("button", { name: "choose how it travels" }));
    expect(Math.abs((stamp.x + stamp.width / 2) - (envelope.x + envelope.width / 2))).toBeLessThan(envelope.width * 0.16);
    expect(Math.abs((stamp.y + stamp.height / 2) - (envelope.y + envelope.height * 0.55))).toBeLessThan(envelope.height * 0.18);
    expect(overlaps(helperAndChoices, cta)).toBeFalsy();
  });
});
