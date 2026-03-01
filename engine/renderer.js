const el = {
  chapterTitle: document.getElementById("chapter-title"),
  sceneImage: document.getElementById("scene-image"),
  imagePlaceholder: document.getElementById("image-placeholder"),
  imageAltText: document.getElementById("image-alt-text"),
  sceneId: document.getElementById("scene-id"),
  sceneText: document.getElementById("scene-text"),
  chapterTeaser: document.getElementById("chapter-teaser"),
  combatPanel: document.getElementById("combat-panel"),
  playerHp: document.getElementById("player-hp"),
  playerAc: document.getElementById("player-ac"),
  enemyName: document.getElementById("enemy-name"),
  enemyHp: document.getElementById("enemy-hp"),
  enemyAc: document.getElementById("enemy-ac"),
  rollBreakdown: document.getElementById("roll-breakdown"),
  choices: document.getElementById("choices"),
};

export function renderScene(scene, chapterTitle) {
  el.chapterTitle.textContent = chapterTitle;
  el.sceneId.textContent = `Scene: ${scene.id}`;
  el.sceneText.textContent = scene.text;

  const alt = `Illustration for ${scene.id}`;
  el.sceneImage.alt = alt;
  el.sceneImage.src = scene.image || "";
  el.imageAltText.textContent = alt;
  el.imagePlaceholder.hidden = true;
  el.sceneImage.hidden = false;
  el.sceneImage.onerror = () => {
    el.sceneImage.hidden = true;
    el.imagePlaceholder.hidden = false;
  };
  el.sceneImage.onload = () => {
    el.sceneImage.hidden = false;
    el.imagePlaceholder.hidden = true;
  };

  if (scene.teaser) {
    el.chapterTeaser.hidden = false;
    el.chapterTeaser.textContent = scene.teaser;
  } else {
    el.chapterTeaser.hidden = true;
    el.chapterTeaser.textContent = "";
  }
}

export function renderCombat(state) {
  if (!state.combat.active || !state.combat.enemy) {
    el.combatPanel.hidden = true;
    return;
  }

  el.combatPanel.hidden = false;
  el.playerHp.textContent = `${Math.max(0, state.player.hp)} / ${state.player.maxHp}`;
  el.playerAc.textContent = String(state.player.ac);
  el.enemyName.textContent = state.combat.enemy.name;
  el.enemyHp.textContent = `${Math.max(0, state.combat.enemy.hp)} / ${state.combat.enemy.maxHp}`;
  el.enemyAc.textContent = String(state.combat.enemy.ac);
}

export function renderRoll(breakdown) {
  el.rollBreakdown.textContent = breakdown;
}

export function renderChoices(choices, onClickChoice) {
  el.choices.innerHTML = "";
  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.disabled = choice.disabled === true;
    button.addEventListener("click", () => onClickChoice(choice, index));
    el.choices.appendChild(button);
  });
}
