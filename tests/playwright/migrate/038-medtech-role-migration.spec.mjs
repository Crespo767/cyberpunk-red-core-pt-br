import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 038 rebuilds Medtech abilities with half-rank multipliers,
 * renames Medical Tech and Surgery skills, and adds a separate Surgery ability
 * with half the old Surgery rank and a 0.5 multiplier.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("038 rebuilds Medtech skills and adds the Surgery ability", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/038-update-medtech-role.js`
    );
    const role = {
      name: "Medtech",
      type: "role",
      system: {
        abilities: [
          { name: "Medical Tech", rank: 8 },
          { name: "Medical Tech (Cryosystem Operation)", rank: 4 },
          { name: "Medical Tech (Pharmaceuticals)", rank: 6 },
          { name: "Surgery", rank: 8 },
        ],
      },
    };
    await new M.default().updateItem(role);
    return role.system.abilities;
  });
  const base = {
    bonusRatio: 1,
    bonuses: [],
    hasRoll: false,
    isSituational: false,
    multiplier: 0.5,
    onByDefault: false,
    skill: "--",
    stat: "--",
    universalBonuses: [],
  };
  expect(result).toEqual([
    {
      ...base,
      name: "Medical Tech Skill",
      rank: 8,
      stat: "tech",
      hasRoll: true,
    },
    { ...base, name: "Medical Tech (Cryosystem Operation)", rank: 4 },
    { ...base, name: "Medical Tech (Pharmaceuticals)", rank: 6 },
    {
      ...base,
      name: "Surgery Skill",
      rank: 8,
      multiplier: 0.25,
      stat: "tech",
      hasRoll: true,
    },
    { ...base, name: "Surgery", rank: 4 },
  ]);
});

test("038 leaves other roles and non-role items unchanged", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/038-update-medtech-role.js`
    );
    const migration = new M.default();
    const docs = [
      {
        name: "Solo",
        type: "role",
        system: { abilities: [{ name: "Surgery", rank: 4 }] },
      },
      { name: "Medtech", type: "gear", system: {} },
    ];
    const before = structuredClone(docs);
    for (const doc of docs) await migration.updateItem(doc);
    return { before, docs };
  });
  expect(result.docs).toEqual(result.before);
});

test("038 retains the name of an unrecognized Medtech ability", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/038-update-medtech-role.js`
    );
    const role = {
      name: "Medtech",
      type: "role",
      system: {
        abilities: [
          { name: "Custom ability", rank: 3 },
          { name: "Surgery", rank: 4 },
        ],
      },
    };
    await new M.default().updateItem(role);
    return role.system.abilities[0];
  });
  expect(result).toMatchObject({ name: "Custom ability", rank: 3 });
});
