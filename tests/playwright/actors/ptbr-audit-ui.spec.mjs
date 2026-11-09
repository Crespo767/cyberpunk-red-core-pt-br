import { test, expect } from "@playwright/test";
import {
  gotoReadyWorld,
  openPlayerPage,
} from "../../../tools/playwright/session/world.mjs";
import {
  createDocumentViaUI,
  createItemViaUI,
  createInventoryItemViaUI,
  expectSheetRendered,
  openItemSettings,
  openOwnedItemSheet,
  closeOwnedItemSheet,
  closeDocSheet,
  reopenItemSheetViaUI,
  openLedgerWindow,
  closeLedgerWindow,
  getPlayersCreateInventory,
  setPlayersCreateInventory,
  toggleItemCheckbox,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";

let previousInventorySetting;
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
  previousInventorySetting = await getPlayersCreateInventory(page);
  await setPlayersCreateInventory(page, true);
  await page.evaluate(() => game.settings.set("core", "language", "pt-BR"));
  await gotoReadyWorld(page);
});
test.afterEach(async ({ page }) => {
  await setPlayersCreateInventory(page, previousInventorySetting);
  await page.evaluate(() => game.settings.set("core", "language", "en"));
});

test("PT-BR item, ammunition, ledger and roll prompts retain their context", async ({
  page,
}) => {
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("audit-context"),
  });
  const sheetId = await expectSheetRendered(page, {
    collection: "actors",
    id: actorId,
  });
  const { itemId } = await createInventoryItemViaUI(page, {
    actorId,
    sheetId,
    itemType: "weapon",
  });
  const itemName = await page.evaluate(
    ({ actorId, itemId }) => game.actors.get(actorId).items.get(itemId).name,
    { actorId, itemId },
  );
  expect(itemName).toBe("Novo item: Arma");
  await page.evaluate(
    ({ actorId, itemId }) =>
      game.actors.get(actorId).items.get(itemId).sheet.render(true),
    { actorId, itemId },
  );
  const sid = await openOwnedItemSheet(page, { actorId, itemId });
  const settings = await openItemSettings(page, sid);
  await settings
    .locator('select[name="system.weaponType"]')
    .selectOption("smg");
  await toggleItemCheckbox(page, {
    sheetId: sid,
    actorId,
    itemId,
    target: "system.isRanged",
    expected: true,
  });
  await expect(settings.locator(".select-compatible-ammo")).toBeVisible();
  await settings.locator(".select-compatible-ammo").click();
  const ammo = page.locator(".cpr-dialog");
  await expect(ammo).toContainText(itemName);
  await expect(ammo).not.toContainText("{name}");
  await ammo.locator('button[data-action="cancel"]').click();
  await closeOwnedItemSheet(page, { actorId, itemId });
  const ledger = await openLedgerWindow(
    page,
    sheetId,
    ".eurobucks-open-ledger",
  );
  await expect(ledger.locator(".window-title")).toHaveText(
    "Registro de Dinheiro",
  );
  await closeLedgerWindow(page);
  await page.locator(`#${sheetId} a[data-tab="skills"]`).click();
  const skillId = await page.evaluate(
    (id) =>
      game.actors.get(id).itemTypes.skill.find((s) => s.name === "Athletics")
        .id,
    actorId,
  );
  await page
    .locator(
      `#${sheetId} [data-item-id="${skillId}"] a[data-roll-type="skill"]`,
    )
    .click();
  const roll = page.locator(".cpr.dialog");
  await expect(roll).toContainText("Rolando para 'Atletismo', Tchumba!");
  await expect(roll).not.toContainText("{rollTitle}");
  await roll.locator('button[data-action="cancel"]').click();
});

test("PT-BR empty installation and container settings are translated in editable and read-only views", async ({
  page,
}) => {
  const itemId = await createItemViaUI(page, {
    type: "gear",
    name: uniqueName("audit-empty-container"),
  });
  let sid = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  let settings = await openItemSettings(page, sid);
  await expect(settings).toContainText(
    "Outros itens podem ser instalados neste item",
  );
  if (
    !(await page.evaluate(
      (id) => game.items.get(id).system.installedItems.allowed,
      itemId,
    ))
  ) {
    await toggleItemCheckbox(page, {
      sheetId: sid,
      itemId,
      target: "system.installedItems.allowed",
      expected: true,
    });
  }
  await expect(settings.locator("a.manage-installable-types")).toHaveText(
    "Tipos de itens permitidos para instalação",
  );
  await settings.locator("a.manage-installed-items").click();
  const dialog = page.locator(".cpr-dialog");
  await expect(dialog).toContainText(
    "Você não possui itens de um tipo que possa ser instalado",
  );
  const name = await page.evaluate((id) => game.items.get(id).name, itemId);
  await expect(dialog).toContainText(name);
  await expect(dialog).not.toContainText("{target}");
  await dialog.locator('button[data-action="cancel"]').click();
  await closeDocSheet(page, { collection: "items", id: itemId });
  await page.evaluate(
    (id) => game.items.get(id).sheet.render(true, { editable: false }),
    itemId,
  );
  sid = await expectSheetRendered(page, { collection: "items", id: itemId });
  settings = await openItemSettings(page, sid);
  await expect(settings).toContainText(
    "Outros itens podem ser instalados neste item",
  );
  await expect(settings.locator("span.manage-installable-types")).toHaveText(
    "Tipos de itens permitidos para instalação",
  );
  await expect(
    settings.locator("a.manage-installable-types, a.manage-installed-items"),
  ).toHaveCount(0);
});

