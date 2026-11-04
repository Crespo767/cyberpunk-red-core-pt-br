import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 037 removes weapon installed-item references that do not resolve
 * to ammunition or upgrades in the actor inventory or to a world item.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("037 filters invalid inventory references and preserves unrelated items idempotently", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/037-remove-invalid-upgrates.js`
    );
    const migration = new M.default();
    const actor = {
      items: [
        {
          type: "weapon",
          system: {
            installedItems: { list: ["ammo", "upgrade", "gear", "missing"] },
          },
        },
        { _id: "ammo", type: "ammo" },
        { _id: "upgrade", type: "itemUpgrade" },
        {
          _id: "gear",
          type: "gear",
          system: { installedItems: { list: ["missing"] } },
        },
        { type: "weapon", system: { installedItems: { list: [] } } },
      ],
    };
    await migration.updateActor(actor);
    const once = structuredClone(actor);
    await migration.updateActor(actor);
    return { once, twice: actor };
  });
  expect(result.once.items[0].system.installedItems.list).toEqual([
    "ammo",
    "upgrade",
  ]);
  expect(result.once.items[3].system.installedItems.list).toEqual(["missing"]);
  expect(result.once.items[4].system.installedItems.list).toEqual([]);
  expect(result.twice).toEqual(result.once);
});

test.fixme("037 preserves valid world-item references", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const item = await Item.create({
      name: "Migration 037 world ammo",
      type: "ammo",
    });
    try {
      const M = await import(
        `/systems/${game.system.id}/modules/system/migrate/scripts/037-remove-invalid-upgrates.js`
      );
      const actor = {
        items: [
          { type: "weapon", system: { installedItems: { list: [item.id] } } },
        ],
      };
      await new M.default().updateActor(actor);
      return { list: actor.items[0].system.installedItems.list, id: item.id };
    } finally {
      await item.delete();
    }
  });
  expect(result.list).toEqual([result.id]);
});
