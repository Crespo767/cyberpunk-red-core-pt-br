import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 040 replaces mapped legacy ammunition PNG icons with their SVG
 * paths, including renamed Black Chrome icons and DLC ammunition icons.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("040 converts mapped core and DLC icons and preserves unmapped icons idempotently", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/040-ammo-icons.js`
    );
    const migration = new M.default();
    const docs = [
      {
        type: "ammo",
        img: "systems/cyberpunk-red-core/icons/compendium/ammo/bow_basic.png",
      },
      {
        type: "gear",
        img: "modules/cyberpunk-red-dlc/icons/black-chrome/ammo/capsule_tied.png",
      },
      {
        type: "ammo",
        img: "modules/cyberpunk-red-dlc/icons/dlc/ammo/bow_junk.png",
      },
      { type: "ammo", img: "custom/ammo.png" },
      { type: "ammo" },
    ];
    for (const doc of docs) await migration.updateItem(doc);
    const once = structuredClone(docs);
    for (const doc of docs) await migration.updateItem(doc);
    return { once, twice: docs };
  });
  expect(result.once).toEqual([
    {
      type: "ammo",
      img: "systems/cyberpunk-red-core/icons/compendium/ammo/bow_basic.svg",
    },
    {
      type: "gear",
      img: "modules/cyberpunk-red-dlc/icons/black-chrome/ammo/cannister_net.svg",
    },
    {
      type: "ammo",
      img: "modules/cyberpunk-red-dlc/icons/dlc/ammo/bow_junk.svg",
    },
    { type: "ammo", img: "custom/ammo.png" },
    { type: "ammo" },
  ]);
  expect(result.twice).toEqual(result.once);
});
