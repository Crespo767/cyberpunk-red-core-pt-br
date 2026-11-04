import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { FORK_OWNER, FORK_REPO, forkManifest } from "./manifest.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const dist = path.join(root, "dist");
const stage = path.join(dist, "stage");
const sourceManifest = JSON.parse(
  readFileSync(path.join(root, "src/system.json"), "utf8"),
);
forkManifest(sourceManifest, { owner: FORK_OWNER, repo: FORK_REPO });

execSync("npx gulp build", {
  cwd: root,
  env: { ...process.env, FOUNDRY_DATA_PATH: stage },
  stdio: "inherit",
});

const systemDir = path.join(stage, "Data", "systems", sourceManifest.id);
const manifestPath = path.join(systemDir, "system.json");
const builtManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const manifest = forkManifest(builtManifest, {
  owner: FORK_OWNER,
  repo: FORK_REPO,
});
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
writeFileSync(manifestPath, manifestJson);
writeFileSync(path.join(dist, "system.json"), manifestJson);

const zipPath = path.join(dist, `${manifest.id}-${manifest.version}.zip`);
const zip = new AdmZip();
zip.addLocalFolder(systemDir);
zip.writeZip(zipPath);

console.log(`ZIP: ${zipPath}`);
console.log(`Versão: ${manifest.version}`);
console.log(`url: ${manifest.url}`);
console.log(`manifest: ${manifest.manifest}`);
console.log(`download: ${manifest.download}`);
