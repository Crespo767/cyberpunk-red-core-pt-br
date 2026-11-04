import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 029 converts negative armor penalties to positive integers.
 * Zero and already positive penalties are left unchanged.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("029 converts negative penalties and preserves other values idempotently", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/029-armor-penalties.js`
    );
    const migration = new M.default();
    const items = [-4, -1, 0, 4].map((penalty) => ({
      type: "armor",
      system: { penalty, extra: 7 },
    }));
    items.push({ type: "armor", system: { extra: 7 } });
    for (const item of items) await migration.updateItem(item);
    const first = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return {
      first,
      second: items,
      gearAllowed: migration.allowedDocTypes.Item.has("gear"),
    };
  });
  expect(out.first.map((item) => item.system.penalty)).toEqual([
    4,
    1,
    0,
    4,
    undefined,
  ]);
  expect(out.first.every((item) => item.system.extra === 7)).toBe(true);
  expect(out.second).toEqual(out.first);
  expect(out.gearAllowed).toBe(false);
});
