const PLAYER_TEMPLATE = {
  name: "Young Fighter",
  level: 1,
  strengthMod: 2,
  dexterityMod: 1,
  constitutionMod: 2,
  proficiencyBonus: 2,
  maxHp: 12,
  hp: 12,
  ac: 16,
  weapon: {
    name: "Sword",
    toHitMod: 4,
    damage: "1d8+2",
  },
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const state = {
  chapter: null,
  currentSceneId: null,
  player: clone(PLAYER_TEMPLATE),
  combat: {
    active: false,
    enemy: null,
    playerFirstAttackAdvantage: false,
    firstAttackPending: false,
  },
  lastRollBreakdown: "No rolls yet.",
};

export function initializeChapter(chapterData) {
  state.chapter = chapterData;
  resetChapter();
}

export function resetChapter() {
  if (!state.chapter) {
    throw new Error("No chapter loaded");
  }
  state.currentSceneId = state.chapter.startSceneId;
  state.player = clone(PLAYER_TEMPLATE);
  state.combat = {
    active: false,
    enemy: null,
    playerFirstAttackAdvantage: false,
    firstAttackPending: false,
  };
  state.lastRollBreakdown = "No rolls yet.";
}

export function getCurrentScene() {
  return state.chapter?.scenes?.[state.currentSceneId] ?? null;
}

export function setScene(sceneId) {
  state.currentSceneId = sceneId;
}

export function startCombat(enemy, playerFirstAttackAdvantage = false) {
  state.combat.active = true;
  state.combat.enemy = clone(enemy);
  state.combat.playerFirstAttackAdvantage = playerFirstAttackAdvantage;
  state.combat.firstAttackPending = true;
}

export function endCombat() {
  state.combat.active = false;
  state.combat.enemy = null;
  state.combat.playerFirstAttackAdvantage = false;
  state.combat.firstAttackPending = false;
}

export function setLastRoll(breakdown) {
  state.lastRollBreakdown = breakdown;
}

export function applyDefeatRecovery() {
  state.player.hp = 1;
}
