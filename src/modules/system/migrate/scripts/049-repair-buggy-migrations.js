import BaseMigrationScript from "../base-migration-script.js";
import { ContainerUtils } from "../../../item/mixins/cpr-container.js";

/** Repair data left behind by earlier migrations. */
export default class RepairBuggyMigrations extends BaseMigrationScript {
  static version = 49;

  static name = "Repair earlier migrations";

  static documentFilters = {
    Item: { types: ["skill", "role"], mixins: ["container"] },
    Actor: { types: [], mixins: ["container"] },
  };

  async migrateMisc() {
    const prefix = `systems/${game.system.id}/tiles/netarch/`;
    for (const scene of game.scenes.contents) {
      for (const tile of scene.tiles.contents) {
        const src = tile.texture.src;
        if (src?.startsWith(prefix)) {
          const newSrc = src.replace(/PNG/, "WebP").replace(/\.png$/, ".webp");
          if (newSrc !== src) await tile.update({ "texture.src": newSrc });
        }
      }
    }
  }

  async updateActor(doc) {
    this.constructor.repairAllowedTypes(doc);
  }

  async updateItem(doc) {
    this.constructor.repairAllowedTypes(doc);
    this.constructor.removeOldTreeFlags(doc);

    const name = doc.flags?.babele?.originalName ?? doc.name;
    if (doc.type === "skill" && doc.system?.skillType === "generic") {
      const normalized = name?.toLowerCase().replace(/\s/g, "") ?? "";
      const types = {
        localexpert: "localExpert",
        martialart: "martialArt",
        playinstrument: "playInstrument",
      };
      for (const [prefix, type] of Object.entries(types)) {
        if (normalized.startsWith(prefix)) {
          doc.system.skillType = type;
          break;
        }
      }
    }

    const oldImage =
      "systems/cyberpunk-red-core/icons/compendium/default/Default_Role.svg";
    const roles = [
      "Exec",
      "Fixer",
      "Lawman",
      "Media",
      "Medtech",
      "Netrunner",
      "Nomad",
      "Rockerboy",
      "Solo",
      "Tech",
    ];
    if (doc.type === "role" && doc.img === oldImage && roles.includes(name)) {
      doc.img = `systems/cyberpunk-red-core/icons/compendium/roles/${name.toLowerCase()}.svg`;
    }
  }

  static repairAllowedTypes(doc) {
    const types = doc.system?.installedItems?.allowedTypes;
    if (Array.isArray(types) && types.some(Array.isArray)) {
      doc.system.installedItems.allowedTypes = [
        ...new Set(types.flat(Infinity)),
      ];
    }
  }

  static removeOldTreeFlags(doc) {
    BaseMigrationScript.safeDelete(doc, "flags.cprInstallTree");
    const tree = doc.flags && ContainerUtils.getInstallTreeFlag(doc);
    if (Array.isArray(tree)) {
      for (const item of tree) this.removeOldTreeFlags(item);
    }
  }
}
