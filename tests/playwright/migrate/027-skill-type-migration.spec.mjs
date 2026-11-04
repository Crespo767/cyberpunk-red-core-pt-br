import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 027 classifies skills by name, defaulting to generic, and makes
 * five old base skills deletable by setting their core flag to false.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("027 classifies recognized prefixes and preserves unrelated fields", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/027-skillType.js`
    );
    const migration = new M.default();
    const names = [
      "Language (English)",
      "SCIENCE (Biology)",
      "LocalExpert (Home)",
      "MartialArt (Judo)",
      "PlayInstrument (Piano)",
      "Athletics",
    ];
    const skills = names.map((name) => ({
      name,
      type: "skill",
      system: { core: true, extra: 7 },
    }));
    for (const skill of skills) await migration.updateItem(skill);
    const first = structuredClone(skills);
    for (const skill of skills) await migration.updateItem(skill);
    return {
      first,
      second: skills,
      gearAllowed: migration.allowedDocTypes.Item.has("gear"),
    };
  });
  expect(out.first.map((skill) => skill.system.skillType)).toEqual([
    "language",
    "science",
    "localExpert",
    "martialArt",
    "playInstrument",
    "generic",
  ]);
  expect(
    out.first.every((skill) => skill.system.core && skill.system.extra === 7),
  ).toBe(true);
  expect(out.second).toEqual(out.first);
  expect(out.gearAllowed).toBe(false);
});

test("027 makes each legacy base skill deletable", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/027-skillType.js`
    );
    const migration = new M.default();
    const names = [
      "Local Expert (Your Home)",
      "Science",
      "Play Instrument",
      "Martial Arts",
      "Local Expert",
      "Athletics",
    ];
    const skills = names.map((name) => ({ name, system: { core: true } }));
    for (const skill of skills) await migration.updateItem(skill);
    return skills.map((skill) => skill.system.core);
  });
  expect(out).toEqual([false, false, false, false, false, true]);
});

test("027 classifies skill names containing spaces", async ({ page }) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/027-skillType.js`
    );
    const migration = new M.default();
    const names = [
      "Local Expert (Watson)",
      "Martial Arts (Judo)",
      "Play Instrument (Piano)",
    ];
    const skills = names.map((name) => ({ name, system: {} }));
    for (const skill of skills) await migration.updateItem(skill);
    return skills.map((skill) => skill.system.skillType);
  });
  expect(out).toEqual(["localExpert", "martialArt", "playInstrument"]);
});
