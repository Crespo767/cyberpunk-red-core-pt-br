import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  createDocumentViaUI,
  createItemViaUI,
  expectSheetRendered,
  openItemSettings,
  toggleItemCheckbox,
  closeDocSheet,
  closeAndReopenActorSheet,
  dragItemToActorSheet,
  openOwnedItemSheet,
  closeOwnedItemSheet,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";

for (const owned of [false, true]) {
  test(`${owned ? "an owned" : "a world"} weapon saves its DV table and keeps it during other edits`, async ({
    page,
  }) => {
    await gotoReadyWorld(page);
    const name = uniqueName("dv-editor"),
      worldItemId = await createItemViaUI(page, { type: "weapon", name });
    let itemId = worldItemId,
      actorId = null;
    let sid = await expectSheetRendered(page, {
      collection: "items",
      id: worldItemId,
    });
    await toggleItemCheckbox(page, {
      sheetId: sid,
      itemId,
      target: "system.isRanged",
      expected: true,
    });
    if (owned) {
      await closeDocSheet(page, { collection: "items", id: worldItemId });
      actorId = await createDocumentViaUI(page, {
        documentTab: "actors",
        type: "character",
        name: uniqueName("dv-owner"),
      });
      const actorSheet = await closeAndReopenActorSheet(page, actorId);
      await dragItemToActorSheet(page, {
        actorId,
        sheetId: actorSheet,
        itemId: worldItemId,
      });
      itemId = await page.evaluate(
        ({ actorId, name }) =>
          game.actors.get(actorId).items.find((i) => i.name === name).id,
        { actorId, name },
      );
    }
    const read = () =>
      page.evaluate(
        ({ actorId, itemId }) => {
          const item = actorId
            ? game.actors.get(actorId).items.get(itemId)
            : game.items.get(itemId);
          return { dv: item.system.dvTable, brand: item.system.brand };
        },
        { actorId, itemId },
      );
    const render = async () => {
      await page.evaluate(
        ({ actorId, itemId }) =>
          (actorId
            ? game.actors.get(actorId).items.get(itemId)
            : game.items.get(itemId)
          ).sheet.render(true),
        { actorId, itemId },
      );
      return actorId
        ? openOwnedItemSheet(page, { actorId, itemId })
        : expectSheetRendered(page, { collection: "items", id: itemId });
    };
    const close = () =>
      actorId
        ? closeOwnedItemSheet(page, { actorId, itemId })
        : closeDocSheet(page, { collection: "items", id: itemId });
    for (const value of ["DV SMG", "DV Assault Rifle", "", "DV SMG"]) {
      sid = await render();
      const settings = await openItemSettings(page, sid);
      await settings
        .locator('select[name="system.dvTable"]')
        .selectOption(value);
      await expect.poll(async () => (await read()).dv).toBe(value);
      await close();
      sid = await render();
      await openItemSettings(page, sid);
      await expect(
        page.locator(`#${sid} select[name="system.dvTable"]`),
      ).toHaveValue(value);
      await close();
    }
    sid = await render();
    const settings = await openItemSettings(page, sid);
    await settings.locator('input[name="system.brand"]').fill("Audit DV brand");
    await settings.locator('input[name="system.brand"]').blur();
    await expect.poll(read).toEqual({ dv: "DV SMG", brand: "Audit DV brand" });
    await close();
  });
}
