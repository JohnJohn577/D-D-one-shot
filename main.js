import { RollMode, resolveCheck, describeRoll } from "./engine/dice.js";

const encounterChoices = [
  {
    id: "kick-door",
    text: "Kick in the crypt door (Athletics DC 14)",
    check: { label: "Athletics", dc: 14, modifier: 3 },
    onSuccess: "The hinges scream and the door bursts open. You gain momentum.",
    onFailure: "The door holds. The noise alerts enemies nearby.",
  },
  {
    id: "search-runes",
    text: "Study the runes (Arcana DC 12)",
    check: { label: "Arcana", dc: 12, modifier: 2 },
    onSuccess: "You identify a safe path through the warded corridor.",
    onFailure: "A spark snaps your fingers and you lose precious time.",
  },
  {
    id: "sneak-past",
    text: "Sneak past skeletal guards (Stealth DC 15)",
    check: { label: "Stealth", dc: 15, modifier: 4 },
    onSuccess: "Your footsteps vanish in the dust. You slip by unseen.",
    onFailure: "A skull turns toward you and the alarm begins.",
  },
];

const choiceContainer = document.getElementById("choices");
const modeSelect = document.getElementById("roll-mode");
const modifierInput = document.getElementById("global-modifier");
const logList = document.getElementById("roll-log");

function parseModifier(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function currentMode() {
  const mode = modeSelect.value;
  return Object.values(RollMode).includes(mode) ? mode : RollMode.NORMAL;
}

function addLogEntry(text, success) {
  const item = document.createElement("li");
  item.className = success ? "success" : "failure";
  item.textContent = text;
  logList.prepend(item);
}

function renderChoice(choice) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.choiceId = choice.id;
  button.textContent = choice.text;

  button.addEventListener("click", () => {
    const check = resolveCheck({
      ...choice.check,
      mode: currentMode(),
      modifier: choice.check.modifier + parseModifier(modifierInput.value),
    });

    const summary = describeRoll(check);
    const outcome = check.success ? choice.onSuccess : choice.onFailure;
    addLogEntry(`${summary} — ${check.success ? "SUCCESS" : "FAIL"}. ${outcome}`, check.success);
  });

  choiceContainer.append(button);
}

encounterChoices.forEach(renderChoice);
