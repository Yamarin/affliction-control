// affliction-chat-import.js
// Prototype: Instantly create an affliction effect from a right-clicked poison/affliction chat card

Hooks.on('getChatLogEntryContext', (html, options) => {
  options.unshift({
    name: 'Add Affliction Effect to Selected Token',
    icon: '<i class="fas fa-skull-crossbones"></i>',
    condition: li => {
      // Only show for PF2e poison/affliction cards (look for .pf2e.action-card and "Poison" tag)
      const card = li.find('.pf2e.action-card, .pf2e.chat-card');
      if (!card.length) return false;
      const tags = card.find('.tags .tag').map((_, el) => el.textContent.trim().toLowerCase()).get();
  return tags.includes('poison') || tags.includes('disease') || tags.includes('affliction') || tags.includes('curse');
    },
    callback: li => {
      const card = li.find('.pf2e.action-card, .pf2e.chat-card');
      if (!card.length) return ui.notifications.warn('No affliction card found.');
  // Extract name, removing any action glyphs (like <span class='action-glyph'>2</span>)
  let nameElem = card.find('header.card-header h3').clone();
  nameElem.find('.action-glyph').remove();
  let baseName = nameElem.text().trim() || 'Affliction';
  // Determine affliction type for label
  let type = '';
  const tags = card.find('.tags .tag').map((_, el) => el.textContent.trim().toLowerCase()).get();
  if (tags.includes('poison')) type = 'Poison';
  else if (tags.includes('disease')) type = 'Disease';
  else if (tags.includes('curse')) type = 'Curse';
  else if (tags.includes('affliction')) type = 'Affliction';
  const name = type ? `${baseName} (${type})` : baseName;
      // Extract duration
      let duration = null;
      let durationUnit = 'unlimited';
      const durMatch = card.find('.card-content').text().match(/Maximum Duration\s*(\d+)/i);
      if (durMatch) {
        duration = parseInt(durMatch[1]);
        durationUnit = 'rounds';
      }
      // Extract stages
      const stages = [];
      card.find('.card-content p').each((_, el) => {
        // Only match paragraphs that start with 'Stage X' as a whole word
        const text = $(el).text().trim();
        // Ignore paragraphs that start with a number or 'R' (for action/reaction icons)
        if (/^(\d+|R)\b/.test(text)) return;
        const stageMatch = text.match(/^Stage (\d+)/i);
        if (stageMatch) {
          stages.push(`Stage ${stageMatch[1]}`);
        }
      });
      // Extract description (all card content), but remove all consecutive header paragraphs at the top (spell/system info)
      let descElem = card.find('.card-content').clone();
      // Remove all consecutive header paragraphs at the top, but always keep 'Saving Throw' and 'Save'
      const headerKeywords = /^(Range|Targets|Target|Requirements|Trigger|Area|Defense|Duration|Cost|Cast|Casting|Check|Effect|Frequency|Success|Failure|Critical Success|Critical Failure)\b/i;
      let ps = descElem.find('p');
      while (ps.length) {
        const text = $(ps[0]).text().trim();
        if (/^(Saving Throw|Save)\b/i.test(text)) break;
        if (headerKeywords.test(text)) {
          $(ps[0]).remove();
          ps = descElem.find('p');
        } else {
          break;
        }
      }
      const description = descElem.html();
      // Find selected token
      const token = canvas.tokens.controlled[0];
      if (!token || !token.actor) return ui.notifications.warn('Please select a token.');
      // Try to get the source icon from the chat card (e.g., spell or item icon)
      let effectImg = card.find('header.card-header img').attr('src') || 'icons/svg/poison.svg';

      // Build effectData
      const system = {
        description: { value: description },
        duration: { value: duration, unit: durationUnit, sustained: false, expiry: 'turn-end' }
      };
      if (stages.length) {
        system.badge = {
          type: 'counter',
          value: 1,
          min: 1,
          max: stages.length,
          labels: stages,
          loop: false
        };
      }
      const effectData = {
        name,
        type: 'effect',
        img: effectImg,
        system,
        flags: { 'affliction-control': { affliction: true, stages: stages.length || 3, stage: 1 } },
      };
      token.actor.createEmbeddedDocuments('Item', [effectData]);
      ui.notifications.info('Affliction effect added from chat card.');
    }
  });
});
