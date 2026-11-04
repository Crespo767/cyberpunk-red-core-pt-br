import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 025 replaces NaN role ability multipliers with 1.
 * Other multipliers and ability data remain unchanged.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("025 replaces only NaN multipliers and is idempotent", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/025-roleAbilities.js`
    );
    const migration = new M.default();
    const role = {
      type: "role",
      system: {
        abilities: [
          { name: "broken", multiplier: NaN },
          { name: "valid", multiplier: 2 },
          { name: "zero", multiplier: 0 },
          { name: "missing" },
        ],
      },
    };
    await migration.updateItem(role);
    const first = structuredClone(role);
    await migration.updateItem(role);
    return {
      first,
      second: role,
      roleAllowed: migration.allowedDocTypes.Item.has("role"),
      gearAllowed: migration.allowedDocTypes.Item.has("gear"),
    };
  });
  expect(out.first.system.abilities).toEqual([
    { name: "broken", multiplier: 1 },
    { name: "valid", multiplier: 2 },
    { name: "zero", multiplier: 0 },
    { name: "missing" },
  ]);
  expect(out.second).toEqual(out.first);
  expect(out.roleAllowed).toBe(true);
  expect(out.gearAllowed).toBe(false);
});
