import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

// Babele translates compendium documents by name; several rules then look
// documents up by those translated names. These read-only checks run with
// the real Babele translations in PT-BR and are skipped where Babele is not
// installed (the default isolated harness world).
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
  await page.evaluate(() => game.settings.set("core", "language", "pt-BR"));
  await gotoReadyWorld(page);
  const babele = await page.evaluate(
    () => game.modules.get("babele")?.active === true,
  );
  test.skip(!babele, "Babele is not active in this Foundry data path");
});
test.afterEach(async ({ page }) => {
  await page.evaluate(() => game.settings.set("core", "language", "en"));
});

test("translated drugs consume one of their translated effects", async ({
  page,
}) => {
  const drugs = await page.evaluate(async () => {
    const docs = await game.packs
      .get(`${game.system.id}.core_drugs`)
      .getDocuments();
    return docs
      .filter((drug) => drug.effects.size > 0)
      .map((drug) => ({
        name: drug.name,
        consumed: drug.system.consumed,
        effects: drug.effects.map((effect) => effect.name),
      }));
  });
  expect(drugs.map((drug) => drug.name)).toContain("Calcinha-preta");
  for (const drug of drugs) expect(drug.effects).toContain(drug.consumed);
});

test("critical injury and DV tables resolve their translated targets", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const id = game.system.id;
    const tables = await game.packs
      .get(`${id}.internal_critical-injury-tables`)
      .getDocuments();
    const injuries = tables.map((table) => {
      const pack = game.packs.find((p) => p.metadata.label === table.name);
      const names = pack ? pack.index.map((entry) => entry.name) : [];
      return {
        table: table.name,
        found: Boolean(pack),
        missing: table.results
          .map((r) => r.text ?? r.description)
          .filter((text) => !names.includes(text)),
      };
    });
    const dvNames = (
      await game.packs.get(`${id}.internal_dv-tables`).getDocuments()
    ).map((table) => table.name);
    const weapons = await game.packs.get(`${id}.core_weapons`).getDocuments();
    const unknownDv = weapons
      .map((weapon) => weapon.system.dvTable)
      .filter((dv) => dv && !dvNames.includes(dv));
    return { injuries, unknownDv };
  });
  for (const injury of result.injuries) {
    expect(injury.found, injury.table).toBe(true);
    expect(injury.missing, injury.table).toEqual([]);
  }
  expect(result.unknownDv).toEqual([]);
});
