// Guards the 6 September visual-feedback changes with semantic interaction and layout assertions.
import { expect, test, type Page } from "@playwright/test";

async function openEnvelope(page: Page) {
  await page.goto("/?screen=envelope");
  await expect(page.getByRole("button", { name: "choose how it travels" })).toBeVisible();
}

test.describe("visual-feedback regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("centres the personal stamp over the envelope closure", async ({ page }) => {
    await openEnvelope(page);

    const envelope = page.locator('[data-asset-slot="envelope-exterior"]');
    const stamp = page.getByRole("button", { name: "Draw your personal stamp" });
    await expect(envelope).toBeVisible();
    await expect(stamp).toBeVisible();

    const [envelopeBox, stampBox] = await Promise.all([envelope.boundingBox(), stamp.boundingBox()]);
    expect(envelopeBox).not.toBeNull();
    expect(stampBox).not.toBeNull();
    if (!envelopeBox || !stampBox) return;

    const closureX = envelopeBox.x + envelopeBox.width / 2;
    const closureY = envelopeBox.y + envelopeBox.height * 0.55;
    const stampX = stampBox.x + stampBox.width / 2;
    const stampY = stampBox.y + stampBox.height / 2;
    expect(Math.abs(stampX - closureX)).toBeLessThan(envelopeBox.width * 0.16);
    expect(Math.abs(stampY - closureY)).toBeLessThan(envelopeBox.height * 0.18);
  });

  for (const horizontalPosition of [0.16, 0.84]) {
    test(`the ${horizontalPosition < 0.5 ? "left" : "right"} side of the travel action advances normally`, async ({ page }) => {
      await openEnvelope(page);
      const travel = page.getByRole("button", { name: "choose how it travels" });
      const box = await travel.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;

      await page.mouse.click(box.x + box.width * horizontalPosition, box.y + box.height / 2);
      await expect(page.getByText("pick how it arrives.", { exact: true })).toBeVisible();
    });
  }

  test("keeps the reeds on home and reserves the hub for its large firefly entrance", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-reeds")).toBeVisible();

    await page.getByRole("button", { name: "make it for them" }).click();
    await expect(page.getByTestId("hub-firefly")).toBeVisible();
    await expect(page.getByTestId("hub-pattern")).toBeVisible();
    await expect(page.getByTestId("home-reeds")).toHaveCount(0);
  });
});

test("shows completion actions only after the courier departure has had time to land", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?screen=sent");

  const makeAnother = page.getByRole("button", { name: "make another" });
  const leave = page.getByRole("button", { name: "leave" });
  await expect(makeAnother).toBeHidden();
  await expect(leave).toBeHidden();

  await expect(makeAnother).toBeVisible({ timeout: 7_000 });
  await expect(leave).toBeVisible({ timeout: 7_000 });
});
