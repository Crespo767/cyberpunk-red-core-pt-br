import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 030 marks cyberdecks and computers with recognized translated
 * names as electronic; other items retain their existing values.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("030 marks cyberdecks and translated computers electronic idempotently", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/030-isElectronic.js`
    );
    const migration = new M.default();
    const names = [
      "Computer",
      "\u041a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440",
      "Ordinateur",
      "Computador",
      "\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf",
      "Komputer",
      "Computadora",
    ];
    const items = [
      { type: "cyberdeck", name: "Deck", system: { isElectronic: false } },
      ...names.map((name) => ({
        type: "gear",
        name,
        system: { isElectronic: false },
      })),
      { type: "gear", name: "Rope", system: { isElectronic: false, extra: 7 } },
      { type: "gear", name: "computer", system: {} },
    ];
    const original = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    const first = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return {
      original,
      first,
      second: items,
      armorAllowed: migration.allowedDocTypes.Item.has("armor"),
    };
  });
  expect(
    out.first.slice(0, 8).every((item) => item.system.isElectronic === true),
  ).toBe(true);
  expect(out.first.slice(8)).toEqual(out.original.slice(8));
  expect(out.second).toEqual(out.first);
  expect(out.armorAllowed).toBe(false);
});
