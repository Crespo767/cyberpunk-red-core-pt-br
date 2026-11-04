import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 043 hides the ten Achievements & Loot Boxes gear items from the
 * browser by setting system.ignoredByBrowser. It matches the English source name,
 * including Babele's originalName when the displayed name is translated.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("043 hides each loot box and stays idempotent", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/043-ignored-by-browser.js`
    );
    const migration = new M.default();
    const names = [
      "A Box Bound Tightly in Rope",
      "A Box Covered in Chipped Paint",
      "A Box Dripping Wet With Fluid",
      "A Box Freezing Cold To The Touch",
      "A Box Handsomely Gift Wrapped",
      "A Box Marked With A Lime Green X",
      "A Box Melted Out Of Shape",
      "A Box Reeking Of Oil",
      "A Box Sealed With A Lipstick Kiss",
      "A Box Showing Signs Of Repair",
    ];
    const items = names.map((name) => ({
      type: "gear",
      name,
      system: { ignoredByBrowser: false, marker: 1 },
    }));
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { version: M.default.version, once, twice: items };
  });
  expect(out.version).toBe(43);
  expect(out.once).toHaveLength(10);
  for (const item of out.once)
    expect(item.system).toEqual({ ignoredByBrowser: true, marker: 1 });
  expect(out.twice).toEqual(out.once);
});

test("043 matches Babele source names and preserves unrelated gear", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/043-ignored-by-browser.js`
    );
    const migration = new M.default();
    const items = [
      {
        type: "gear",
        name: "Caixa",
        flags: { babele: { originalName: "A Box Reeking Of Oil" } },
        system: {},
      },
      {
        type: "gear",
        name: "A Box Reeking Of Oil",
        flags: { babele: { originalName: "Other gear" } },
        system: { ignoredByBrowser: false },
      },
      { type: "gear", name: "Other gear", system: { ignoredByBrowser: true } },
      { type: "gear", name: "Other gear", system: {} },
    ];
    const before = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, before, allowed: [...migration.allowedDocTypes.Item] };
  });
  expect(out.allowed).toEqual(["gear"]);
  expect(out.items[0].system).toEqual({ ignoredByBrowser: true });
  expect(out.items.slice(1)).toEqual(out.before.slice(1));
});
