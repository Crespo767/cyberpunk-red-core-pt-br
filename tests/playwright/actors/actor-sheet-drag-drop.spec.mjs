import { test, expect } from "@playwright/test";
import { installConsoleErrorHarness } from "../../../tools/playwright/session/console-harness.mjs";
import {
  closeDocSheet,
  createActorViaUI,
  deleteActorViaUI,
  expectSheetRendered,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";

installConsoleErrorHarness();

test.describe("Actor sheet drag-and-drop handlers", () => {
  for (const type of ["character", "mook", "container"]) {
    test(`opening a ${type} sheet does not access the deprecated global DragDrop`, async ({
      page,
    }) => {
      const actorId = await createActorViaUI(page, {
        type,
        name: uniqueName(type),
      });
      try {
        await expectSheetRendered(page, { collection: "actors", id: actorId });
        expect(
          page.consoleWarnings.filter((warning) =>
            warning.includes('global "DragDrop"'),
          ),
        ).toEqual([]);
      } finally {
        await closeDocSheet(page, { collection: "actors", id: actorId });
        await deleteActorViaUI(page, actorId);
      }
    });
  }
});
