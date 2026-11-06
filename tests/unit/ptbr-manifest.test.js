import { describe, expect, it } from "vitest";
import {
  forkManifest,
  PTBR_CORE_RECOMMENDATION,
} from "../../tools/ptbr/manifest.mjs";

describe("forkManifest", () => {
  const repository = { owner: "Crespo767", repo: "cyberpunk-red-core-pt-br" };
  const babele = {
    id: "babele",
    type: "module",
    manifest:
      "https://gitlab.com/riccisi/foundryvtt-babele/-/jobs/artifacts/2.9.1/raw/module/module.json?job=build",
    compatibility: { minimum: "2.9.1" },
  };

  const ptbrCore = {
    id: "pt-BR",
    type: "module",
    compatibility: { minimum: "13" },
  };
  const libWrapper = { id: "lib-wrapper", type: "module" };

  it("exporta a recomendação oficial do core em PT-BR", () => {
    expect(PTBR_CORE_RECOMMENDATION).toEqual(ptbrCore);
  });

  it("atualiza as URLs sem alterar os outros campos nem a entrada", () => {
    const manifest = {
      id: "cyberpunk-red-core",
      version: "0.93.0-ptbr.1",
      url: "https://example.com",
      manifest: "https://example.com/system.json",
      download: "https://example.com/system.zip",
      compatibility: { minimum: "13", verified: "13" },
      title: "Cyberpunk RED Core",
    };
    const original = structuredClone(manifest);
    const result = forkManifest(manifest, repository);

    expect(result).toEqual({
      ...original,
      url: "https://github.com/Crespo767/cyberpunk-red-core-pt-br",
      manifest:
        "https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/latest/download/system.json",
      download:
        "https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/download/0.93.0-ptbr.1/cyberpunk-red-core-0.93.0-ptbr.1.zip",
      relationships: { requires: [babele, libWrapper], recommends: [ptbrCore] },
    });
    expect(result).not.toBe(manifest);
    expect(manifest).toEqual(original);
  });

  it("preserva outras relações e não duplica as dependências nem a recomendação PT-BR", () => {
    const manifest = {
      id: "sistema",
      version: "1.0",
      relationships: {
        requires: [
          { id: "outro", type: "module" },
          { id: "babele" },
          { id: "lib-wrapper", manifest: "https://example.com/old.json" },
          { id: "lib-wrapper" },
        ],
        recommends: [
          { id: "recomendado", type: "module" },
          { id: "pt-BR", manifest: "https://example.com/old.json" },
          { id: "pt-BR" },
        ],
        conflicts: [{ id: "incompatível", type: "module" }],
      },
    };
    const original = structuredClone(manifest);

    const result = forkManifest(manifest, repository);

    expect(result.relationships).toEqual({
      requires: [{ id: "outro", type: "module" }, babele, libWrapper],
      recommends: [original.relationships.recommends[0], ptbrCore],
      conflicts: original.relationships.conflicts,
    });
    expect(manifest).toEqual(original);
  });

  it.each(["version", "id"])("rejeita %s vazio ou DUMMY_VALUE", (field) => {
    for (const value of ["", " ", "DUMMY_VALUE", undefined]) {
      expect(() =>
        forkManifest(
          { id: "sistema", version: "1.0", [field]: value },
          repository,
        ),
      ).toThrow();
    }
  });
});
