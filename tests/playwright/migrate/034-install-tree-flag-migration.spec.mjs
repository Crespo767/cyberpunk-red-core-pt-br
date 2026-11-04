import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 034 places legacy install trees in system-scoped flags recursively.
 * It records the migration versions on each installed item and preserves other flags.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("034 copies nested trees and migration records without disturbing other flags", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/034-migrate-cprInstallTree-flag.js`
    );
    const id = game.system.id;
    const item = {
      flags: {
        [id]: { root: true },
        cprInstallTree: [
          {
            flags: {
              [id]: { existing: true },
              cprInstallTree: [{ flags: { other: 7 } }],
            },
          },
        ],
      },
    };
    const migration = new M.default();
    await migration.updateItem(item);
    const first = structuredClone(item);
    await migration.updateItem(item);
    const tree = item.flags[id].cprInstallTree;
    return {
      first,
      second: item,
      root: item.flags[id].root,
      parent: tree[0].flags[id],
      child: tree[0].flags[id].cprInstallTree[0].flags,
      id,
      versions: {
        previous: game.cpr.MigrationRunner.currentDataModelVersion,
        current: game.cpr.MigrationRunner.newDataModelVersion,
      },
    };
  });
  expect(out.root).toBe(true);
  expect(out.parent.existing).toBe(true);
  expect(out.parent._migration).toEqual(out.versions);
  expect(out.child.other).toBe(7);
  expect(out.child[out.id]._migration).toEqual(out.versions);
  expect(out.second).toEqual(out.first);
});

test("034 leaves absent, invalid and empty legacy trees untouched", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/034-migrate-cprInstallTree-flag.js`
    );
    const items = [
      {},
      { flags: { cprInstallTree: null } },
      { flags: { cprInstallTree: [] } },
    ];
    const before = structuredClone(items);
    for (const item of items) await new M.default().updateItem(item);
    return { before, items };
  });
  expect(out.items).toEqual(out.before);
});
