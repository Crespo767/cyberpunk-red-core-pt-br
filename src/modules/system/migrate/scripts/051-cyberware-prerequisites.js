import BaseMigrationScript from "../base-migration-script.js";
import { CORE_PREREQUISITES } from "../../../item/core-prerequisites.js";
import { matchesCoreCyberware } from "../../../item/prerequisites.js";

export default class CyberwarePrerequisites extends BaseMigrationScript {
  static version = 51;
  static name = "Add cyberware prerequisites";
  static documentFilters = {
    Item: { types: ["cyberware"], mixins: [] },
    Actor: { types: ["character", "mook", "container"], mixins: [] },
  };

  async updateItem(doc) {
    if (doc.type !== "cyberware") return;
    const match = CORE_PREREQUISITES.find((entry) =>
      matchesCoreCyberware(doc, entry),
    );
    if (match)
      doc.system.prerequisites = {
        ...(doc.system.prerequisites || {}),
        ...structuredClone(match.prerequisites),
      };
    if (
      matchesCoreCyberware(doc, { id: "lJRnJRm5wsZRC7SK", name: "Talon Foot" })
    )
      doc.system.meatArmCompatible = true;
  }
}
