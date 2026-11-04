import { describe, expect, it } from "vitest";
import { forkManifest } from "../../tools/ptbr/manifest.mjs";

describe("forkManifest", () => {
  const repository = { owner: "Crespo767", repo: "cyberpunk-red-core-pt-br" };

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
    });
    expect(result).not.toBe(manifest);
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
