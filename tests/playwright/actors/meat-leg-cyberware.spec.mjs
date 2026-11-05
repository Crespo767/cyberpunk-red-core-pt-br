import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  closeAndReopenActorSheet,
  closeDocSheet,
  createDocumentViaUI,
  createItemViaUI,
  dragItemToActorSheet,
  expectSheetRendered,
  openItemSettings,
  resolveYesNo,
  uniqueName,
  yesNoDialog,
} from "../../../tools/playwright/ui/index.mjs";

async function createMeatArmItem(page, name) {
  const itemId = await createItemViaUI(page, { type: "cyberware", name });
  const itemSheetId = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  await openItemSettings(page, itemSheetId);
  await page
    .locator(`#${itemSheetId} select[name="system.type"]`)
    .selectOption("cyberLeg");
  await page
    .locator(`#${itemSheetId} a[data-target="system.isFoundational"]`)
    .click();
  await expect
    .poll(() =>
      page.evaluate((id) => game.items.get(id).system.isFoundational, itemId),
    )
    .toBe(false);
  await page
    .locator(`#${itemSheetId} a[data-target="system.meatArmCompatible"]`)
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        (id) => game.items.get(id).system.meatArmCompatible,
        itemId,
      ),
    )
    .toBe(true);
  await closeDocSheet(page, { collection: "items", id: itemId });
  return itemId;
}

test("character installs meat-leg cyberware with the two-leg limit", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("meat-leg"),
  });
  let sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  const names = [1, 2, 3].map((n) => uniqueName(`meat-leg-${n}`));
  const humanity = () =>
    page.evaluate(
      (id) => game.actors.get(id).system.derivedStats.humanity.max,
      actorId,
    );
  const installDialog = () =>
    page
      .locator(".cpr-dialog")
      .filter({ has: page.locator('select[name="humanityLossType"]') });
  const clickInstall = async (name) => {
    sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="gear"]`).click();
    await page
      .locator(`#${sheetId} li.item`)
      .filter({ hasText: name })
      .locator(".install-remove-cyberware")
      .click();
  };
  const startInstall = async (name) => {
    const itemId = await createMeatArmItem(page, name);
    await dragItemToActorSheet(page, { itemId, sheetId, actorId });
    await clickInstall(name);
  };
  const chooseMeatArm = async () => {
    const dialog = installDialog();
    await expect(dialog).toBeVisible();
    await expect(
      dialog.locator('select[name="foundationalId"] option', {
        hasText: "Meat Leg",
      }),
    ).toHaveCount(1);
    await dialog
      .locator('select[name="foundationalId"]')
      .selectOption({ label: "Meat Leg" });
    await dialog
      .locator('select[name="humanityLossType"]')
      .selectOption("static");
    await dialog.locator('button[data-action="confirm"]').click();
    await expect(dialog).toHaveCount(0);
  };
  const installInMeatArm = async (name) => {
    await startInstall(name);
    await chooseMeatArm();
  };
  const installedRows = (name) =>
    page
      .locator(`#${sheetId} .cyberware-tab li.item`)
      .filter({ hasText: name });

  await test.step("first and second items go into meat legs", async () => {
    await installInMeatArm(names[0]);
    await installInMeatArm(names[1]);
    sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="cyberware"]`).click();
    await expect(installedRows(names[0])).toHaveCount(1);
    await expect(installedRows(names[1])).toHaveCount(1);
  });
  await test.step("a third item finds no free meat leg", async () => {
    await startInstall(names[2]);
    await expect(
      page.getByText("No Foundational Cyberware found for this type."),
    ).toBeVisible();
    await expect(installDialog()).toHaveCount(0);
  });
  await test.step("uninstall from the cyberware tab frees the arm", async () => {
    const before = await humanity();
    sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="cyberware"]`).click();
    await installedRows(names[0]).locator(".install-remove-cyberware").click();
    await resolveYesNo(yesNoDialog(page), "yes");
    sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="cyberware"]`).click();
    await expect(installedRows(names[0])).toHaveCount(0);
    await expect(installedRows(names[1])).toHaveCount(1);
    expect(await humanity()).toBeGreaterThanOrEqual(before);
    await clickInstall(names[2]);
    await chooseMeatArm();
  });
});
