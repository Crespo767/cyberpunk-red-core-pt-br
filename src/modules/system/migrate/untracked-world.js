/**
 * The `dataModelVersion` setting defaults to "newCprWorld" and, before 1.0.2,
 * nothing ever replaced that default: `needsMigration` compares it with a
 * number, which is always false, so worlds created from scratch skipped every
 * later migration. This module decides which real version such a world gets.
 */

/** The last data model version shipped while the setting went unrecorded. */
export const UNTRACKED_WORLD_DATA_MODEL = 49;

/**
 * Resolve the data model version to record for a world.
 *
 * @param {Number|String} current - the stored `dataModelVersion` setting
 * @param {Object} options
 * @param {Boolean} options.hasDocuments - whether the world already has actors or items
 * @param {Number} options.latest - the latest data model version of this system
 * @returns {Number|String} - the version to record, or `current` when it is already recorded
 */
export function resolveDataModelVersion(current, { hasDocuments, latest }) {
  if (current !== "newCprWorld") return current;
  // An empty world is brand new and already matches the latest data model; a
  // world with documents was created by an older release and may need the
  // migrations added since then.
  return hasDocuments ? UNTRACKED_WORLD_DATA_MODEL : latest;
}
