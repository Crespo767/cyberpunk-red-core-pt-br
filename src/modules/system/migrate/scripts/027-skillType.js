import BaseMigrationScript from "../base-migration-script.js";

export default class SkillTypeMigration extends BaseMigrationScript {
  static version = 27;

  static name = "Item: Skill Type";

  static documentFilters = {
    Item: { types: ["skill"], mixins: [] },
    Actor: { types: [], mixins: [] },
  };

  async updateItem(doc) {
    const itemName = doc.name.toLowerCase();
    const normalizedName = itemName.replaceAll(" ", "");

    // Set the skill type based on the name
    if (itemName.startsWith("language")) {
      doc.system.skillType = "language";
    } else if (itemName.startsWith("science")) {
      doc.system.skillType = "science";
    } else if (normalizedName.startsWith("localexpert")) {
      doc.system.skillType = "localExpert";
    } else if (normalizedName.startsWith("martialart")) {
      doc.system.skillType = "martialArt";
    } else if (normalizedName.startsWith("playinstrument")) {
      doc.system.skillType = "playInstrument";
    } else {
      doc.system.skillType = "generic";
    }

    // Make the old "base" skills deleteable
    const oldSkills = [
      "local expert (your home)",
      "science",
      "play instrument",
      "martial arts",
      "local expert",
    ];

    if (oldSkills.includes(itemName)) {
      doc.system.core = false;
    }
  }
}
