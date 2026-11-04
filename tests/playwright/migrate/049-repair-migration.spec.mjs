import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";

test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
});

test("049 repairs generic skill types using source names", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const items = [
      {
        type: "skill",
        name: "Perícia local",
        flags: { babele: { originalName: "  LOCAL Expert (Home)" } },
        system: { skillType: "generic" },
      },
      {
        type: "skill",
        name: "Martial Arts (Judo)",
        system: { skillType: "generic" },
      },
      {
        type: "skill",
        name: "play instrument (Piano)",
        system: { skillType: "generic" },
      },
    ];
    for (const item of items) await new Migration().updateItem(item);
    return items.map((item) => item.system.skillType);
  });
  expect(result).toEqual(["localExpert", "martialArt", "playInstrument"]);
});

test("049 awaits Net Architecture tile repairs", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const base = `systems/${game.system.id}/tiles/netarch`;
    const scene = await Scene.create({
      name: "049 tile repair",
      tiles: [
        { texture: { src: `${base}/PNG/floor.png` }, width: 100, height: 100 },
        { texture: { src: "other/floor.png" }, width: 100, height: 100 },
        {
          texture: { src: `${base}/WebP/floor.webp` },
          width: 100,
          height: 100,
        },
      ],
    });
    const tile = scene.tiles.contents[0];
    const original = tile.update;
    let release;
    let finished = false;
    tile.update = async function (...args) {
      await new Promise((resolve) => {
        release = resolve;
      });
      const result = await original.apply(this, args);
      finished = true;
      return result;
    };
    try {
      const pending = new Migration().migrateMisc();
      await Promise.resolve();
      let resolved = false;
      pending.then(() => {
        resolved = true;
      });
      await Promise.resolve();
      const resolvedEarly = resolved;
      release();
      await pending;
      return {
        resolvedEarly,
        finished,
        paths: scene.tiles.contents.map((entry) => entry.texture.src),
        base,
      };
    } finally {
      tile.update = original;
      await scene.delete();
    }
  });
  expect(result.resolvedEarly).toBe(false);
  expect(result.finished).toBe(true);
  expect(result.paths).toEqual([
    `${result.base}/WebP/floor.webp`,
    "other/floor.png",
    `${result.base}/WebP/floor.webp`,
  ]);
});

test("049 flattens and deduplicates nested allowed types for actors and items", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const migration = new Migration();
    const actor = {
      type: "container",
      system: {
        installedItems: {
          allowedTypes: ["program", ["cyberware", ["program", "gear"]]],
        },
      },
    };
    const item = { ...structuredClone(actor), type: "cyberware" };
    await migration.updateActor(actor);
    await migration.updateItem(item);
    return { actor, item, filters: Migration.documentFilters };
  });
  for (const doc of [result.actor, result.item])
    expect(doc.system.installedItems.allowedTypes).toEqual([
      "program",
      "cyberware",
      "gear",
    ]);
  expect(result.filters.Item.mixins).toContain("container");
  expect(result.filters.Actor.mixins).toContain("container");
});

test("049 recursively removes obsolete install tree flags", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const leaf = {
      flags: { cprInstallTree: [], [game.system.id]: { keep: 2 } },
    };
    const child = {
      flags: {
        cprInstallTree: [],
        [game.system.id]: { cprInstallTree: [leaf], keep: 1 },
      },
    };
    const item = {
      type: "cyberware",
      flags: { [game.system.id]: { cprInstallTree: [child] } },
    };
    await new Migration().updateItem(item);
    return { child, leaf, systemId: game.system.id };
  });
  for (const entry of [result.child, result.leaf])
    expect(entry.flags["-=cprInstallTree"]).toBeNull();
  expect(result.child.flags[result.systemId].keep).toBe(1);
  expect(result.leaf.flags[result.systemId].keep).toBe(2);
});

test("049 repairs every known role icon using Babele source names", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
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
    const items = names.map((name) => ({
      type: "role",
      name: "Traduzido",
      flags: { babele: { originalName: name } },
      img: "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg",
    }));
    for (const item of items) await new Migration().updateItem(item);
    return items.map((item) => item.img);
  });
  expect(result).toEqual(
    [
      "exec",
      "fixer",
      "lawman",
      "media",
      "medtech",
      "netrunner",
      "nomad",
      "rockerboy",
      "solo",
      "tech",
    ].map(
      (name) => `systems/cyberpunk-red-core/icons/compendium/roles/${name}.svg`,
    ),
  );
});

test("049 is idempotent", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const migration = new Migration();
    const items = [
      { type: "skill", name: "Local Expert", system: { skillType: "generic" } },
      {
        type: "role",
        name: "Exec",
        img: "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg",
      },
      {
        type: "cyberware",
        flags: {
          [game.system.id]: {
            cprInstallTree: [{ flags: { cprInstallTree: [] } }],
          },
        },
        system: { installedItems: { allowedTypes: [["program"], "program"] } },
      },
    ];
    const actor = {
      type: "container",
      system: { installedItems: { allowedTypes: [["program"], "program"] } },
    };
    for (const item of items) await migration.updateItem(item);
    await migration.updateActor(actor);
    const once = foundry.utils.mergeObject(
      {},
      { items, actor },
      { performDeletions: true },
    );
    const repeated = structuredClone(once);
    for (const item of repeated.items) await migration.updateItem(item);
    await migration.updateActor(repeated.actor);
    const twice = foundry.utils.mergeObject({}, repeated, {
      performDeletions: true,
    });
    return { once, twice };
  });
  expect(result.twice).toEqual(result.once);
});

test("049 preserves correct and unrelated data", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { default: Migration } = await import(
      `/systems/${game.system.id}/modules/system/migrate/scripts/049-repair-buggy-migrations.js`
    );
    const migration = new Migration();
    const old =
      "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg";
    const items = [
      {
        type: "skill",
        name: "Local Expert",
        system: { skillType: "language" },
      },
      { type: "skill", name: "Athletics", system: { skillType: "generic" } },
      { type: "gear", name: "Martial Art", system: { skillType: "generic" } },
      { type: "role", name: "Custom", img: old },
      { type: "role", name: "Exec", img: "custom.svg" },
      { type: "gear", name: "Exec", img: old },
      { type: "skill", name: "Athletics", system: { skillType: "generic" } },
      {
        type: "gear",
        flags: {
          [game.system.id]: { cprInstallTree: [{ flags: { other: true } }] },
        },
        system: {
          installedItems: { allowedTypes: ["program", "program", "gear"] },
        },
      },
      { type: "gear", system: {} },
    ];
    const actor = {
      type: "container",
      system: { installedItems: { allowedTypes: ["program", "gear"] } },
    };
    const before = structuredClone({ items, actor });
    for (const item of items) await migration.updateItem(item);
    await migration.updateActor(actor);
    return { before, after: { items, actor } };
  });
  expect(result.after).toEqual(result.before);
});
