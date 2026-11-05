import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  closeAndReopenActorSheet,
  closeDocSheet,
  closeOwnedItemSheet,
  createDocumentViaUI,
  createItemViaUI,
  dragItemToActorSheet,
  expectSheetRendered,
  openItemSettings,
  openOwnedItemSheet,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";
import {
  openInstallCyberwareDialog,
  confirmInstallCyberwareDialog,
} from "./mook-sheet-helpers.mjs";

test("cyberware prerequisites can be edited and persist", async ({ page }) => {
  await gotoReadyWorld(page);
  const id = await createItemViaUI(page, {
    type: "cyberware",
    name: uniqueName("prerequisite-editor"),
  });
  let sheetId = await expectSheetRendered(page, { collection: "items", id });
  await openItemSettings(page, sheetId);
  let sheet = page.locator(`#${sheetId}`);
  await sheet.locator('[data-prerequisite-type="neuralWare"]').check();
  await expect
    .poll(() =>
      page.evaluate(
        (itemId) =>
          game.items.get(itemId).system.prerequisites.foundationalTypes,
        id,
      ),
    )
    .toEqual(["neuralWare"]);
  await sheet.locator('input[name="system.prerequisites.paired"]').check();
  await expect
    .poll(() =>
      page.evaluate(
        (itemId) => game.items.get(itemId).system.prerequisites.paired,
        id,
      ),
    )
    .toEqual(true);
  // The previous change re-renders the sheet; an edit made on the outgoing DOM
  // is lost, so retry the edit until it is saved.
  await expect(async () => {
    const minBody = sheet.locator('input[name="system.prerequisites.minBody"]');
    await minBody.fill("6");
    await minBody.press("Tab");
    expect(
      await page.evaluate(
        (itemId) => game.items.get(itemId).system.prerequisites.minBody,
        id,
      ),
    ).toBe(6);
  }).toPass({ timeout: 15000 });
  await sheet
    .locator('select[name="system.prerequisites.host"]')
    .selectOption("IJarQGKk5rPayoLT");
  await expect
    .poll(() =>
      page.evaluate(
        (itemId) => game.items.get(itemId).system.prerequisites.host,
        id,
      ),
    )
    .toBe("IJarQGKk5rPayoLT");
  await closeDocSheet(page, { collection: "items", id });
  await page.evaluate(
    (itemId) => game.items.get(itemId).sheet.render(true),
    id,
  );
  sheetId = await expectSheetRendered(page, { collection: "items", id });
  await openItemSettings(page, sheetId);
  sheet = page.locator(`#${sheetId}`);
  await expect(
    sheet.locator('[data-prerequisite-type="neuralWare"]'),
  ).toBeChecked();
  await expect(
    sheet.locator('input[name="system.prerequisites.paired"]'),
  ).toBeChecked();
  await expect(
    sheet.locator('input[name="system.prerequisites.minBody"]'),
  ).toHaveValue("6");
  await expect(
    sheet.locator('select[name="system.prerequisites.host"]'),
  ).toHaveValue("IJarQGKk5rPayoLT");
});

/** World neuralware built through the item sheet; returns its id. */
async function createNeuralware(page, { name, foundational, slots = 0 }) {
  // Create under a unique name (the helper looks documents up by name), then
  // rename to the exact English name the system recognizes.
  const itemId = await createItemViaUI(page, {
    type: "cyberware",
    name: uniqueName(name),
  });
  const sheetId = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  const sheet = page.locator(`#${sheetId}`);
  const read = (path) =>
    page.evaluate(
      ({ id, p }) => foundry.utils.getProperty(game.items.get(id), p),
      { id: itemId, p: path },
    );
  await openItemSettings(page, sheetId);
  await expect(async () => {
    const nameInput = sheet.locator('input[name="name"]').first();
    await nameInput.fill(name);
    await nameInput.press("Tab");
    expect(await read("name")).toBe(name);
  }).toPass({ timeout: 15000 });
  await sheet.locator('select[name="system.type"]').selectOption("neuralWare");
  await expect.poll(() => read("system.type")).toBe("neuralWare");
  if (!foundational) {
    await sheet.locator('a[data-target="system.isFoundational"]').click();
    await expect.poll(() => read("system.isFoundational")).toBe(false);
  }
  if (slots) {
    if (!(await read("system.installedItems.allowed"))) {
      await sheet
        .locator('a[data-target="system.installedItems.allowed"]')
        .click();
      await expect.poll(() => read("system.installedItems.allowed")).toBe(true);
    }
    const input = sheet.locator('input[name="system.installedItems.slots"]');
    await input.fill(String(slots));
    await input.press("Tab");
    await expect.poll(() => read("system.installedItems.slots")).toBe(slots);
  }
  await closeDocSheet(page, { collection: "items", id: itemId });
  return itemId;
}

const installDialog = (page) =>
  page
    .locator(".cpr-dialog")
    .filter({ has: page.locator('select[name="humanityLossType"]') });

