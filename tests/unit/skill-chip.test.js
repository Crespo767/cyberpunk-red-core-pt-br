import { describe, expect, it } from "vitest";
import { effectiveSkillLevel } from "../../src/modules/item/skill-chip.js";

const chip = (installed, pending = false) => ({
  name: "Skill Chip",
  system: { chippedSkill: "Athletics", isInstalled: installed },
  pending,
});

describe("effective skill level", () => {
  it("keeps the level without a chip", () => {
    expect(effectiveSkillLevel(1, "Athletics", [])).toBe(1);
  });
  it("raises a lower level with an installed valid chip", () => {
    expect(effectiveSkillLevel(1, "Athletics", [chip(true)])).toBe(3);
  });
  it("keeps a higher level", () => {
    expect(effectiveSkillLevel(5, "Athletics", [chip(true)])).toBe(5);
  });
  it("ignores a chip outside the socket", () => {
    expect(effectiveSkillLevel(1, "Athletics", [chip(true, true)])).toBe(1);
    expect(effectiveSkillLevel(1, "Athletics", [chip(false)])).toBe(1);
  });
});
