import { matchesCoreCyberware } from "./prerequisites.js";

export const SKILL_CHIPS = [
  { id: "RJLEe558aeef5kHr", name: "Skill Chip", difficulty: "typical" },
  {
    id: "BE35FKj9lWvxAxb0",
    name: "Difficult Skill Chip",
    difficulty: "difficult",
  },
];

export function effectiveSkillLevel(level, skillName, chips) {
  const active = chips.some(
    (chip) =>
      SKILL_CHIPS.some((reference) => matchesCoreCyberware(chip, reference)) &&
      chip.system.chippedSkill === skillName &&
      chip.system.isInstalled &&
      !chip.pending,
  );
  return active ? Math.max(Number(level), 3) : Number(level);
}
