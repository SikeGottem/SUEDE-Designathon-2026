// Covers the canonical sender-to-receiver keepsake flow in the actual prototype app.
import { expect, test, type Page } from "@playwright/test";

const note = "You made the first week in a new place feel familiar.";

async function startSenderFlow(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "make something" }).click();
}

async function reachReceiverArrival(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "view sample arrival" }).click();
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
}

test("requires a specific recipient, reason, and self-authored note before a text-only object can be shared", async ({ page }) => {
  await startSenderFlow(page);

  const writeNote = page.getByRole("button", { name: "write the note" });
  await expect(writeNote).toBeDisabled();

  await page.getByLabel("their name").fill("Maya");
  await expect(writeNote).toBeDisabled();
  await page.getByLabel("what made you think of them?").fill("You made moving feel less scary.");
  await expect(writeNote).toBeEnabled();
  await writeNote.click();

  const addMaterial = page.getByRole("button", { name: "add one thing, or skip" });
  await expect(addMaterial).toBeDisabled();
  await page.getByLabel("your words").fill(note);
  await expect(addMaterial).toBeEnabled();
  await addMaterial.click();

  await expect(page.getByRole("button", { name: "no supporting material" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "preview the object" }).click();
  await expect(page.getByText(note)).toBeVisible();
  await page.getByRole("button", { name: "make a simulated share link" }).click();
  await page.getByRole("button", { name: "simulate link failure" }).click();

  await expect(page.getByRole("heading", { name: "the link was not made" })).toBeVisible();
  await expect(page.getByText("Nothing was sent. Your note and preview are still here in this local prototype.")).toBeVisible();
  await page.getByRole("button", { name: "back to preview" }).click();
  await expect(page.getByText(note)).toBeVisible();

  await page.getByRole("button", { name: "make a simulated share link" }).click();
  await page.getByRole("button", { name: "simulate sharing the link" }).click();
  await expect(page.getByRole("heading", { name: "the giving part is complete" })).toBeVisible();
  await expect(page.getByText(/There is no open, keep, read, reply, or follow-up tracking/)).toBeVisible();
  await expect(page.getByRole("button", { name: /seen|read receipt|reply|follow up/i })).toHaveCount(0);
});

test("lets a receiver defer, reopen, keep, close, cancel discard, discard, and restore without sender feedback", async ({ page }) => {
  await reachReceiverArrival(page);

  await page.getByRole("button", { name: "open another time" }).click();
  await expect(page.getByRole("heading", { name: "left unopened" })).toBeVisible();
  await expect(page.getByText("No signal was sent to Ethan. This private local demo will not remind you.")).toBeVisible();
  await page.getByRole("button", { name: "return to arrival" }).click();

  await page.getByRole("button", { name: "open when ready" }).click();
  await expect(page.getByRole("button", { name: "close for now" })).toBeVisible();
  await page.getByRole("button", { name: "close for now" }).click();
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();

  await page.getByRole("button", { name: "open when ready" }).click();
  await page.getByRole("button", { name: "keep locally" }).click();
  await expect(page.getByRole("heading", { name: "kept is one possible ending" })).toBeVisible();
  await expect(page.getByText("It is not a signal to the sender.")).toBeVisible();
  await page.getByRole("button", { name: "close the keepsake" }).click();

  const keptObject = page.getByRole("button", { name: /kept locally by the receiver/ });
  await expect(keptObject).toBeVisible();
  await keptObject.click();
  await page.getByRole("button", { name: "discard local copy" }).click();
  await expect(page.getByText("Discard this local prototype copy? The sender will not be told.")).toBeVisible();
  await page.getByRole("button", { name: "cancel" }).click();
  await expect(page.getByRole("heading", { name: "kept is one possible ending" })).toBeVisible();

  await page.getByRole("button", { name: "discard local copy" }).click();
  await page.getByRole("button", { name: "discard local copy" }).last().click();
  await expect(page.getByRole("heading", { name: "local copy removed" })).toBeVisible();
  await page.getByRole("button", { name: "restore simulated object" }).click();
  await expect(page.getByRole("heading", { name: "you’ve got something from Ethan." })).toBeVisible();
});

test("keeps keyboard focus visibly indicated on an app control", async ({ page }) => {
  await page.goto("/");
  const makeSomething = page.getByRole("button", { name: "make something" });
  await makeSomething.focus();

  await expect(makeSomething).toBeFocused();
  const focusStyle = await makeSomething.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
});
