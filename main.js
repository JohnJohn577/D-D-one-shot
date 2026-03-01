import { abilityCheck, attackRoll, damageRoll } from "./engine/rules.js";
import {
  state,
  initializeChapter,
  resetChapter,
  getCurrentScene,
  setScene,
  startCombat,
  endCombat,
  setLastRoll,
  applyDefeatRecovery,
} from "./engine/state.js";
import { renderScene, renderCombat, renderRoll, renderChoices } from "./engine/renderer.js";

const resetButton = document.getElementById("reset-btn");

async function loadChapter(chapterId) {
  const response = await fetch(`./content/chapters/${chapterId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load chapter: ${chapterId}`);
  }
  return response.json();
}

function transitionTo(sceneId) {
  if (!sceneId) {
    refreshView();
    return;
  }

  setScene(sceneId);
  const scene = getCurrentScene();

  if (scene?.id === "ch01_combat_defeat") {
    applyDefeatRecovery();
  }

  if (scene?.type === "combatStart") {
    const enemyData = state.chapter.enemies[scene.combat.enemyId];
    startCombat(enemyData, Boolean(scene.combat.playerFirstAttackAdvantage));
  }

  refreshView();
}

function handleChoice(choice) {
  if (choice.check) {
    const check = choice.check;
    const result = abilityCheck(check.mod, check.dc, {
      advantage: Boolean(check.advantage),
      disadvantage: Boolean(check.disadvantage),
    });
    setLastRoll(`${check.name} Check\n${result.breakdown}`);
    transitionTo(result.success ? choice.onSuccess : choice.onFail);
    return;
  }

  transitionTo(choice.goto);
}

function buildNarrativeChoices(scene) {
  if (scene.type === "chapterEnd") {
    return [{
      label: "Chapter complete",
      goto: null,
      disabled: true,
    }];
  }
  return scene.choices ?? [];
}

function runPlayerAttack() {
  const enemy = state.combat.enemy;
  const player = state.player;
  const hasAdvantage = state.combat.firstAttackPending && state.combat.playerFirstAttackAdvantage;

  const hitRoll = attackRoll(player.weapon.toHitMod, enemy.ac, { advantage: hasAdvantage });
  let log = `Player attacks with ${player.weapon.name}\n${hitRoll.breakdown}`;

  state.combat.firstAttackPending = false;

  if (hitRoll.hit) {
    const dmg = damageRoll(player.weapon.damage);
    enemy.hp -= dmg.total;
    log += `\n\n${dmg.breakdown}\n${enemy.name} HP: ${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
  } else {
    log += "\n\nAttack misses.";
  }

  if (enemy.hp <= 0) {
    setLastRoll(`${log}\n\nEnemy defeated.`);
    endCombat();
    transitionTo("ch01_combat_victory");
    return;
  }

  const enemyAttack = attackRoll(enemy.toHitMod, player.ac);
  log += `\n\n${enemy.name} attacks with ${enemy.weaponName}\n${enemyAttack.breakdown}`;

  if (enemyAttack.hit) {
    const enemyDmg = damageRoll(enemy.damage);
    player.hp -= enemyDmg.total;
    log += `\n\n${enemyDmg.breakdown}\nPlayer HP: ${Math.max(0, player.hp)}/${player.maxHp}`;
  } else {
    log += "\n\nEnemy attack misses.";
  }

  setLastRoll(log);

  if (player.hp <= 0) {
    endCombat();
    transitionTo("ch01_combat_defeat");
    return;
  }

  refreshView();
}

function refreshView() {
  const scene = getCurrentScene();
  renderScene(scene, state.chapter.title);
  renderRoll(state.lastRollBreakdown);

  if (state.combat.active) {
    renderCombat(state);
    renderChoices([{ label: "Attack" }], () => runPlayerAttack());
    return;
  }

  renderCombat(state);
  renderChoices(buildNarrativeChoices(scene), (choice) => handleChoice(choice));
}

async function init() {
  try {
    const chapter = await loadChapter("ch01");
    initializeChapter(chapter);
    refreshView();
  } catch (error) {
    document.getElementById("scene-text").textContent = `Failed to start game: ${error.message}`;
  }
}

resetButton.addEventListener("click", () => {
  resetChapter();
  refreshView();
});

init();
