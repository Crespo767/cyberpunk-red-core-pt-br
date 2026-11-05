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