test("a real Observer cannot change cyberware prerequisites", async ({
  page,
  browser,
  baseURL,
}) => {
  const itemId = await createItemViaUI(page, {
    type: "cyberware",
    name: uniqueName("audit-observer-prereq"),
  });
  const sid = await expectSheetRendered(page, {
    collection: "items",
    id: itemId,
  });
  const settings = await openItemSettings(page, sid);
  await settings.locator('[data-prerequisite-type="neuralWare"]').check();
  await expect
    .poll(() =>
      page.evaluate(
        (id) => game.items.get(id).system.prerequisites.foundationalTypes,
        itemId,
      ),
    )
    .toEqual(["neuralWare"]);
  await closeDocSheet(page, { collection: "items", id: itemId });
  await page.evaluate(
    (id) =>
      game.items.get(id).update({
        "ownership.default": CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
      }),
    itemId,
  );
  const player = await openPlayerPage(browser, baseURL);
  try {
    const playerSid = await reopenItemSheetViaUI(player.page, itemId);
    const sheet = await openItemSettings(player.page, playerSid);
    expect(
      await player.page.evaluate(
        (id) => ({ owner: game.items.get(id).isOwner, gm: game.user.isGM }),
        itemId,
      ),
    ).toEqual({ owner: false, gm: false });
    await expect(
      sheet.locator(
        ".prerequisite-entry, .prerequisite-add, .prerequisite-remove, .prerequisite-drop, [data-prerequisite-type]",
      ),
    ).toHaveCount(0);
    const label = await player.page.evaluate(() =>
      game.i18n.localize("CPR.global.cyberwareType.neuralware"),
    );
    await expect(sheet).toContainText(label);
    expect(
      await player.page.evaluate(
        (id) => game.items.get(id).system.prerequisites.foundationalTypes,
        itemId,
      ),
    ).toEqual(["neuralWare"]);
  } finally {
    await player.context.close();
  }
});

test("rare missing-skill and scene errors resolve localized messages with context", async ({
  page,
}) => {
  const actorId = await createDocumentViaUI(page, {
    documentTab: "actors",
    type: "character",
    name: uniqueName("audit-errors"),
  });
  const roleId = await createItemViaUI(page, {
    type: "role",
    name: uniqueName("audit-role"),
  });
  const deckId = await createItemViaUI(page, {
    type: "cyberdeck",
    name: uniqueName("audit-deck"),
  });
  const programId = await createItemViaUI(page, {
    type: "program",
    name: uniqueName("audit-program"),
  });
  // Fault contexts model stale references without changing persisted Actor/Item data.
  await page.evaluate(
    ({ actorId, roleId }) => {
      const role = game.items.get(roleId),
        actor = game.actors.get(actorId);
      const system = {
        ...role.system.toObject(),
        stat: "--",
        skill: "Missing audit skill",
        abilities: [
          {
            name: "audit sub",
            stat: "--",
            rank: 1,
            skill: { name: "Missing audit subskill" },
          },
        ],
      };
      role._createRoleRoll.call({ system }, "role", actor, {
        rollSubType: "mainRoleAbility",
      });
      role._createRoleRoll.call({ system }, "role", actor, {
        rollSubType: "subRoleAbility",
        subRoleName: "audit sub",
      });
    },
    { actorId, roleId },
  );
  await expect(
    page
      .locator(".notification.error")
      .filter({ hasText: "Missing audit skill" }),
  ).toContainText("não foi encontrada neste ator");
  await expect(
    page
      .locator(".notification.error")
      .filter({ hasText: "Missing audit subskill" }),
  ).toContainText("não foi encontrada neste ator");
  await page.evaluate(
    async ({ deckId, programId }) =>
      game.items
        .get(deckId)
        ._rezBlackIceToken(game.items.get(programId), { isEmbedded: false }),
    { deckId, programId },
  );
  await expect(
    page
      .locator(".notification.error")
      .filter({ hasText: "O Token vinculado não pertence a uma cena" }),
  ).toBeVisible();
});
