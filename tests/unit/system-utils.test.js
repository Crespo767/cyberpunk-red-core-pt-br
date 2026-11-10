import { afterEach, describe, it, expect, vi } from "vitest";

import SystemUtils from "../../src/modules/utils/cpr-systemUtils.js";

const makeThemeDocument = ({ prefersDark = false } = {}) => {
  const attributes = new Map();
  const documentElement = {
    setAttribute: vi.fn((name, value) => attributes.set(name, value)),
    toggleAttribute: vi.fn((name, force) => {
      if (force) attributes.set(name, "");
      else attributes.delete(name);
      return force;
    }),
    getAttribute: (name) => attributes.get(name) ?? null,
    hasAttribute: (name) => attributes.has(name),
  };

  return {
    documentElement,
    defaultView: {
      matchMedia: vi.fn(() => ({ matches: prefersDark })),
    },
  };
};

const mockThemeSettings = ({
  theme = "auto",
  themeFoundry = false,
  uiConfig = {},
} = {}) => {
  vi.spyOn(game.settings, "get").mockImplementation((namespace, key) => {
    if (namespace === game.system.id && key === "theme") return theme;
    if (namespace === game.system.id && key === "themeFoundry") {
      return themeFoundry;
    }
    if (namespace === "core" && key === "uiConfig") return uiConfig;
    return undefined;
  });
  return vi.spyOn(game.settings, "set").mockResolvedValue(undefined);
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/**
 * Tier-2 examples: `cpr-systemUtils.js` imports only the logger and touches no
 * Foundry globals at import time, so it loads under the setup shim. `slugify` is
 * pure logic; `Localize`/`Format` delegate to the stubbed `game.i18n`.
 */
describe("CPRSystemUtils.slugify", () => {
  it("removes spaces and lower-cases the first character", () => {
    expect(SystemUtils.slugify("First Aid")).toBe("firstAid");
  });

  it("joins a '/' skill name with 'And'", () => {
    expect(SystemUtils.slugify("Evasion/Dance")).toBe("evasionAndDance");
  });

  it("joins an '&' skill name with 'And'", () => {
    expect(SystemUtils.slugify("Composition & Education")).toBe(
      "compositionAndEducation",
    );
  });

  it("uses the 'Or' form for the special-cased '/' skills", () => {
    // Resist Torture/Drugs is one of the explicit "Or" special cases.
    expect(SystemUtils.slugify("Resist Torture/Drugs")).toBe(
      "resistTortureOrDrugs",
    );
  });
});

describe("CPRSystemUtils.GetCompendiumDoc", () => {
  const stubPack = (entries) => {
    const pack = {
      index: { contents: entries },
      getDocument: vi.fn(async (id) => ({ id })),
    };
    vi.stubGlobal("game", { ...game, packs: { get: () => pack } });
    return pack;
  };

  it("finds a document by its current name", async () => {
    stubPack([{ _id: "a", name: "First Two Floors (The Lobby)" }]);

    expect(
      await SystemUtils.GetCompendiumDoc(
        "pack",
        "First Two Floors (The Lobby)",
      ),
    ).toEqual({ id: "a" });
  });

  it("finds a Babele-translated document by its original name", async () => {
    stubPack([
      {
        _id: "a",
        name: "Todos os Outros Andares (Básico)",
        flags: { babele: { originalName: "All Other Floors (Basic)" } },
      },
      {
        _id: "b",
        name: "Primeiros Dois Andares (O Saguão)",
        flags: { babele: { originalName: "First Two Floors (The Lobby)" } },
      },
    ]);

    expect(
      await SystemUtils.GetCompendiumDoc(
        "pack",
        "First Two Floors (The Lobby)",
      ),
    ).toEqual({ id: "b" });
  });

  it("prefers the current name over another entry's original name", async () => {
    stubPack([
      { _id: "a", name: "Outro", flags: { babele: { originalName: "Smash" } } },
      { _id: "b", name: "Smash" },
    ]);

    expect(await SystemUtils.GetCompendiumDoc("pack", "Smash")).toEqual({
      id: "b",
    });
  });

  it("returns undefined when no document matches", async () => {
    const pack = stubPack([{ _id: "a", name: "Asp" }]);

    expect(await SystemUtils.GetCompendiumDoc("pack", "Missing")).toBe(
      undefined,
    );
    expect(pack.getDocument).not.toHaveBeenCalled();
  });
});

describe("CPRSystemUtils.FormatDvLabel", () => {
  it("keeps the English label for untranslated tables", () => {
    vi.spyOn(game.i18n, "localize").mockReturnValue("DV");

    expect(SystemUtils.FormatDvLabel("17", "DV Assault Rifle")).toBe(
      "DV: 17 Assault Rifle",
    );
  });

  it("uses the localized abbreviation and strips it from translated tables", () => {
    vi.spyOn(game.i18n, "localize").mockReturnValue("VD");

    expect(SystemUtils.FormatDvLabel("17", "VD Fuzil de Assalto")).toBe(
      "VD: 17 Fuzil de Assalto",
    );
  });

  it("strips the English prefix from untranslated tables in other languages", () => {
    vi.spyOn(game.i18n, "localize").mockReturnValue("VD");

    expect(SystemUtils.FormatDvLabel("15", "DV Custom Table")).toBe(
      "VD: 15 Custom Table",
    );
  });

  it("leaves table names without a prefix untouched", () => {
    vi.spyOn(game.i18n, "localize").mockReturnValue("VD");

    expect(SystemUtils.FormatDvLabel("13", "Minha Tabela")).toBe(
      "VD: 13 Minha Tabela",
    );
  });
});

describe("CPRSystemUtils.Localize / Format", () => {
  it("Localize delegates to game.i18n.localize", () => {
    // The shim echoes the key back.
    expect(SystemUtils.Localize("CPR.global.stats.body")).toBe(
      "CPR.global.stats.body",
    );
  });

  it("Format substitutes {placeholders} from the data object", () => {
    expect(SystemUtils.Format("Applied {amount} damage", { amount: 10 })).toBe(
      "Applied 10 damage",
    );
  });
});

describe("CPRSystemUtils.SetTheme", () => {
  it("follows Foundry's application theme in automatic mode", () => {
    const themeDocument = makeThemeDocument();
    vi.stubGlobal("document", themeDocument);
    vi.stubGlobal("window", themeDocument.defaultView);
    const setSetting = mockThemeSettings({
      uiConfig: {
        colorScheme: { applications: "light", interface: "dark" },
      },
    });

    SystemUtils.SetTheme();

    expect(themeDocument.documentElement.getAttribute("data-cpr-theme")).toBe(
      "light",
    );
    expect(
      themeDocument.documentElement.hasAttribute("data-cpr-theme-foundry"),
    ).toBe(false);
    expect(setSetting).not.toHaveBeenCalled();
  });

  it("falls back to the browser preference when Foundry uses automatic mode", () => {
    const themeDocument = makeThemeDocument({ prefersDark: true });
    vi.stubGlobal("document", themeDocument);
    vi.stubGlobal("window", themeDocument.defaultView);
    mockThemeSettings({
      uiConfig: { colorScheme: { applications: "", interface: "" } },
    });

    SystemUtils.SetTheme();

    expect(themeDocument.defaultView.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)",
    );
    expect(themeDocument.documentElement.getAttribute("data-cpr-theme")).toBe(
      "dark",
    );
  });

  it("extends an explicit CPR variant to Foundry without dropping UI config", async () => {
    const themeDocument = makeThemeDocument();
    vi.stubGlobal("document", themeDocument);
    vi.stubGlobal("window", themeDocument.defaultView);
    const uiConfig = {
      uiScale: 1.1,
      colorScheme: {
        applications: "light",
        interface: "",
      },
      chatNotifications: "cards",
    };
    const setSetting = mockThemeSettings({
      theme: "dark",
      themeFoundry: true,
      uiConfig,
    });

    await SystemUtils.SetTheme();

    expect(themeDocument.documentElement.getAttribute("data-cpr-theme")).toBe(
      "dark",
    );
    expect(
      themeDocument.documentElement.hasAttribute("data-cpr-theme-foundry"),
    ).toBe(true);
    expect(setSetting).toHaveBeenCalledOnce();
    expect(setSetting).toHaveBeenCalledWith("core", "uiConfig", {
      ...uiConfig,
      colorScheme: {
        applications: "dark",
        interface: "dark",
      },
    });
  });

  it("does not rewrite an already-matching Foundry variant", () => {
    const themeDocument = makeThemeDocument();
    vi.stubGlobal("document", themeDocument);
    vi.stubGlobal("window", themeDocument.defaultView);
    const setSetting = mockThemeSettings({
      theme: "light",
      themeFoundry: true,
      uiConfig: {
        colorScheme: { applications: "light", interface: "light" },
      },
    });

    SystemUtils.SetTheme();

    expect(setSetting).not.toHaveBeenCalled();
  });

  it("themes a pop-out document without rewriting the main client setting", () => {
    const mainDocument = makeThemeDocument();
    const popOutDocument = makeThemeDocument();
    vi.stubGlobal("document", mainDocument);
    vi.stubGlobal("window", mainDocument.defaultView);
    const setSetting = mockThemeSettings({
      theme: "dark",
      themeFoundry: true,
      uiConfig: {
        colorScheme: { applications: "light", interface: "light" },
      },
    });

    SystemUtils.SetTheme({ ownerDocument: popOutDocument });

    expect(popOutDocument.documentElement.getAttribute("data-cpr-theme")).toBe(
      "dark",
    );
    expect(
      popOutDocument.documentElement.hasAttribute("data-cpr-theme-foundry"),
    ).toBe(true);
    expect(mainDocument.documentElement.getAttribute("data-cpr-theme")).toBe(
      null,
    );
    expect(setSetting).not.toHaveBeenCalled();
  });
});

