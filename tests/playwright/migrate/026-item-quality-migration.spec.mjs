import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 026 assigns quality from an item's name or description,
 * preferring poor over excellent, and sets its critical failure effect to jammed.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("026 derives quality case-insensitively and sets jammed", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/026-itemQuality.js`
    );
    const migration = new M.default();
    const items = [
      { name: "POOR pistol", system: { description: { value: "Excellent" } } },
      { name: "Pistol", system: { description: { value: "POOR condition" } } },
      { name: "EXCELLENT pistol", system: { description: { value: "" } } },
      {
        name: "Pistol",
        system: { description: { value: "Excellent condition" } },
      },
      {
        name: "Pistol",
        system: { description: { value: "Ordinary" }, extra: 7 },
      },
    ];
    for (const item of items) await migration.updateItem(item);
    const first = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { first, second: items };
  });
  expect(out.first.map((item) => item.system.quality)).toEqual([
    "poor",
    "poor",
    "excellent",
    "excellent",
    "standard",
  ]);
  expect(out.first.map((item) => item.system.critFailEffect)).toEqual(
    Array(5).fill("jammed"),
  );
  expect(out.first[4].system.extra).toBe(7);
  expect(out.second).toEqual(out.first);
});
