import CPR from "../system/config.js";
import SystemUtils from "../utils/cpr-systemUtils.js";
import { evaluatePrerequisites } from "./prerequisites.js";

export function getCyberwarePending(item, target) {
  const actor = item.actor;
  if (!actor) return [];
  const docs = Array.from(actor.items);
  const byId = new Map(docs.map((doc) => [doc.id, doc]));
  const installed = new Set();
  const parents = new Map();
  const visit = (ids, parent) => {
    for (const id of ids || []) {
      if (installed.has(id) || !byId.has(id)) continue;
      installed.add(id);
      parents.set(id, parent);
      visit(byId.get(id)._source.system?.installedItems?.list, byId.get(id));
    }
  };
  visit(actor._source.system?.installedItems?.list, actor);
  const snapshot = {
    body: actor._source.system?.stats?.body?.value ?? 0,
    items: docs.map((doc) => ({
      name: doc.name,
      flags: doc.flags,
      _stats: doc._stats,
      system: {
        type: doc._source.system?.type,
        isFoundational: doc._source.system?.isFoundational,
        isInstalled: installed.has(doc.id),
      },
    })),
  };
  if (target === undefined && !installed.has(item.id)) return [];
  return evaluatePrerequisites(
    snapshot,
    item,
    target === undefined ? parents.get(item.id) : target,
  );
}

function formatPending(pending) {
  return pending
    .map((entry) => {
      const type =
        entry.value && ["foundational", "paired"].includes(entry.type)
          ? SystemUtils.Localize(CPR.cyberwareTypes[entry.value] || entry.value)
          : entry.value;
      return SystemUtils.Format(`CPR.prerequisites.${entry.type}`, {
        type,
        count: entry.count,
        name: entry.name,
        value: entry.value,
      });
    })
    .join("; ");
}

export function formatPrerequisites(item, onlyPending = true, target) {
  if (onlyPending) return formatPending(getCyberwarePending(item, target));
  const p = item.system.prerequisites || {};
  const entries = (p.foundationalTypes || []).map((value) => ({
    type: "foundational",
    value,
  }));
  if (p.paired) entries.push({ type: "paired", value: item.system.type });
  for (const requirement of p.cyberware || [])
    entries.push({ type: "cyberware", ...requirement });
  if (p.minBody) entries.push({ type: "body", value: p.minBody });
  if (p.host) entries.push({ type: "host", value: p.host });
  return (
    formatPending(entries) || SystemUtils.Localize("CPR.prerequisites.none")
  );
}
