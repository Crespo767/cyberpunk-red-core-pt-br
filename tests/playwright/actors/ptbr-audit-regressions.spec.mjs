import { test, expect } from "@playwright/test";
import { gotoReadyWorld } from "../../../tools/playwright/session/world.mjs";
import { uniqueName } from "../../../tools/playwright/ui/index.mjs";
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
