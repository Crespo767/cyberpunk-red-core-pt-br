import BaseMigrationScript from "../base-migration-script.js";

const ids = new Set([
  "6xKxgXAGcxK05CqM",
  "oeIi9BoY1WvIiqEQ",
  "dM6LI4fqDdgut7Uy",
  "u1TSFrsDP5i0KzFe",
  "2vSTximwCOxNPGJX",
  "hAx2MqVm4JuwXsSV",
  "GUT0BBUD2iKpPRoM",
]);
const names = new Set([
  "Big Knucks",
  "Rippers",
  "Scratchers",
  "Slice 'N Dice",
  "Subdermal Grip",
  "Tool Hand",
  "Wolvers",
]);

export default class MeatArmCompatibility extends BaseMigrationScript {
  static version = 50;

  static name = "Mark meat-arm compatible cyberware";

  static documentFilters = {
    Item: { types: ["cyberware"], mixins: [] },
    Actor: { types: ["character", "mook", "container"], mixins: [] },
  };

  async updateItem(doc) {
    if (doc.type !== "cyberware") return;
    const sources = [
      doc._stats?.compendiumSource,
      doc._stats?.sourceId,
      doc.flags?.core?.sourceId,
    ].filter(Boolean);
    // Match by compendium origin first; the English name is the fallback for
    // copies whose origin points elsewhere (e.g. duplicated world items).
    const compatible =
      sources.some((source) => {
        const match = source.match(
          /^Compendium\.cyberpunk-red-core\.core_cyberware\.(?:Item\.)?([^.]*)$/,
        );
        return match && ids.has(match[1]);
      }) ||
      names.has(doc.name) ||
      names.has(doc.flags?.babele?.originalName);
    if (compatible) doc.system.meatArmCompatible = true;
  }
}
