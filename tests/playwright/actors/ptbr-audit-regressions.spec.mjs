import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import {
  createDocumentViaUI,
  createItemViaUI,
  expectSheetRendered,
  openItemSettings,
  setItemField,
  setItemSelected,
  chatMessageCount,
  waitForNewChatMessage,
  uniqueName,
} from "../../../tools/playwright/ui/index.mjs";
import {
  createContainerWithItem,
  setTradePartnerWithWealth,
  purchaseAllViaUI,
} from "./container-sheet-helpers.mjs";

test.beforeEach(async ({ page }) => {
  await gotoReadyWorld(page);
  await page.evaluate(() => game.settings.set("core", "language", "pt-BR"));
  await gotoReadyWorld(page);
});
test.afterEach(async ({ page }) => {
  await page.evaluate(() => game.settings.set("core", "language", "en"));
});

test("PT-BR vendor sales identify the purchaser and preserve balances", async ({
  page,
}) => {
  const itemName = uniqueName("audit-sale");
  const { actorId, sheetId } = await createContainerWithItem(page, {
    containerName: "audit-vendor",
    itemType: "gear",
    itemName,
  });
  const partner = await setTradePartnerWithWealth(page, sheetId, {
    wealth: 500,
  });
  const name = await page.evaluate((id) => game.actors.get(id).name, partner);
  await purchaseAllViaUI(page, sheetId, itemName);
  await expect
    .poll(() =>
      page.evaluate(
        (id) => game.actors.get(id).listRecords("wealth").at(-1)?.[1] || "",
        actorId,
      ),
    )
    .toContain(name);
  const result = await page.evaluate(
    ({ actorId, partner }) => ({
      record: game.actors.get(actorId).listRecords("wealth").at(-1)[1],
      vendor: game.actors.get(actorId).system.wealth.value,
      buyer: game.actors.get(partner).system.wealth.value,
    }),
    { actorId, partner },
  );
  expect(result.record).toContain(itemName);
  expect(result.record).not.toMatch(/undefined|\{\w+\}/);
  expect(result.vendor).toBe(100);
  expect(result.buyer).toBe(400);
});

for (const language of ["en", "pt-BR"]) {
  for (const blackIceDamage of ["4d6", "6d6+2"]) {
    test(`program damage targets and dice stay correct in ${language} with Black ICE damage ${blackIceDamage}`, async ({
      page,
    }) => {
      if (language !== "pt-BR") {
        await page.evaluate(
          (value) => game.settings.set("core", "language", value),
          language,
        );
        await gotoReadyWorld(page);
      }
      const damageTo = language === "pt-BR" ? "Dano a" : "Damage to";
      const nonBlackIce =
        language === "pt-BR" ? "não Black ICE" : "non Black ICE";
      const actorId = await createDocumentViaUI(page, {
        documentTab: "actors",
        type: "character",
        name: uniqueName("program-target"),
      });
      const itemId = await createItemViaUI(page, {
        type: "program",
        name: uniqueName("program-target"),
      });
      const sheetId = await expectSheetRendered(page, {
        collection: "items",
        id: itemId,
      });
      await openItemSettings(page, sheetId);
      await setItemSelected(page, {
        sheetId,
        itemId,
        name: "system.class",
        value: "antiprogramattacker",
      });
      for (const field of ["standard", "blackIce"]) {
        await setItemField(page, {
          sheetId,
          itemId,
          name: `system.damage.${field}`,
          path: `system.damage.${field}`,
          value: field === "standard" ? "4d6" : blackIceDamage,
        });
      }
      await expect(
        page
          .locator(`#${sheetId} .setting-name`)
          .filter({ hasText: `${damageTo} ${nonBlackIce}` }),
      ).toHaveCount(1);
      await expect(
        page
          .locator(`#${sheetId} .setting-name`)
          .filter({ hasText: new RegExp(`^\\s*${damageTo} Black ICE\\s*$`) }),
      ).toHaveCount(1);
      for (const target of [nonBlackIce, "Black ICE"]) {
        const formula = target === nonBlackIce ? "4d6" : blackIceDamage;
        const before = await chatMessageCount(page);
        await page.evaluate(
          async ({ actorId, itemId }) => {
            const { CPRDamageRoll } = await import(
              `/systems/${game.system.id}/modules/rolls/cpr-rolls.js`
            );
            const { default: Chat } = await import(
              `/systems/${game.system.id}/modules/chat/cpr-chat.js`
            );
            const actor = game.actors.get(actorId),
              program = game.items.get(itemId);
            const roll = CPRDamageRoll.create(
              program.name,
              program.system.damage.standard,
              "program",
            );
            roll.rollCardExtraArgs.program = program;
            roll.setNetCombat(program.name);
            roll.addMod([{ value: 3, source: "audit damage modifier" }]);
            void roll
              .handleRollDialog({ type: "click" }, actor, program)
              .then(async (confirmed) => {
                if (!confirmed) return;
                await roll.roll();
                roll.entityData = { actor: actorId, tokens: [] };
                await Chat.RenderRollCard(roll);
              });
          },
          { actorId, itemId },
        );
        const dialog = page.locator(".cpr.dialog");
        await expect(dialog).toBeVisible();
        const options = dialog.locator("select option");
        await expect(options).toHaveCount(2);
        await expect(options).toHaveText([
          `${damageTo} ${nonBlackIce}: (4d6)`,
          `${damageTo} Black ICE: (${blackIceDamage})`,
        ]);
        await dialog
          .locator("select")
          .selectOption({ label: `${damageTo} ${target}: (${formula})` });
        // Switching both ways must rebuild the dice without dropping external mods.
        await dialog.locator("select").selectOption("blackIce");
        await dialog.locator("select").selectOption("standard");
        await dialog
          .locator("select")
          .selectOption(target === nonBlackIce ? "standard" : "blackIce");
        await dialog.locator('button[data-action="confirm"]').click();
        await expect(dialog).toHaveCount(0);
        const messageId = await waitForNewChatMessage(page, before, {
          requireRoll: true,
        });
        const result = await page.evaluate((id) => {
          const message = game.messages.get(id),
            roll = message.rolls[0];
          return {
            card: message.content,
            dice: roll.dice[0].number,
            formula: roll.formula,
            total: roll.total,
          };
        }, messageId);
        expect(result.card).toContain(`${damageTo} ${target}`);
        expect(result.card).not.toMatch(/\{programType\}|undefined/);
        expect(result.dice).toBe(Number(formula[0]));
        expect(result.formula).toContain(`${formula[0]}d6`);
        if (formula.includes("+2")) expect(result.formula).toMatch(/\+\s*2/);
        expect(result.card).toContain(
          `data-total-damage="${result.total + 3}"`,
        );
      }
    });
  }
}
