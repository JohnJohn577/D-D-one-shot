export function rollDie(sides) {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new Error(`Invalid die sides: ${sides}`);
  }
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD20({ advantage = false, disadvantage = false } = {}) {
  const first = rollDie(20);
  const second = advantage || disadvantage ? rollDie(20) : null;

  let chosen = first;
  let mode = "normal";
  if (advantage && !disadvantage) {
    chosen = Math.max(first, second);
    mode = "advantage";
  } else if (disadvantage && !advantage) {
    chosen = Math.min(first, second);
    mode = "disadvantage";
  }

  return {
    roll: chosen,
    rolls: second === null ? [first] : [first, second],
    mode,
  };
}

export function rollDice(formula) {
  const match = /^(\d+)d(\d+)([+-]\d+)?$/i.exec(formula.replace(/\s+/g, ""));
  if (!match) {
    throw new Error(`Unsupported dice formula: ${formula}`);
  }

  const count = Number(match[1]);
  const sides = Number(match[2]);
  const modifier = match[3] ? Number(match[3]) : 0;

  const rolls = [];
  for (let i = 0; i < count; i += 1) {
    rolls.push(rollDie(sides));
  }

  const subtotal = rolls.reduce((sum, value) => sum + value, 0);
  const total = subtotal + modifier;

  return {
    total,
    formula,
    count,
    sides,
    rolls,
    modifier,
    breakdown: `${formula}: [${rolls.join(", ")}] ${modifier >= 0 ? "+" : "-"} ${Math.abs(modifier)} = ${total}`,
  };
}
