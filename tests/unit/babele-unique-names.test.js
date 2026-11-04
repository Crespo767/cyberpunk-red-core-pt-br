import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Two different entries of one compendium with the same translated name are
// indistinguishable on sheets and in the NET (e.g. the Flak and Armor programs).
const DIR = "src/babele/pt-BR";
const packs = readdirSync(DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => [file, JSON.parse(readFileSync(`${DIR}/${file}`, "utf8"))])
  .filter(([, { entries }]) => entries && !Array.isArray(entries));

describe.each(packs)("%s", (file, { entries }) => {
  it("gives each entry a distinct translated name", () => {
    const seen = new Map();
    const duplicates = [];
    for (const [original, entry] of Object.entries(entries)) {
      const name = entry?.name;
      if (!name) continue;
      if (seen.has(name))
        duplicates.push(`${name}: ${seen.get(name)} / ${original}`);
      else seen.set(name, original);
    }
    expect(duplicates).toEqual([]);
  });
});
