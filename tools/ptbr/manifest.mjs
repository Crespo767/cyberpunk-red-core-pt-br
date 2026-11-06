export const FORK_OWNER = "Crespo767";
export const FORK_REPO = "cyberpunk-red-core-pt-br";
export const BABELE_REQUIREMENT = {
  id: "babele",
  type: "module",
  manifest:
    "https://gitlab.com/riccisi/foundryvtt-babele/-/jobs/artifacts/2.9.1/raw/module/module.json?job=build",
  compatibility: { minimum: "2.9.1" },
};

export const LIBWRAPPER_REQUIREMENT = {
  id: "lib-wrapper",
  type: "module",
};

export const PTBR_CORE_RECOMMENDATION = {
  id: "pt-BR",
  type: "module",
  compatibility: { minimum: "13" },
};

export function forkManifest(manifest, { owner, repo }) {
  for (const field of ["id", "version"]) {
    const value = manifest[field];
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.trim() === "DUMMY_VALUE"
    ) {
      throw new Error(`Manifesto com ${field} inválido`);
    }
  }

  const url = `https://github.com/${owner}/${repo}`;
  return {
    ...manifest,
    url,
    manifest: `${url}/releases/latest/download/system.json`,
    download: `${url}/releases/download/${manifest.version}/${manifest.id}-${manifest.version}.zip`,
    relationships: {
      ...manifest.relationships,
      requires: [
        ...(manifest.relationships?.requires ?? []).filter(
          (requirement) =>
            ![BABELE_REQUIREMENT.id, LIBWRAPPER_REQUIREMENT.id].includes(
              requirement.id,
            ),
        ),
        BABELE_REQUIREMENT,
        LIBWRAPPER_REQUIREMENT,
      ],
      recommends: [
        ...(manifest.relationships?.recommends ?? []).filter(
          (recommendation) => recommendation.id !== PTBR_CORE_RECOMMENDATION.id,
        ),
        PTBR_CORE_RECOMMENDATION,
      ],
    },
  };
}
