// affliction-listener.js
// Listens for end of turn and posts chat message if Poison Affliction is present

Hooks.on('pf2e.endTurn', async (combatant, combat, userId) => {
  if (!combatant?.actor) return;
  const actor = combatant.actor;
  const allEffects = actor.itemTypes?.effect ?? [];
  // Find all affliction effects (by flag)
  const afflictionEffects = allEffects.filter(i => i.flags?.['affliction-control']?.affliction);


  // Remove effects marked as expired by the system
  const expired = afflictionEffects.filter(effect => effect.system?.expired === true);
  if (expired.length > 0) {
    await actor.deleteEmbeddedDocuments('Item', expired.map(e => e.id));
  } else {
  }

  // Re-fetch affliction effects after removal
  const activeAfflictions = actor.itemTypes?.effect?.filter(i => i.flags?.['affliction-control']?.affliction) ?? [];
  for (const effect of activeAfflictions) {
    const name = effect.name || 'Affliction';
    const desc = effect.system?.description?.value || '';
    // Try to get stage from effect badge counter (current value), fallback to flag or system
    let stage = effect.system?.badge?.value || effect.flags?.['affliction-control']?.stage || effect.system?.stage || '';
    let stageText = stage ? ` Stage ${stage}` : '';
    let content = `<b>${actor.name}</b> is affected by:<br>\n<span style='color:darkgreen'>${name}${stageText}</span>`;
    if (desc) content += `<br><em>${desc}</em>`;
    // Try to get the actor's token image (prefer token, fallback to actor img)
    let img = actor.token?.texture?.src || actor.prototypeToken?.texture?.src || actor.img;
    let token = canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
    let speaker = { alias: actor.name };
    if (token) {
      speaker.token = token.id;
      speaker.scene = token.scene.id;
    }
    ChatMessage.create({
      content,
      speaker,
    });
  }
});
