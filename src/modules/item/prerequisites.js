const SOCKET = { id: "IJarQGKk5rPayoLT", name: "Chipware Socket" };
const GLASSES = {
  id: "it4Mfyti7WPpuuYE",
  name: "Smart Glasses",
  pack: "core_gear",
};

export function matchesCoreCyberware(item, reference) {
  if (!item) return false;
  const sources = [
    item._stats?.compendiumSource,
    item._stats?.sourceId,
    item.flags?.core?.sourceId,
  ];
  const pack = reference.pack || "core_cyberware";
  const prefix = `Compendium.cyberpunk-red-core.${pack}.`;
  return (
    sources.some(
      (source) =>
        source === `${prefix}Item.${reference.id}` ||
        source === `${prefix}${reference.id}`,
    ) ||
    (reference.name &&
      (item.name === reference.name ||
        item.flags?.babele?.originalName === reference.name))
  );
}

export function evaluatePrerequisites(snapshot, item, target) {
  const requirements = item.system?.prerequisites || {};
  const installed = snapshot.items.filter((entry) => entry.system?.isInstalled);
  const pending = [];
  for (const type of requirements.foundationalTypes || []) {
    if (
      !installed.some(
        (entry) => entry.system.isFoundational && entry.system.type === type,
      )
    )
      pending.push({ type: "foundational", value: type });
  }
  if (requirements.paired) {
    const bases = installed.filter(
      (entry) =>
        entry.system.isFoundational && entry.system.type === item.system.type,
    );
    if (
      bases.length < 2 &&
      !(
        item.system.type === "cyberEye" &&
        bases.some((entry) => matchesCoreCyberware(entry, GLASSES))
      )
    )
      pending.push({ type: "paired", value: item.system.type });
  }
  for (const required of requirements.cyberware || []) {
    if (
      installed.filter((entry) => matchesCoreCyberware(entry, required))
        .length < required.count
    )
      pending.push({ type: "cyberware", ...required });
  }
  if (requirements.minBody && snapshot.body < requirements.minBody)
    pending.push({ type: "body", value: requirements.minBody });
  if (
    requirements.host &&
    !matchesCoreCyberware(target, {
      id: requirements.host,
      name: requirements.host === SOCKET.id ? SOCKET.name : undefined,
    })
  )
    pending.push({ type: "host", value: requirements.host });
  return pending;
}
