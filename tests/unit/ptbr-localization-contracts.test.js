import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const load = (locale) =>
  JSON.parse(
    readFileSync(
      new URL(`../../src/lang/${locale}.json`, import.meta.url),
      "utf8",
    ),
  );
const en = load("en");
const pt = load("pt-BR");
const parameters = (value) =>
  [...new Set([...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
const format = (key, values) =>
  pt[key].replace(/\{(\w+)\}/g, (_match, name) => String(values[name]));

describe("PT-BR localization contracts", () => {
  it("localizes the installation-empty state and container settings", () => {
    const empty = format("CPR.dialog.selectInstallableItems.noOptions", {
      target: "Console de teste",
    });
    expect(empty).toContain("Console de teste");
    expect(empty).not.toMatch(/You have|If you think|undefined/);
    expect(pt["CPR.itemSheet.common.installedItemTypesAllowed"]).not.toMatch(
      /System Installable/,
    );
    expect(pt["CPR.itemSheet.common.installedItemsAllowed"]).not.toMatch(
      /Other items can/,
    );
    expect(
      parameters(pt["CPR.dialog.selectInstallableItems.noOptions"]),
    ).toEqual(parameters(en["CPR.dialog.selectInstallableItems.noOptions"]));
  });
  it.each([
    ["CPR.actorSheets.commonActions.new", { item: "Armadura de teste" }],
    [
      "CPR.dialog.selectCompatibleAmmo.selectCompatibleAmmo",
      { name: "Pistola de teste" },
    ],
    ["CPR.ledger.title", { property: "Humanidade de teste" }],
    ["CPR.rolls.rollingFor", { rollTitle: "Atletismo de teste" }],
  ])("preserves the caller's context in %s", (key, values) => {
    expect(parameters(pt[key])).toEqual(parameters(en[key]));
    for (const value of Object.values(values))
      expect(format(key, values)).toContain(value);
  });
  it("resolves complete localization references in the audited callers", () => {
    const files = [
      "modules/actor/sheet/cpr-character-sheet.js",
      "modules/chat/cpr-chat.js",
      "modules/item/types/cpr-cyberdeck.js",
      "modules/item/types/cpr-role.js",
      "modules/system/config.js",
      "modules/system/settings.js",
      "templates/actor/character/right-pane/tabs/gear/cpr-armor-content.hbs",
    ];
    const missing = [];
    for (const file of files) {
      const source = readFileSync(
        new URL(`../../src/${file}`, import.meta.url),
        "utf8",
      );
      for (const [, key] of source.matchAll(/["'](CPR\.[\w.-]+)["']/g)) {
        if (key.endsWith(".")) continue; // Prefixes completed at runtime are not keys.
        if (!(key in en) || !(key in pt)) missing.push(`${file}: ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });
  it("distinguishes program damage targets even when damage formulas are equal", () => {
    const key = "CPR.itemSheet.program.damageTo";
    expect(parameters(pt[key])).toEqual(parameters(en[key]));
    const labels = ["Black ICE", "Não Black ICE"].map((programType) =>
      format(key, { programType }),
    );
    expect(labels[0]).not.toBe(labels[1]);
    expect(labels[0]).toContain("Black ICE");
    expect(labels[1]).toContain("Não Black ICE");
  });
  it("orders the role abilities heading naturally in Portuguese", () => {
    const key = "CPR.characterSheet.bottomPane.role.abilitiesOf";
    // Other locales fall back to the English pattern, which keeps their
    // existing "{role} {abilities}" order and wording.
    expect(parameters(en[key])).toEqual(["abilities", "role"]);
    expect(format(key, { role: "Executivo", abilities: "Talentos" })).toBe(
      "Talentos de Executivo",
    );
    const template = readFileSync(
      new URL(
        "../../src/templates/actor/character/bottom-pane/cpr-role-tab.hbs",
        import.meta.url,
      ),
      "utf8",
    );
    expect(template).toContain(key);
  });
  it("records the purchaser in a vendor sale using the caller's parameters", () => {
    const key = "CPR.containerSheet.tradeLog.vendorSold";
    expect(parameters(pt[key])).toEqual(parameters(en[key]));
    const text = format(key, {
      name: "Arma de teste",
      quantity: 2,
      purchaser: "Cliente de teste",
      price: 100,
    });
    for (const value of ["Arma de teste", "2", "Cliente de teste", "100"])
      expect(text).toContain(value);
    expect(text).not.toMatch(/undefined|\{\w+\}/);
  });
});