/** Click install on an owned cyberware row and confirm into `targetName`. */
async function installOwned(page, { actorId, name, targetName }) {
  const sheetId = await closeAndReopenActorSheet(page, actorId);
  await page.locator(`#${sheetId} a[data-tab="gear"]`).click();
  await page
    .locator(`#${sheetId} li.item`)
    .filter({ hasText: name })
    .locator(".install-remove-cyberware")
    .click();
  const dialog = installDialog(page);
  await expect(dialog).toBeVisible();
  if (targetName) {
    await dialog
      .locator('select[name="foundationalId"]')
      .selectOption({ label: targetName });
  }
  await dialog.locator('select[name="humanityLossType"]').selectOption("none");
  await dialog.locator('button[data-action="confirm"]').click();
  await expect(dialog).toHaveCount(0);
}

async function dropOnCharacter(page, { actorId, itemId }) {
  const sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  await dragItemToActorSheet(page, { itemId, sheetId, actorId });
}

test("a Skill Chip in a Chipware Socket raises its skill to 3", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("skill-chip"),
  });
  // Names match the core items by English name, like copies without a source.
  const linkId = await createNeuralware(page, {
    name: "Neural Link",
    foundational: true,
    slots: 5,
  });
  await dropOnCharacter(page, { actorId, itemId: linkId });
  await installOwned(page, { actorId, name: "Neural Link" });
  const socketId = await createNeuralware(page, {
    name: "Chipware Socket",
    foundational: false,
    slots: 1,
  });
  await dropOnCharacter(page, { actorId, itemId: socketId });
  await installOwned(page, {
    actorId,
    name: "Chipware Socket",
    targetName: "Neural Link",
  });
  const chipId = await createNeuralware(page, {
    name: "Skill Chip",
    foundational: false,
  });
  await dropOnCharacter(page, { actorId, itemId: chipId });

  const level = () =>
    page.evaluate((id) => {
      const actor = game.actors.get(id);
      return {
        stored: actor.itemTypes.skill.find((s) => s.name === "Athletics").system
          .level,
        effective: actor.getSkillLevel("Athletics"),
      };
    }, actorId);
  const before = await level();
  expect(before.stored).toBeLessThan(3);

  await test.step("pick Athletics on the owned chip and install it", async () => {
    const ownedId = await page.evaluate(
      (id) => game.actors.get(id).items.find((i) => i.name === "Skill Chip").id,
      actorId,
    );
    await page.evaluate(
      ({ a, i }) => game.actors.get(a).items.get(i).sheet.render(true),
      { a: actorId, i: ownedId },
    );
    const chipSheetId = await openOwnedItemSheet(page, {
      actorId,
      itemId: ownedId,
    });
    await openItemSettings(page, chipSheetId);
    await page
      .locator(`#${chipSheetId} select[name="system.chippedSkill"]`)
      .selectOption("Athletics");
    await expect
      .poll(() =>
        page.evaluate(
          ({ a, i }) => game.actors.get(a).items.get(i).system.chippedSkill,
          { a: actorId, i: ownedId },
        ),
      )
      .toBe("Athletics");
    await closeOwnedItemSheet(page, { actorId, itemId: ownedId });
    await installOwned(page, {
      actorId,
      name: "Skill Chip",
      targetName: "Chipware Socket",
    });
  });

  await test.step("the skill counts as 3 and the stored level is kept", async () => {
    expect(await level()).toEqual({ stored: before.stored, effective: 3 });
    const sheetId = await closeAndReopenActorSheet(page, actorId);
    await page.locator(`#${sheetId} a[data-tab="skills"]`).click();
    await expect(page.locator(`#${sheetId} .skill-chip-active`)).toHaveCount(1);
  });
});

test("the mook sheet flags cyberware with a missing prerequisite", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "mook",
    name: uniqueName("mook-prereq"),
  });
  const sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  const name = uniqueName("mook-needs-link");
  const itemId = await createItemViaUI(page, { type: "cyberware", name });
  const itemSheetId = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  const itemSheet = page.locator(`#${itemSheetId}`);
  await openItemSettings(page, itemSheetId);
  await itemSheet
    .locator('select[name="system.type"]')
    .selectOption("cyberwareExternal");
  await expect
    .poll(() => page.evaluate((id) => game.items.get(id).system.type, itemId))
    .toBe("cyberwareExternal");
  await itemSheet.locator('[data-prerequisite-type="neuralWare"]').check();
  await expect
    .poll(() =>
      page.evaluate(
        (id) => game.items.get(id).system.prerequisites.foundationalTypes,
        itemId,
      ),
    )
    .toEqual(["neuralWare"]);
  await closeDocSheet(page, { collection: "items", id: itemId });
  const dialog = await openInstallCyberwareDialog(page, {
    itemId,
    sheetId,
    actorId,
  });
  await confirmInstallCyberwareDialog(dialog);
  const freshId = await closeAndReopenActorSheet(page, actorId);
  await expect(
    page.locator(`#${freshId} .fa-triangle-exclamation`),
  ).toHaveCount(1);
});
