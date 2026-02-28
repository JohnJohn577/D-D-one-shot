export const RollMode = Object.freeze({
  NORMAL: "normal",
  ADVANTAGE: "advantage",
  DISADVANTAGE: "disadvantage",
});

function rollDie(sides = 20) {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new Error("sides must be an integer >= 2");
  }
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD20({ mode = RollMode.NORMAL, modifier = 0 } = {}) {
  const first = rollDie(20);
  const second = mode === RollMode.NORMAL ? null : rollDie(20);

  let kept = first;
  if (mode === RollMode.ADVANTAGE && second !== null) {
    kept = Math.max(first, second);
  } else if (mode === RollMode.DISADVANTAGE && second !== null) {
    kept = Math.min(first, second);
  }

  const total = kept + modifier;
  return {
    mode,
    modifier,
    rolls: second === null ? [first] : [first, second],
    kept,
    total,
  };
}

export function resolveCheck({
  dc,
  mode = RollMode.NORMAL,
  modifier = 0,
  label = "Ability Check",
} = {}) {
  if (!Number.isInteger(dc) || dc < 1) {
    throw new Error("dc must be an integer >= 1");
  }

  const result = rollD20({ mode, modifier });
  return {
    ...result,
    dc,
    label,
    success: result.total >= dc,
  };
}

export function describeRoll(result) {
  const rollsText = result.rolls.join(", ");
  const modSign = result.modifier >= 0 ? "+" : "";
  const dcText = Number.isInteger(result.dc) ? ` vs DC ${result.dc}` : "";

  return `${result.label ?? "Roll"}: [${result.mode}] rolled ${rollsText}, kept ${result.kept}, total ${result.total} (${modSign}${result.modifier})${dcText}`;
}
