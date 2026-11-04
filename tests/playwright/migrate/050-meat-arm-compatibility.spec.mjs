import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

test("050 recognizes core sources and exact English names", async ({
  page,
}) => {
  await gotoReadyWorld(page);
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/050-meat-arm-compatibility.js`
    );
    const names = [
      "Big Knucks",
      "Rippers",
      "Scratchers",
      "Slice 'N Dice",
      "Subdermal Grip",
      "Tool Hand",
      "Wolvers",
    ];
    const ids = [
      "6xKxgXAGcxK05CqM",
      "oeIi9BoY1WvIiqEQ",
      "dM6LI4fqDdgut7Uy",
      "u1TSFrsDP5i0KzFe",
      "2vSTximwCOxNPGJX",
      "hAx2MqVm4JuwXsSV",
      "GUT0BBUD2iKpPRoM",
    ];
    const items = [
      ...ids.map((id) => ({
        type: "cyberware",
        name: "Traduzido",
        _stats: {
          compendiumSource: `Compendium.cyberpunk-red-core.core_cyberware.Item.${id}`,
        },
        system: {},
      })),
      ...names.map((name) => ({ type: "cyberware", name, system: {} })),
      {
        type: "cyberware",
        name: "Traduzido",
        flags: { babele: { originalName: "Tool Hand" } },
        system: {},
      },
      {
        type: "cyberware",
        name: "Traduzido",
        flags: {
          core: {
            sourceId: `Compendium.cyberpunk-red-core.core_cyberware.Item.${ids[0]}`,
          },
        },
        system: {},
      },
      {
        type: "cyberware",
        name: "Mão-Ferramenta",
        _stats: { compendiumSource: "Compendium.other.items.Item.unrelated" },
        system: {},
      },
      { type: "cyberware", name: "Tool Hand replica", system: {} },
      { type: "gear", name: "Tool Hand", system: {} },
    ];
    const migration = new Migration();
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, once, filters: Migration.documentFilters };
  });
  expect(result.items).toEqual(result.once);
  expect(
    result.items
      .slice(0, 16)
      .every((item) => item.system.meatArmCompatible === true),
  ).toBe(true);
  expect(
    result.items
      .slice(16)
      .every((item) => item.system.meatArmCompatible !== true),
  ).toBe(true);
  expect(result.filters.Item.types).toContain("cyberware");
});
