import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 041 removes the obsolete unscoped cprInstallTree flag from
 * container items and their installed-item trees, recording migration versions
 * on items visited inside the retained system-scoped tree.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("041 removes the old flag and preserves unrelated flags idempotently", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/041-remove-unused-install-flag.js`
    );
    const migration = new M.default();
    const doc = { flags: { cprInstallTree: [], other: { value: 1 } } };
    await migration.updateItem(doc);
    const once = foundry.utils.mergeObject({}, doc, { performDeletions: true });
    const untouched = { flags: { other: { value: 1 } } };
    await migration.updateItem(untouched);
    await migration.updateItem(once);
    const twice = foundry.utils.mergeObject({}, once, {
      performDeletions: true,
    });
    return { twice, untouched };
  });
  expect(result.twice).toEqual({ flags: { other: { value: 1 } } });
  expect(result.untouched).toEqual({ flags: { other: { value: 1 } } });
});

test.fixme("041 recursively cleans and records items in the scoped install tree", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/041-remove-unused-install-flag.js`
    );
    const grandchild = {
      flags: { cprInstallTree: [], [game.system.id]: { keep: true } },
    };
    const child = {
      flags: {
        cprInstallTree: [],
        [game.system.id]: { cprInstallTree: [grandchild], keep: true },
      },
    };
    const doc = {
      flags: {
        cprInstallTree: [child],
        [game.system.id]: { cprInstallTree: [child] },
      },
    };
    await new M.default().updateItem(doc);
    const tree = doc.flags[game.system.id].cprInstallTree;
    return {
      child: tree[0],
      grandchild: tree[0].flags[game.system.id].cprInstallTree[0],
      systemId: game.system.id,
      previous: game.cpr.MigrationRunner.currentDataModelVersion,
      current: game.cpr.MigrationRunner.newDataModelVersion,
    };
  });
  for (const item of [result.child, result.grandchild]) {
    expect(item.flags["-=cprInstallTree"]).toBeNull();
    expect(item.flags[result.systemId]._migration).toEqual({
      previous: result.previous,
      current: result.current,
    });
    expect(item.flags[result.systemId].keep).toBe(true);
  }
});
