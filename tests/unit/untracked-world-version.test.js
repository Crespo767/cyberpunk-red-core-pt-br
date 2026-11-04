import { describe, expect, it } from "vitest";
import {
  UNTRACKED_WORLD_DATA_MODEL,
  resolveDataModelVersion,
} from "../../src/modules/system/migrate/untracked-world.js";

// A world created from scratch keeps the "newCprWorld" default forever unless
// the system records a real version, so later migrations would never run.
describe("resolveDataModelVersion", () => {
  it("records the latest version for an empty new world", () => {
    expect(
      resolveDataModelVersion("newCprWorld", {
        hasDocuments: false,
        latest: 50,
      }),
    ).toBe(50);
  });

  it("treats an untracked world with documents as the last untracked version", () => {
    expect(UNTRACKED_WORLD_DATA_MODEL).toBe(49);
    expect(
      resolveDataModelVersion("newCprWorld", {
        hasDocuments: true,
        latest: 50,
      }),
    ).toBe(49);
  });

  it("keeps a version that is already recorded", () => {
    expect(
      resolveDataModelVersion(42, { hasDocuments: true, latest: 50 }),
    ).toBe(42);
    expect(
      resolveDataModelVersion(50, { hasDocuments: false, latest: 50 }),
    ).toBe(50);
  });
});
