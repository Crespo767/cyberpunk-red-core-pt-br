import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 033 converts installed item UUIDs into item IDs on containers.
 * Existing IDs remain intact, and container-type actors are skipped.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("033 converts world and embedded item UUIDs for items and actors idempotently", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/033-uuids-to-ids.js`
    );
    const ids = ["aaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbb", "cccccccccccccccc"];
    const list = [
      `Item.${ids[0]}`,
      `Actor.dddddddddddddddd.Item.${ids[1]}`,
      ids[2],
    ];
    const item = {
      type: "gear",
      system: { installedItems: { list: [...list] } },
    };
    const actor = {
      type: "character",
      system: { installedItems: { list: [...list] } },
    };
    const migration = new M.default();
    await migration.updateItem(item);
    await migration.updateActor(actor);
    const first = structuredClone({ item, actor });
    await migration.updateItem(item);
    await migration.updateActor(actor);
    return { ids, first, second: { item, actor } };
  });
  expect(out.first.item.system.installedItems.list).toEqual(out.ids);
  expect(out.first.actor.system.installedItems.list).toEqual(out.ids);
  expect(out.second).toEqual(out.first);
});

test("033 leaves empty lists and container actors unchanged", async ({
  page: game,
}) => {
  const out = await game.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/033-uuids-to-ids.js`
    );
    const item = { system: { installedItems: { list: [] } } };
    const actor = {
      type: "container",
      system: { installedItems: { list: ["Item.aaaaaaaaaaaaaaaa"] } },
    };
    const before = structuredClone({ item, actor });
    const migration = new M.default();
    await migration.updateItem(item);
    await migration.updateActor(actor);
    return { before, after: { item, actor } };
  });
  expect(out.after).toEqual(out.before);
});
