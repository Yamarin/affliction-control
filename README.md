## Example: Sample Affliction Description

You can import an effect from a chat card or text like this:

```
Goblins and goblin dogs are immune to goblin pox.

Saving Throw DC 17 Fortitude

Stage 1 Sickened 1 (1 round)

Stage 2 sickened 1 and Slowed 1 (1 round)

Stage 3 Sickened 2 and can't reduce its sickened value below 1 (1 day)
```

The module will parse this and create an effect with the correct name, saving throw, stages, and conditions.
# Affliction Control for Foundry VTT (Pathfinder 2e)

This module helps you track afflictions (poisons, diseases, curses, etc.) on characters in Foundry VTT for Pathfinder 2e. It provides two main features:

## 1. Import Afflictions from Chat Cards
- **Right-click** on a poison, disease, curse, or affliction chat card (from spells, monsters, etc.).
- Select **"Add Affliction Effect to Selected Token"** (this option appears first in the menu).
- The module will parse the chat card and automatically add an effect to the selected token/actor:
  - The effect name includes the affliction type (e.g., "Curse of Death (Curse)").
  - The effect icon matches the source icon from the chat card, if available.
  - The effect's description is copied from the chat card, with spell/system headers (like Range, Targets, Duration, etc.) removed, but always keeps Saving Throw info.
  - If the affliction has stages, a counter is added; otherwise, no counter is shown.
  - If no duration is found, the effect is set to unlimited duration.

## 2. (Optional) Affliction Window Button
- If enabled, a button appears in the Token Controls menu to manually add afflictions via a form.
- You can safely delete this feature if you only use chat import (remove `affliction-window.js` and its entry in `module.json`).

## End-of-Turn Automation
- At the end of each turn, the module:
  - Removes expired affliction effects from the actor's sheet.
  - Posts a chat message for each active affliction, including the effect name (with type), stage, and description.
  - The chat message includes the affected token's image.

## Requirements
- Foundry VTT v12+
- Pathfinder 2e system v6+

## Installation
1. Place the module folder in your Foundry VTT `Data/modules` directory.
2. Add all relevant `.js` files to your `module.json` scripts array (remove `affliction-window.js` if not using the window feature).
3. Enable the module in your Foundry world.

## Notes
- The module is designed for global script loading (not ES modules).
- The chat import feature works with official PF2e chat cards for poisons, diseases, curses, and afflictions.
- If you encounter issues with parsing or want to support more affliction types, let the author know!
