const chapterLabel = document.getElementById("chapterLabel");
const sceneTitle = document.getElementById("sceneTitle");
const sceneBody = document.getElementById("sceneBody");
const choices = document.getElementById("choices");
const status = document.getElementById("status");

const chapterFromUrl = new URLSearchParams(window.location.search).get("chapter") || "ch01";
const chapterPath = `content/chapters/${chapterFromUrl}.json`;

let chapter;
let activeSceneId;

function updateStatus(message) {
  status.textContent = message;
}

function renderScene(sceneId) {
  const scene = chapter.scenes.find((entry) => entry.id === sceneId);

  if (!scene) {
    updateStatus(`Scene "${sceneId}" was not found in chapter ${chapter.id}.`);
    return;
  }

  activeSceneId = scene.id;
  sceneTitle.textContent = scene.title;
  sceneBody.textContent = scene.body;
  choices.innerHTML = "";

  if (!Array.isArray(scene.choices) || scene.choices.length === 0) {
    updateStatus("The adventure ends here.");
    return;
  }

  for (const choice of scene.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice.label;
    button.addEventListener("click", () => renderScene(choice.nextSceneId));
    choices.append(button);
  }

  updateStatus(`Current scene: ${activeSceneId}`);
}

async function loadChapter() {
  updateStatus(`Loading chapter from ${chapterPath}...`);

  try {
    const response = await fetch(chapterPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    chapter = await response.json();
    chapterLabel.textContent = `${chapter.title} (${chapter.id})`;

    const startScene = chapter.startSceneId || chapter.scenes[0]?.id;
    if (!startScene) {
      throw new Error("Chapter does not contain scenes.");
    }

    renderScene(startScene);
  } catch (error) {
    sceneTitle.textContent = "Could not load chapter";
    sceneBody.textContent =
      "Check that the chapter file exists and is being served by a web server.";
    choices.innerHTML = "";
    updateStatus(`Failed to load ${chapterPath}: ${error.message}`);
  }
}

loadChapter();
