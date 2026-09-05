// Guards the authored Cecilia collection in semantic product slots without turning visual direction into pixel snapshots.
import { expect, test, type Locator, type Page } from "@playwright/test";

const COLLECTION = "/assets/illustrations/cecilia-collection/";

const carrierAssets = {
  bottle: "containers/bottle-classic.png",
  firefly: "couriers/firefly-outline.png",
  plane: "containers/paper-plane.png",
} as const;

async function expectAuthoredAsset(locator: Locator, relativePath: string) {
  await expect(locator).toBeVisible();
  await expect(locator).toHaveAttribute("src", new RegExp(`${COLLECTION}${relativePath.replace(/[.]/g, "\\.")}$`));
}

async function selectCarrierAndReachHandoff(page: Page, carrier: keyof typeof carrierAssets) {
  await page.goto("/?screen=carrier");
  await page.getByRole("radio", { name: carrier, exact: true }).click();
  await expect(page.getByRole("radio", { name: carrier, exact: true })).toHaveAttribute("aria-checked", "true");
  await expectAuthoredAsset(page.locator(".hero-carrier img"), carrierAssets[carrier]);

  await page.getByRole("button", { name: "see it ready to give", exact: true }).click();
  await expectAuthoredAsset(page.locator(".sealed-envelope-source"), "containers/envelope-outline.png");
  await page.getByRole("button", { name: "give this privately", exact: true }).click();
  await expectAuthoredAsset(page.locator(".handoff-object img"), carrierAssets[carrier]);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("places the authored firefly, envelope, and seal assets in their product slots", async ({ page }) => {
  await page.goto("/");
  await expectAuthoredAsset(page.locator('[data-asset-slot="home-bee"]'), "couriers/firefly-outline.png");

  await page.goto("/?screen=envelope");
  await expectAuthoredAsset(page.locator(".envelope-canvas-source"), "containers/envelope-outline.png");
  await expect(page.locator(`img[src*="${COLLECTION}seals/"]`).first()).toBeVisible();
});

test("each authored carrier remains selectable through ready-to-give handoff", async ({ page }) => {
  for (const carrier of Object.keys(carrierAssets) as Array<keyof typeof carrierAssets>) {
    await selectCarrierAndReachHandoff(page, carrier);
  }
});

test("the firefly delivery state uses the authored carrying courier", async ({ page }) => {
  await selectCarrierAndReachHandoff(page, "firefly");
  await page.getByRole("button", { name: "Copy generated receiver link" }).click();
  await page.getByRole("button", { name: "finish giving", exact: true }).click();

  await expect(page.locator(".sent-delivery-stage")).toHaveAttribute("data-carrier", "firefly");
  await expectAuthoredAsset(page.locator('[data-asset-slot="firefly-carrying-letter"]'), "couriers/firefly-carrying.png");
  await expect(page.locator(".delivery-mascot-letter")).toHaveCount(0);
});