describe("CPRSystemUtils source formatting", () => {
  // page: 0 entries format to the bare book name, so the shim yields distinct,
  // assertable strings without resolving the "…entry.source" template.
  const core = { book: "Core", page: 0 };
  const chrome = { book: "Black Chrome", page: 0 };
  const iface = { book: "Interface RED", page: 0 };

  describe("FormatSourceList", () => {
    it("returns one formatted citation per book-having entry", () => {
      expect(SystemUtils.FormatSourceList([core, chrome])).toEqual([
        "Core",
        "Black Chrome",
      ]);
    });

    it("drops entries without a book and yields [] for empty/undefined", () => {
      expect(
        SystemUtils.FormatSourceList([{ book: "", page: 5 }, chrome]),
      ).toEqual(["Black Chrome"]);
      expect(SystemUtils.FormatSourceList([])).toEqual([]);
      expect(SystemUtils.FormatSourceList()).toEqual([]);
    });

    it("uses the page citation for entries with a page", () => {
      expect(SystemUtils.FormatSourceList([{ book: "Core", page: 5 }])).toEqual(
        [
          SystemUtils.Format("CPR.browser.entry.source", {
            book: "Core",
            page: 5,
          }),
        ],
      );
    });
  });

  describe("FormatSources", () => {
    it("comma-joins every book-having citation", () => {
      expect(SystemUtils.FormatSources([core, chrome, iface])).toBe(
        "Core, Black Chrome, Interface RED",
      );
    });

    it("yields '' for empty/undefined", () => {
      expect(SystemUtils.FormatSources([])).toBe("");
      expect(SystemUtils.FormatSources()).toBe("");
    });
  });

  describe("FormatSourceDisplay", () => {
    it("shows the first source and hides the rest, one per <br> line", () => {
      expect(SystemUtils.FormatSourceDisplay([core, chrome, iface])).toEqual({
        source: "Core",
        sourceTooltip: "Black Chrome<br>Interface RED",
      });
    });

    it("gives a single source no tooltip", () => {
      expect(SystemUtils.FormatSourceDisplay([core])).toEqual({
        source: "Core",
        sourceTooltip: "",
      });
    });

    it("gives an empty/undefined list a blank display", () => {
      expect(SystemUtils.FormatSourceDisplay([])).toEqual({
        source: "",
        sourceTooltip: "",
      });
      expect(SystemUtils.FormatSourceDisplay()).toEqual({
        source: "",
        sourceTooltip: "",
      });
    });

    it("ignores blank entries when choosing the first source", () => {
      expect(
        SystemUtils.FormatSourceDisplay([{ book: "", page: 0 }, core, chrome]),
      ).toEqual({ source: "Core", sourceTooltip: "Black Chrome" });
    });
  });
});
