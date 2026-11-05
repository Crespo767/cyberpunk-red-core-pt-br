import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  addModViaUI,
  closeActiveEffectConfigViaUI,
  closeAndReopenActorSheet,
  closeDocSheet,
  createDocumentViaUI,
  createEffectViaUI,
  createItemViaUI,
  dismissNotifications,
  dragItemToActorSheet,
  expectSheetRendered,
  openItemSettings,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";

/**
 * World cyberware in the External core container, carrying a +3 Max HP effect.
 * Prerequisites have no editing UI yet (read-only summary on the item sheet),
 * so they are set through the data API.
 */
async function createCyberwareWithEffect(page, { name, prerequisites }) {
  const itemId = await createItemViaUI(page, { type: "cyberware", name });
  const sheetId = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  const sheet = page.locator(`#${sheetId}`);
  await openItemSettings(page, sheetId);
  await sheet
    .locator('select[name="system.type"]')
    .selectOption("cyberwareExternal");
  // External cyberware is never foundational: the sheet clears the flag itself.
  await expect
    .poll(() =>
      page.evaluate((id) => game.items.get(id).system.isFoundational, itemId),
    )
    .toBe(false);

  await sheet.locator('.navtabs-item [data-tab="item-effects"]').click();
  const { aeConfig, effectId } = await createEffectViaUI(page, sheet, {
    ownerType: "item",
    ownerId: itemId,
  });
  await aeConfig.locator('nav [data-tab="changes"]').click();
  const row = await addModViaUI(aeConfig);
  await row.locator(".key-cat").selectOption("combat");
  await row.locator("select.key-key").selectOption("bonuses.maxHp");
  const value = aeConfig.locator('input[name="changes.0.value"]');
  await value.fill("3");
  await value.press("Tab");
  await page.waitForFunction(
    ({ id, eid }) =>
      game.items.get(id).effects.get(eid).changes[0].value === "3",
    { id: itemId, eid: effectId },
  );
  await closeActiveEffectConfigViaUI(page, aeConfig);

  await page.evaluate(
    ({ id, prerequisites: p }) =>
      game.items.get(id).update({ "system.prerequisites": p }),
    { id: itemId, prerequisites },
  );
  await closeDocSheet(page, { collection: "items", id: itemId });
  return itemId;
}

async function installIntoExternal(page, { actorId, sheetId, itemId, name }) {
  await dragItemToActorSheet(page, { itemId, sheetId, actorId });
  const freshId = await closeAndReopenActorSheet(page, actorId);
  await page.locator(`#${freshId} a[data-tab="gear"]`).click();
  await dismissNotifications(page);
  await page
    .locator(`#${freshId} li.item`)
    .filter({ hasText: name })
    .locator(".install-remove-cyberware")
    .click();
  const dialog = page
    .locator(".cpr-dialog")
    .filter({ has: page.locator('select[name="humanityLossType"]') });
  await expect(dialog).toBeVisible();
  await dialog.locator('select[name="humanityLossType"]').selectOption("none");
  await dialog.locator('button[data-action="confirm"]').click();
  await expect(dialog).toHaveCount(0);
  return freshId;
}

const ownedState = (page, actorId, name) =>
  page.evaluate(
    ({ actorId: id, name: n }) => {
      const item = game.actors.get(id).items.find((i) => i.name === n);
      return {
        installed: item.system.isInstalled,
        suppressed: item.effects.contents[0].system.isSuppressed,
      };
    },
    { actorId, name },
  );

test("a missing prerequisite warns, still installs and suppresses the effect", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("prereq-missing"),
  });
  let sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  const name = uniqueName("needs-neural-link");
  const itemId = await createCyberwareWithEffect(page, {
    name,
    prerequisites: { foundationalTypes: ["neuralWare"] },
  });

  await test.step("install warns about the missing Neural Link", async () => {
    sheetId = await installIntoExternal(page, {
      actorId,
      sheetId,
      itemId,
      name,
    });
    await expect(
      page
        .locator(".notification.warning")
        .filter({ hasText: "Prerequisites" }),
    ).toHaveCount(1);
  });

  await test.step("the piece is installed but its effect is suppressed", async () => {
    expect(await ownedState(page, actorId, name)).toEqual({
      installed: true,
      suppressed: true,
    });
    sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="cyberware"]`).click();
    await expect(
      page
        .locator(`#${sheetId} .cyberware-tab li.item`)
        .filter({ hasText: name })
        .locator(".fa-triangle-exclamation"),
    ).toHaveCount(1);
  });
});

test("a met prerequisite installs silently and keeps the effect", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("prereq-met"),
  });
  const sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  const name = uniqueName("needs-external");
  const itemId = await createCyberwareWithEffect(page, {
    name,
    // Every new character has the External core container installed.
    prerequisites: { foundationalTypes: ["cyberwareExternal"] },
  });

  await installIntoExternal(page, { actorId, sheetId, itemId, name });
  await expect(
    page.locator(".notification.warning").filter({ hasText: "Prerequisites" }),
  ).toHaveCount(0);
  expect(await ownedState(page, actorId, name)).toEqual({
    installed: true,
    suppressed: false,
  });
});
