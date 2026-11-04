import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

function isNewer(version, minimum) {
  const parts = String(version).split(".");
  const minimumParts = String(minimum).split(".");
  for (let i = 0; i < Math.max(parts.length, minimumParts.length); i += 1) {
    const left = parts[i] ?? "0";
    const right = minimumParts[i] ?? "0";
    const numeric = /^\d+$/.test(left) && /^\d+$/.test(right);
    const a = numeric ? Number(left) : left;
    const b = numeric ? Number(right) : right;
    if (a !== b) return a > b;
  }
  return false;
}

function yamlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return yamlFiles(file);
    return entry.isFile() && entry.name.endsWith(".yaml") ? [file] : [];
  });
}

function hasNewerStats(value, minimum) {
  if (!value || typeof value !== "object") return false;
  if (
    value._stats?.coreVersion != null &&
    isNewer(value._stats.coreVersion, minimum)
  ) {
    return true;
  }
  return Object.values(value).some((child) => hasNewerStats(child, minimum));
}

describe("compendium core versions", () => {
  it.each([
    ["13", "13.350", false],
    ["13.350", "13", true],
    ["13.351", "13.350", true],
    ["13.9", "13.350", false],
    ["13.350.0", "13.350", false],
    ["13.beta", "13.alpha", true],
  ])("compares %s against %s", (version, minimum, expected) => {
    expect(isNewer(version, minimum)).toBe(expected);
  });

  it("does not require a core newer than the system minimum", () => {
    const manifest = JSON.parse(readFileSync("src/system.json", "utf8"));
    const minimum = manifest.compatibility.minimum;
    const offenders = yamlFiles("src/packs").filter((file) =>
      hasNewerStats(yaml.load(readFileSync(file, "utf8")), minimum),
    );
    expect(
      offenders,
      `Core versions newer than ${minimum}:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
