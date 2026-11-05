import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  createDocumentViaUI,
  createItemViaUI,
  expectSheetRendered,
  closeAndReopenActorSheet,
  closeDocSheet,
  dragItemToActorSheet,
  toggleItemCheckbox,
  setItemField,
  openSidebarTab,
  dismissNotifications,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";

test.use({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 0.5,
  actionTimeout: 15000,
});

test("a token's active DV table and ranges follow Autofire in both directions", async ({
  page,
}) => {
  test.setTimeout(180000);
  await gotoReadyWorld(page);
  const original = await page.evaluate(() => ({
    noCanvas: game.settings.get("core", "noCanvas"),
    maxFPS: game.settings.get("core", "maxFPS"),
    performanceMode: game.settings.get("core", "performanceMode"),
  }));
  const sceneName = uniqueName("autofire-token");
  try {
    const actorId = await createDocumentViaUI(page, {
      documentTab: "actors",
      type: "mook",
      name: uniqueName("autofire-token"),
    });
    const weapons = [];
    for (const [name, table, normal, autofire] of [
      [
        "SMG",
        "DV SMG",
        [15, 13, 15, 20, 25, 25, 30, "N/A"],
        [20, 17, 20, 25, 30, "N/A", "N/A", "N/A"],
      ],
      [
        "Assault Rifle",
        "DV Assault Rifle",
        [17, 16, 15, 13, 15, 20, 25, 30],
        [22, 20, 17, 20, 25, "N/A", "N/A", "N/A"],
      ],
    ]) {
      const uuid = await page.evaluate(
        async (name) =>
          (
            await game.packs
              .get("cyberpunk-red-core.core_weapons")
              .getDocuments()
          ).find((i) => (i.flags.babele?.originalName || i.name) === name).uuid,
        name,
      );
      const actorSheet = await closeAndReopenActorSheet(page, actorId);
      const before = await page.evaluate(
        (id) => game.actors.get(id).items.size,
        actorId,
      );
      await page.locator(`#${actorSheet}`).evaluate((element, uuid) => {
        const transfer = new DataTransfer();
        transfer.setData("text/plain", JSON.stringify({ type: "Item", uuid }));
        element.dispatchEvent(
          new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: transfer,
          }),
        );
      }, uuid);
      await expect
        .poll(() =>
          page.evaluate((id) => game.actors.get(id).items.size, actorId),
        )
        .toBe(before + 1);
      const ownedId = await page.evaluate(
        ({ actorId, name }) =>
          game.actors.get(actorId).items.find((i) => i.name === name).id,
        { actorId, name },
      );
      weapons.push({ ownedId, table, normal, autofire });
    }
    const fallbackName = uniqueName("unconfigured-table"),
      fallbackSourceId = await createItemViaUI(page, {
        type: "weapon",
        name: fallbackName,
      });
    const fallbackSheet = await expectSheetRendered(page, {
      collection: "items",
      id: fallbackSourceId,
    });
    await toggleItemCheckbox(page, {
      sheetId: fallbackSheet,
      itemId: fallbackSourceId,
      target: "system.isRanged",
      expected: true,
    });
    await setItemField(page, {
      sheetId: fallbackSheet,
      itemId: fallbackSourceId,
      name: "system.fireModes.autoFire",
      path: "system.fireModes.autoFire",
      value: 3,
    });
    await closeDocSheet(page, { collection: "items", id: fallbackSourceId });
    const actorSheet = await closeAndReopenActorSheet(page, actorId);
    await dragItemToActorSheet(page, {
      actorId,
      sheetId: actorSheet,
      itemId: fallbackSourceId,
    });
    const fallbackId = await page.evaluate(
      ({ actorId, name }) =>
        game.actors.get(actorId).items.find((i) => i.name === name).id,
      { actorId, name: fallbackName },
    );
    expect(
      await page.evaluate(
        ({ actorId, itemId }) =>
          game.actors.get(actorId).items.get(itemId).system.dvTable,
        { actorId, itemId: fallbackId },
      ),
    ).toBe("");
    await closeDocSheet(page, { collection: "actors", id: actorId });
    await openSidebarTab(page, "scenes");
    await page.locator("#scenes button.create-entry").click();
    const dialog = page.locator(".application.dialog");
    await dialog.locator('input[name="name"]').fill(sceneName);
    await dialog.locator('button[data-action="ok"]').click();
    await expect(dialog).toHaveCount(0);
    await page
      .locator('.scene-config .window-header [data-action="close"]')
      .click();
    if (
      !(await page.evaluate(
        (name) => game.scenes.getName(name).active,
        sceneName,
      ))
    ) {
      await page
        .locator("#scenes .directory-item")
        .filter({ hasText: sceneName })
        .click({ button: "right" });
      await page
        .locator("#context-menu .context-item")
        .filter({ hasText: "Activate" })
        .click();
    }
    await page.evaluate(() => game.settings.set("core", "noCanvas", false));
    await gotoReadyWorld(page);
    await page.waitForFunction(
      (name) => canvas.ready && canvas.scene?.name === name,
      sceneName,
    );
    await page.evaluate(async () => {
      await game.settings.set("core", "maxFPS", 10);
      await game.settings.set(
        "core",
        "performanceMode",
        CONST.CANVAS_PERFORMANCE_MODES.LOW,
      );
    });
    await gotoReadyWorld(page);
    await page.waitForFunction(
      (name) => canvas.ready && canvas.scene?.name === name,
      sceneName,
    );
    await dismissNotifications(page);
    await openSidebarTab(page, "actors");
    await page
      .locator(`#actors [data-entry-id="${actorId}"]`)
      .dragTo(page.locator("#board"), { targetPosition: { x: 600, y: 400 } });
    await page.waitForFunction(
      (id) => canvas.tokens.placeables.some((t) => t.actor?.id === id),
      actorId,
    );
    const sid = await page.evaluate(async (id) => {
      const token = canvas.tokens.placeables.find((t) => t.actor?.id === id);
      token.control({ releaseOthers: true });
      await token.actor.sheet.render(true);
      return token.actor.sheet.element.id;
    }, actorId);
    const read = () =>
      page.evaluate(
        (id) =>
          canvas.tokens.placeables
            .find((t) => t.actor?.id === id)
            .document.getFlag(game.system.id, "cprDvTable"),
        actorId,
      );
    for (const weapon of weapons) {
      const row = page.locator(
        `#${sid} .weapon-grid[data-item-id="${weapon.ownedId}"]`,
      );
      await expect(row.locator(".dv-glyph")).not.toHaveClass(/button-disabled/);
      await row.locator(".dv-glyph").click();
      await expect.poll(async () => (await read())?.name).toBe(weapon.table);
      for (const [mode, enabled, ranges] of [
        ["autofire", true, weapon.autofire],
        ["aimed", false, weapon.normal],
        ["autofire", true, weapon.autofire],
        ["autofire", false, weapon.normal],
      ]) {
        await row.locator(`[data-fire-mode="${mode}"]`).click();
        await expect
          .poll(async () => (await read())?.name)
          .toBe(`${weapon.table}${enabled ? " (Autofire)" : ""}`);
        expect(Object.values((await read()).table)).toEqual(ranges.map(String));
        await expect(row.locator(".dv-glyph")).toHaveClass(/button-active/);
      }
      // An unconfigured weapon follows the token's currently selected table.
      const fallbackRow = page.locator(
        `#${sid} .weapon-grid[data-item-id="${fallbackId}"]`,
      );
      for (const [enabled, ranges] of [
        [true, weapon.autofire],
        [false, weapon.normal],
      ]) {
        await fallbackRow.locator('[data-fire-mode="autofire"]').click();
        await expect
          .poll(async () => (await read())?.name)
          .toBe(`${weapon.table}${enabled ? " (Autofire)" : ""}`);
        expect(Object.values((await read()).table)).toEqual(ranges.map(String));
      }
    }
  } finally {
    try {
      if (
        await page.evaluate((name) => !!game.scenes.getName(name), sceneName)
      ) {
        await openSidebarTab(page, "scenes");
        await page
          .locator("#scenes .directory-item")
          .filter({ hasText: sceneName })
          .click({ button: "right" });
        await page
          .locator("#context-menu .context-item")
          .filter({ hasText: "Delete" })
          .click();
        await page
          .locator('.application.dialog button[data-action="yes"]')
          .click();
      }
    } finally {
      await page.evaluate(async (settings) => {
        if (canvas.initialized) {
          await game.settings.set("core", "maxFPS", settings.maxFPS);
          await game.settings.set(
            "core",
            "performanceMode",
            settings.performanceMode,
          );
        }
        await game.settings.set("core", "noCanvas", settings.noCanvas);
      }, original);
    }
  }
});
