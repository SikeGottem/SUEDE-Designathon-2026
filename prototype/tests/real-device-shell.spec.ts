// Verifies the runtime swaps its emulator shell for a clean edge-to-edge real-device experience.
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

type ContextOptions = Parameters<Browser["newContext"]>[0];

async function openApp(browser: Browser, options: ContextOptions): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".phone-stage")).toBeVisible();
  return { context, page };
}

async function expectEdgeToEdgeShell(page: Page) {
  const stage = page.locator(".phone-stage");
  const screen = page.getByTestId("device-screen");
  await expect(stage).toHaveAttribute("data-runtime-mode", "edge-to-edge");

  const [screenBox, viewport] = await Promise.all([
    screen.boundingBox(),
    page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight })),
  ]);
  if (!screenBox) throw new Error("Edge-to-edge device screen is not measurable");
  expect(screenBox.x).toBeLessThanOrEqual(2);
  expect(screenBox.y).toBeLessThanOrEqual(2);
  expect(screenBox.width).toBeGreaterThanOrEqual(viewport.width - 2);
  expect(screenBox.height).toBeGreaterThanOrEqual(viewport.height - 2);

  await expect(page.locator(".phone-bezel")).toHaveCount(0);
  await expect(page.getByTestId("device-picker")).toHaveCount(0);
  await expect(page.getByTestId("status-indicators")).toHaveCount(0);
  await expect(page.locator(".status-bar")).toHaveCount(0);
  await expect(page.getByTestId("home-indicator")).toHaveCount(0);
  await expect(page.getByTestId("android-navigation-bar")).toHaveCount(0);
  await expect(page.getByTestId("device-camera")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cursor")).toHaveCount(0);
}

test("uses the edge-to-edge shell for a coarse touch portrait device", async ({ browser }) => {
  const { context, page } = await openApp(browser, {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  try {
    await expect.poll(() => page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    await expectEdgeToEdgeShell(page);
  } finally {
    await context.close();
  }
});

test("keeps the edge-to-edge shell in mobile landscape", async ({ browser }) => {
  const { context, page } = await openApp(browser, {
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  try {
    await expectEdgeToEdgeShell(page);
  } finally {
    await context.close();
  }
});

test("keeps the framed emulator controls on a desktop canvas", async ({ browser }) => {
  const { context, page } = await openApp(browser, { viewport: { width: 1100, height: 1100 } });
  try {
    await expect(page.locator(".phone-stage")).toHaveAttribute("data-runtime-mode", "emulator");
    await expect(page.getByTestId("phone-frame")).toBeVisible();
    await expect(page.locator(".phone-bezel")).toBeVisible();
    await expect(page.getByTestId("device-picker")).toBeVisible();
    await expect(page.getByTestId("status-indicators")).toBeVisible();
    await expect(page.getByTestId("home-indicator")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("does not mistake a narrow non-touch desktop for a real device", async ({ browser }) => {
  const { context, page } = await openApp(browser, {
    viewport: { width: 390, height: 844 },
    isMobile: false,
    hasTouch: false,
  });
  try {
    await expect.poll(() => page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(false);
    await expect(page.locator(".phone-stage")).toHaveAttribute("data-runtime-mode", "emulator");
    await expect(page.locator(".phone-bezel")).toBeVisible();
    await expect(page.getByTestId("device-picker")).toBeVisible();
    await expect(page.getByTestId("status-indicators")).toBeVisible();
    await expect(page.getByTestId("home-indicator")).toBeVisible();
  } finally {
    await context.close();
  }
});
