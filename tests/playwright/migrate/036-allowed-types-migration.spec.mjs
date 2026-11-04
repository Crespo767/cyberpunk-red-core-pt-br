import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 036 replaces the obsolete container allowed type "programs"
 * with "program" on actors and items, retaining the other allowed types.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test.fixme("036 replaces programs with a flat list on actors and items", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/036-correct-allowed-types.js`
    );
    const migration = new M.default();
    const actor = {
      system: { installedItems: { allowedTypes: ["programs", "cyberware"] } },
    };
    const item = structuredClone(actor);
    await migration.updateActor(actor);
    await migration.updateItem(item);
    return { actor, item };
  });
  for (const doc of Object.values(result)) {
    expect(doc.system.installedItems.allowedTypes).toEqual([
      "program",
      "cyberware",
    ]);
  }
});

test("036 leaves unrelated data unchanged and is idempotent", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/036-correct-allowed-types.js`
    );
    const migration = new M.default();
    const untouched = {
      system: { installedItems: { allowedTypes: ["program", "cyberware"] } },
    };
    const migrated = {
      system: { installedItems: { allowedTypes: ["programs", "cyberware"] } },
    };
    const before = structuredClone(untouched);
    await migration.updateActor(untouched);
    await migration.updateItem(untouched);
    await migration.updateItem(migrated);
    const once = structuredClone(migrated);
    await migration.updateItem(migrated);
    return { before, untouched, once, twice: migrated };
  });
  expect(result.untouched).toEqual(result.before);
  expect(result.twice).toEqual(result.once);
});
