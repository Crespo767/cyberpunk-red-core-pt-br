import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 031 updates Net Architecture tile texture paths from PNG to WebP.
 * It searches every scene and leaves other tile paths untouched.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("031 migrates Net Architecture tiles and preserves other tiles on repeated runs", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/031-netarch-tiles.js`
    );
    const base = `systems/${game.system.id}/tiles/netarch`;
    const scene = await Scene.create({
      name: "031 migration test",
      tiles: [
        { texture: { src: `${base}/PNG/floor.png` }, width: 100, height: 100 },
        { texture: { src: "other/floor.png" }, width: 100, height: 100 },
      ],
    });
    const tile = scene.tiles.contents[0];
    const original = tile.update;
    const updates = [];
    tile.update = function (...args) {
      const update = original.apply(this, args);
      updates.push(update);
      return update;
    };
    try {
      const migration = new M.default();
      await migration.migrateMisc();
      // The implementation does not await tile.update, so collect its promises.
      await Promise.all(updates);
      const first = scene.tiles.contents.map((tile) => tile.texture.src);
      await migration.migrateMisc();
      await Promise.all(updates);
      return {
        first,
        second: scene.tiles.contents.map((tile) => tile.texture.src),
        base,
      };
    } finally {
      tile.update = original;
      await scene.delete();
    }
  });
  expect(out.first).toEqual([`${out.base}/WebP/floor.webp`, "other/floor.png"]);
  expect(out.second).toEqual(out.first);
});

test("031 waits for tile updates before resolving", async ({ page: game }) => {
  const completed = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/031-netarch-tiles.js`
    );
    const scene = await Scene.create({
      name: "031 await test",
      tiles: [
        {
          texture: { src: `systems/${game.system.id}/tiles/netarch/floor.png` },
          width: 100,
          height: 100,
        },
      ],
    });
    const tile = scene.tiles.contents[0];
    const original = tile.update;
    let release;
    let finished = false;
    tile.update = () =>
      new Promise((resolve) => {
        release = () => {
          finished = true;
          resolve();
        };
      });
    try {
      const pending = new M.default().migrateMisc();
      await Promise.resolve();
      let migrationFinished = false;
      pending.then(() => {
        migrationFinished = true;
      });
      await Promise.resolve();
      const resolvedTooEarly = migrationFinished && !finished;
      release();
      await pending;
      return !resolvedTooEarly;
    } finally {
      tile.update = original;
      await scene.delete();
    }
  });
  expect(completed).toBe(true);
});
