import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The sheet links translated documents by their translated names, so a
// renamed table or item must be renamed everywhere that refers to it.
const load = (pack) =>
  JSON.parse(
    readFileSync(
      new URL(
        `../../src/babele/pt-BR/cyberpunk-red-core.${pack}.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  );
const names = (pack) =>
  Object.values(load(pack).entries).map((entry) => entry.name);

describe("PT-BR critical injury tables", () => {
  // _rollCriticalInjury finds the injury compendium by the table's name
  // (GetCompendiumIdByLabel) and the injury by the drawn result's text.
  const tables = Object.entries(
    load("internal_critical-injury-tables").entries,
  );
  const packFor = {
    "Critical Injuries (Body)": "core_critical-injuries-body",
    "Critical Injuries (Head)": "core_critical-injuries-head",
  };

  it.each(tables)("%s matches its compendium", (original, table) => {
    const pack = load(packFor[original]);
    expect(table.name).toBe(pack.label);
    const injuries = Object.values(pack.entries).map((entry) => entry.name);
    const results = Object.values(table.results[0]);
    expect(results.filter((result) => !injuries.includes(result))).toEqual([]);
  });
});

describe("PT-BR DV tables", () => {
  // Weapons store the translated table name; Autofire appends a literal
  // " (Autofire)" to it (cpr-loadable.js, cpr-actor-sheet.js).
  const tables = names("internal_dv-tables");

  it.each(["core_weapons", "core_cyberware", "core_upgrades"])(
    "every dvTable in %s names an existing table",
    (pack) => {
      const missing = Object.values(load(pack).entries)
        .map((entry) => entry.dvTable)
        .filter((dvTable) => dvTable && !tables.includes(dvTable));
      expect(missing).toEqual([]);
    },
  );

  it("pairs every Autofire table with its base table", () => {
    const orphans = tables
      .filter((name) => name.endsWith(" (Autofire)"))
      .filter((name) => !tables.includes(name.replace(" (Autofire)", "")));
    expect(orphans).toEqual([]);
    expect(tables.filter((name) => name.endsWith(" (Autofire)"))).toHaveLength(
      2,
    );
  });
});
