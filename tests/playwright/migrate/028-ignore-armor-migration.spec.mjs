import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 028 enables 50% armor bypass for non-ranged attackables
 * except unarmed attacks, with no minimum stopping power.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("028 configures melee armor bypass and leaves ranged and unarmed items intact", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/028-ignoreArmor.js`
    );
    const migration = new M.default();
    const items = [
      { system: { isRanged: false, weaponType: "melee", extra: 7 } },
      { system: { isRanged: true, weaponType: "gun", canIgnoreArmor: false } },
      {
        system: {
          isRanged: false,
          weaponType: "unarmed",
          ignoreArmorPercent: 10,
        },
      },
    ];
    const original = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    const first = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { original, first, second: items };
  });
  expect(out.first[0].system).toEqual({
    isRanged: false,
    weaponType: "melee",
    extra: 7,
    canIgnoreArmor: true,
    ignoreArmorPercent: 50,
    ignoreBelowSP: 0,
  });
  expect(out.first.slice(1)).toEqual(out.original.slice(1));
  expect(out.second).toEqual(out.first);
});
