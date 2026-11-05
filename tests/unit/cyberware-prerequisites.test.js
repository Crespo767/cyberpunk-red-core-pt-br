import { describe, expect, it } from "vitest";
import {
  evaluatePrerequisites,
  matchesCoreCyberware,
} from "../../src/modules/item/prerequisites.js";

const base = (type, name = "Base") => ({
  name,
  system: { type, isFoundational: true, isInstalled: true },
});
const item = (prerequisites, type = "cyberEye") => ({
  system: { type, prerequisites },
});
const snapshot = (items = [], body = 5) => ({ items, body });

describe("cyberware prerequisites", () => {
  it("checks foundational types", () => {
    const target = item({ foundationalTypes: ["neuralWare"] });
    expect(evaluatePrerequisites(snapshot(), target)).toHaveLength(1);
    expect(
      evaluatePrerequisites(snapshot([base("neuralWare")]), target),
    ).toEqual([]);
  });
  it("checks pairs and treats Smart Glasses as a pair", () => {
    const target = item({ paired: true });
    expect(
      evaluatePrerequisites(snapshot([base("cyberEye")]), target),
    ).toHaveLength(1);
    expect(
      evaluatePrerequisites(
        snapshot([base("cyberEye"), base("cyberEye")]),
        target,
      ),
    ).toEqual([]);
    expect(
      evaluatePrerequisites(
        snapshot([base("cyberEye", "Smart Glasses")]),
        target,
      ),
    ).toEqual([]);
  });
  it("counts installed required cyberware and checks base BODY", () => {
    const target = item({
      cyberware: [{ id: "abc", name: "Lace", count: 2 }],
      minBody: 6,
    });
    const lace = { name: "Lace", system: { isInstalled: true } };
    expect(evaluatePrerequisites(snapshot([lace]), target)).toHaveLength(2);
    expect(evaluatePrerequisites(snapshot([lace, lace], 6), target)).toEqual(
      [],
    );
    expect(
      evaluatePrerequisites(
        snapshot([{ ...lace, system: { isInstalled: false } }, lace], 6),
        target,
      ),
    ).toHaveLength(1);
  });
  it("checks the selected host", () => {
    const target = item({ host: "IJarQGKk5rPayoLT" });
    expect(
      evaluatePrerequisites(snapshot(), target, { name: "Neural Link" }),
    ).toHaveLength(1);
    expect(
      evaluatePrerequisites(snapshot(), target, {
        _stats: {
          compendiumSource:
            "Compendium.cyberpunk-red-core.core_cyberware.Item.IJarQGKk5rPayoLT",
        },
      }),
    ).toEqual([]);
    expect(
      evaluatePrerequisites(snapshot(), target, { name: "Chipware Socket" }),
    ).toEqual([]);
  });
  it("recognizes core origin and English names, never translated names alone", () => {
    const ref = { id: "abc", name: "Lace" };
    expect(
      matchesCoreCyberware(
        {
          _stats: {
            sourceId: "Compendium.cyberpunk-red-core.core_cyberware.Item.abc",
          },
        },
        ref,
      ),
    ).toBe(true);
    expect(
      matchesCoreCyberware(
        { flags: { babele: { originalName: "Lace" } } },
        ref,
      ),
    ).toBe(true);
    expect(matchesCoreCyberware({ name: "Lace" }, ref)).toBe(true);
    expect(matchesCoreCyberware({ name: "Trama" }, ref)).toBe(false);
    expect(
      matchesCoreCyberware(
        { flags: { core: { sourceId: "Compendium.other.items.Item.abc" } } },
        ref,
      ),
    ).toBe(false);
  });
});
