import { rollD20, rollDice } from "./dice.js";

function buildD20Breakdown(label, d20Result, modifier, targetLabel, targetValue, finalTotal, success) {
  const rollText = d20Result.rolls.length === 2
    ? `${d20Result.mode} d20 rolls ${d20Result.rolls[0]}/${d20Result.rolls[1]} -> ${d20Result.roll}`
    : `d20 roll ${d20Result.roll}`;

  return `${label}: ${rollText}\nModifier: ${modifier >= 0 ? "+" : ""}${modifier}\nTotal: ${finalTotal} vs ${targetLabel} ${targetValue}\nResult: ${success ? "SUCCESS" : "FAIL"}`;
}

export function abilityCheck(mod, dc, { advantage = false, disadvantage = false } = {}) {
  const d20 = rollD20({ advantage, disadvantage });
  const total = d20.roll + mod;
  const success = total >= dc;

  return {
    total,
    success,
    breakdown: buildD20Breakdown("Ability Check", d20, mod, "DC", dc, total, success),
  };
}

export function attackRoll(toHitMod, targetAC, { advantage = false, disadvantage = false } = {}) {
  const d20 = rollD20({ advantage, disadvantage });
  const total = d20.roll + toHitMod;
  const hit = total >= targetAC;

  return {
    total,
    hit,
    breakdown: buildD20Breakdown("Attack Roll", d20, toHitMod, "AC", targetAC, total, hit),
  };
}

export function damageRoll(formula) {
  const result = rollDice(formula);
  return {
    total: result.total,
    breakdown: `Damage Roll\n${result.breakdown}`,
  };
}
