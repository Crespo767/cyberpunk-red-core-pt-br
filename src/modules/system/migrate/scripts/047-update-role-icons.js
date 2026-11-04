import BaseMigrationScript from "../base-migration-script.js";

/**
 * Applies new unique role icons to existing role items.
 */
export default class UpdateRoleIcons extends BaseMigrationScript {
  static version = 47;

  static name = "Update icons to match Role";

  static documentFilters = {
    Item: { types: ["role"], mixins: [] },
    Actor: { types: [], mixins: [] },
  };

  async updateItem(doc) {
    const oldImage =
      "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg";
    if (doc.type === "role" && doc.img === oldImage) {
      const name = doc.flags?.babele?.originalName ?? doc.name;
      if (name === "Exec") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/exec.svg";
      } else if (name === "Fixer") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/fixer.svg";
      } else if (name === "Lawman") {
        doc.img =
          "systems/cyberpunk-red-core/icons/compendium/roles/lawman.svg";
      } else if (name === "Media") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/media.svg";
      } else if (name === "Medtech") {
        doc.img =
          "systems/cyberpunk-red-core/icons/compendium/roles/medtech.svg";
      } else if (name === "Netrunner") {
        doc.img =
          "systems/cyberpunk-red-core/icons/compendium/roles/netrunner.svg";
      } else if (name === "Nomad") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/nomad.svg";
      } else if (name === "Rockerboy") {
        doc.img =
          "systems/cyberpunk-red-core/icons/compendium/roles/rockerboy.svg";
      } else if (name === "Solo") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/solo.svg";
      } else if (name === "Tech") {
        doc.img = "systems/cyberpunk-red-core/icons/compendium/roles/tech.svg";
      }
    }
  }
}
