import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 035 assigns Handgun to attackable items missing weaponSkill.
 * Existing skill values are preserved, including explicitly empty values.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("035 defaults a missing weapon skill and is idempotent", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/035-set-weapon-skill.js`
    );
    const item = { type: "weapon", system: {} };
    const migration = new M.default();
    await migration.updateItem(item);
    const first = structuredClone(item);
    await migration.updateItem(item);
    return { first, second: item };
  });
  expect(out.first.system.weaponSkill).toBe("Handgun");
  expect(out.second).toEqual(out.first);
});

test("035 preserves existing, empty and null weapon skill values", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/035-set-weapon-skill.js`
    );
    const items = ["Rifle", "", null].map((weaponSkill) => ({
      type: "weapon",
      system: { weaponSkill },
    }));
    const before = structuredClone(items);
    for (const item of items) await new M.default().updateItem(item);
    return { before, items };
  });
  expect(out.items).toEqual(out.before);
});
