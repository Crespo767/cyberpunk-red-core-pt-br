import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 045 relinks eight cyberweapon icons moved from the cyberweapons
 * compendium directory to cyberware. Other image paths remain unchanged.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("045 relinks all moved icons and stays idempotent", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/045-relink-cyberweapon-icons.js`
    );
    const migration = new M.default();
    const names = [
      "big_knucks",
      "cybersnake",
      "rippers",
      "scratchers",
      "slice_n_dice",
      "talon_foot",
      "vampyres",
      "wolvers",
    ];
    const root = "systems/cyberpunk-red-core/icons/compendium";
    const items = names.map((name) => ({
      type: "weapon",
      img: `${root}/cyberweapons/${name}.svg`,
      system: { marker: 1 },
    }));
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { version: M.default.version, once, twice: items };
  });
  const names = [
    "big_knucks",
    "cybersnake",
    "rippers",
    "scratchers",
    "slice_n_dice",
    "talon_foot",
    "vampyres",
    "wolvers",
  ];
  expect(out.version).toBe(45);
  expect(out.once).toEqual(
    names.map((name) => ({
      type: "weapon",
      img: `systems/cyberpunk-red-core/icons/compendium/cyberware/${name}.svg`,
      system: { marker: 1 },
    })),
  );
  expect(out.twice).toEqual(out.once);
});

test("045 preserves unrelated and custom icons", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/045-relink-cyberweapon-icons.js`
    );
    const migration = new M.default();
    const items = [
      { type: "gear", img: "custom/big_knucks.svg" },
      {
        type: "cyberware",
        img: "systems/cyberpunk-red-core/icons/compendium/cyberweapons/other.svg",
      },
      {
        type: "weapon",
        img: "systems/cyberpunk-red-core/icons/compendium/cyberware/rippers.svg",
      },
      { type: "gear" },
    ];
    const before = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, before };
  });
  expect(out.items).toEqual(out.before);
});
