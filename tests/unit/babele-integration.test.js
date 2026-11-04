import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import InitializeBabeleIntegration from "../../src/modules/hooks/external/babele.js";

describe("Babele integration", () => {
  let listeners;

  beforeEach(() => {
    listeners = new Map();
    const register = (event, callback) => {
      listeners.set(event, [...(listeners.get(event) ?? []), callback]);
    };
    vi.stubGlobal("Hooks", { on: register, once: register });
    vi.stubGlobal("game", { modules: new Map([["babele", { active: true }]]) });
    vi.stubGlobal("Babele", {
      get: () => {
        throw new Error("Deprecated Babele.get() was called");
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets the translations directory when Babele initializes", () => {
    InitializeBabeleIntegration();

    const callbacks = listeners.get("babele.init") ?? [];
    expect(callbacks).toHaveLength(1);
    const babele = { setSystemTranslationsDir: vi.fn() };
    callbacks[0](babele);
    expect(babele.setSystemTranslationsDir).toHaveBeenCalledWith("babele");
  });

  it("does not access deprecated Babele.get during init", () => {
    InitializeBabeleIntegration();

    expect(() => {
      (listeners.get("init") ?? []).forEach((callback) => callback());
    }).not.toThrow();
  });
});
