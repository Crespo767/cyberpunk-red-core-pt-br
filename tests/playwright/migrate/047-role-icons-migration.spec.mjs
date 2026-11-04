import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

/*
 * Migration 047 assigns distinct icons to the ten named role items when they
 * still use the old default role icon. Other types, names and icons are preserved.
 */
test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("047 assigns each role its icon and stays idempotent", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/047-update-role-icons.js`
    );
    const migration = new M.default();
    const names = [
      "Exec",
      "Fixer",
      "Lawman",
      "Media",
      "Medtech",
      "Netrunner",
      "Nomad",
      "Rockerboy",
      "Solo",
      "Tech",
    ];
    const old =
      "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg";
    const items = names.map((name) => ({
      type: "role",
      name,
      img: old,
      system: { marker: 1 },
    }));
    for (const item of items) await migration.updateItem(item);
    const once = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { version: M.default.version, once, twice: items };
  });
  const names = [
    "Exec",
    "Fixer",
    "Lawman",
    "Media",
    "Medtech",
    "Netrunner",
    "Nomad",
    "Rockerboy",
    "Solo",
    "Tech",
  ];
  expect(out.version).toBe(47);
  expect(out.once).toEqual(
    names.map((name) => ({
      type: "role",
      name,
      img: `systems/cyberpunk-red-core/icons/compendium/roles/${name.toLowerCase()}.svg`,
      system: { marker: 1 },
    })),
  );
  expect(out.twice).toEqual(out.once);
});

test("047 preserves other types, unknown roles and custom icons", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/047-update-role-icons.js`
    );
    const migration = new M.default();
    const old =
      "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg";
    const items = [
      { type: "gear", name: "Exec", img: old },
      { type: "role", name: "Custom Role", img: old },
      { type: "role", name: "Exec", img: "custom/exec.svg" },
      {
        type: "role",
        name: "Exec",
        img: "systems/cyberpunk-red-core/icons/compendium/roles/exec.svg",
      },
    ];
    const before = structuredClone(items);
    for (const item of items) await migration.updateItem(item);
    return { items, before, allowed: [...migration.allowedDocTypes.Item] };
  });
  expect(out.allowed).toEqual(["role"]);
  expect(out.items).toEqual(out.before);
});

test.fixme("047 assigns role icons using Babele original names", async ({
  page,
}) => {
  const out = await page.evaluate(async () => {
    const M = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/047-update-role-icons.js`
    );
    const item = {
      type: "role",
      name: "Executivo",
      img: "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg",
      flags: { babele: { originalName: "Exec" } },
    };
    await new M.default().updateItem(item);
    return item.img;
  });
  expect(out).toBe(
    "systems/cyberpunk-red-core/icons/compendium/roles/exec.svg",
  );
});
