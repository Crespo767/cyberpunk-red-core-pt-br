import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 048 corrects the misspelled tactile boost and chemical analyzer
 * image paths on existing items. All other paths are left untouched.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("048 corrects both icon paths and stays idempotent", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/048-correct-icon-spelling.js`
    );
    const migration = new M.default();
    const root = "systems/cyberpunk-red-core/icons/compendium";
    const items = [
      {
        type: "cyberware",
        img: `${root}/cyberware/tactile_boot.svg`,
        system: { marker: 1 },
      },
      {
        type: "gear",
        img: `${root}/gear/chemical_analizer.svg`,
        system: { marker: 2 },
      },
    ];
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { version: M.default.version, once, twice: items };
  });
  expect(out.version).toBe(48);
  expect(out.once).toEqual([
    {
      type: "cyberware",
      img: "systems/cyberpunk-red-core/icons/compendium/cyberware/tactile_boost.svg",
      system: { marker: 1 },
    },
    {
      type: "gear",
      img: "systems/cyberpunk-red-core/icons/compendium/gear/chemical_analyzer.svg",
      system: { marker: 2 },
    },
  ]);
  expect(out.twice).toEqual(out.once);
});

test("048 preserves unrelated, custom and already corrected paths", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/048-correct-icon-spelling.js`
    );
    const migration = new M.default();
    const items = [
      { type: "gear", img: "custom/chemical_analizer.svg" },
      {
        type: "cyberware",
        img: "systems/cyberpunk-red-core/icons/compendium/cyberware/tactile_boost.svg",
      },
      {
        type: "gear",
        img: "systems/cyberpunk-red-core/icons/compendium/gear/chemical_analyzer.svg",
      },
      { type: "gear" },
    ];
    const before = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, before };
  });
  expect(out.items).toEqual(out.before);
});
