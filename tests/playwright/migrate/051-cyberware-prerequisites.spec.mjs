import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

test("051 recognizes core cyberware and is idempotent", async ({ page }) => {
  await gotoReadyWorld(page);
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/051-cyberware-prerequisites.js`
    );
    const items = [
      {
        type: "cyberware",
        name: "Traduzido",
        _stats: {
          compendiumSource:
            "Compendium.cyberpunk-red-core.core_cyberware.Item.2vSTximwCOxNPGJX",
        },
        system: {},
      },
      { type: "cyberware", name: "Subdermal Grip", system: {} },
      { type: "cyberware", name: "Talon Foot", system: {} },
      { type: "cyberware", name: "Item alheio", system: {} },
    ];
    const migration = new Migration();
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, once };
  });
  expect(result.items).toEqual(result.once);
  expect(result.items[0].system.prerequisites.foundationalTypes).toContain(
    "neuralWare",
  );
  expect(result.items[1].system.prerequisites).toEqual(
    result.items[0].system.prerequisites,
  );
  expect(result.items[2].system.meatArmCompatible).toBe(true);
  expect(result.items[3].system).toEqual({});
});
