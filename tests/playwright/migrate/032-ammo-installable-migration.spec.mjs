import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 032 makes ammo installable on ranged loadable items.
 * It transfers a magazine's ammo UUID to the installed list and clears ammoData.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("032 adds ammo and transfers the magazine UUID only once", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/032-ammo-is-installable.js`
    );
    const item = {
      system: {
        isRanged: true,
        installedItems: {
          allowed: false,
          allowedTypes: ["upgrade"],
          list: ["existing"],
        },
        magazine: { ammoData: { uuid: "Actor.actor.Item.ammo" } },
      },
    };
    const migration = new M.default();
    await migration.updateItem(item);
    const first = structuredClone(item);
    await migration.updateItem(item);
    return { first, second: item };
  });
  expect(out.first.system).toEqual({
    isRanged: true,
    installedItems: {
      allowed: true,
      allowedTypes: ["upgrade", "ammo"],
      list: ["existing", "Actor.actor.Item.ammo"],
    },
    magazine: { ammoData: null },
  });
  expect(out.second).toEqual(out.first);
});

test("032 preserves existing ammo type and handles magazines without a UUID", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/032-ammo-is-installable.js`
    );
    const ranged = {
      system: {
        isRanged: true,
        installedItems: { allowed: false, allowedTypes: ["ammo"], list: [] },
        magazine: { ammoData: {} },
      },
    };
    const melee = {
      system: {
        isRanged: false,
        installedItems: { allowed: false, allowedTypes: ["upgrade"], list: [] },
        magazine: { ammoData: null },
      },
    };
    const migration = new M.default();
    await migration.updateItem(ranged);
    const before = structuredClone(melee);
    await migration.updateItem(melee);
    return { ranged, melee, before };
  });
  expect(out.ranged.system.installedItems).toEqual({
    allowed: true,
    allowedTypes: ["ammo"],
    list: [],
  });
  expect(out.ranged.system.magazine.ammoData).toBeNull();
  expect(out.melee).toEqual(out.before);
});
