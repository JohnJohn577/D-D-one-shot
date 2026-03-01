const sceneImage = document.getElementById("scene-image");
const sceneText = document.getElementById("scene-text");
const choiceButtons = Array.from(document.querySelectorAll(".choice-btn"));

const scenes = {
  crossroads: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23222'/%3E%3Crect y='34' width='64' height='30' fill='%23365d2f'/%3E%3Crect x='29' y='20' width='6' height='44' fill='%238b6b3f'/%3E%3Crect x='16' y='26' width='16' height='10' fill='%232a4a8b'/%3E%3Crect x='32' y='24' width='16' height='10' fill='%23943f3f'/%3E%3C/svg%3E",
    text: "At dusk, you reach a crossroads beneath a flickering lantern.",
    choices: [
      { label: "Head to the forest", next: "forest" },
      { label: "Walk toward the village", next: "village" },
      { label: "Rest beside the signpost", next: "camp" }
    ]
  },
  forest: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2311241a'/%3E%3Crect y='42' width='64' height='22' fill='%232b5a36'/%3E%3Crect x='10' y='22' width='7' height='32' fill='%236b4f2e'/%3E%3Crect x='7' y='14' width='13' height='12' fill='%233f8f53'/%3E%3Crect x='26' y='18' width='7' height='36' fill='%236b4f2e'/%3E%3Crect x='23' y='10' width='13' height='12' fill='%233f8f53'/%3E%3Crect x='44' y='24' width='7' height='30' fill='%236b4f2e'/%3E%3Crect x='41' y='16' width='13' height='12' fill='%233f8f53'/%3E%3C/svg%3E",
    text: "Pine shadows close in. You hear a brook and the faint clink of metal.",
    choices: [
      { label: "Follow the brook", next: "brook" },
      { label: "Return to crossroads", next: "crossroads" }
    ]
  },
  village: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%232b2d42'/%3E%3Crect y='38' width='64' height='26' fill='%235e4f42'/%3E%3Crect x='8' y='24' width='18' height='14' fill='%237d5a50'/%3E%3Crect x='12' y='28' width='5' height='5' fill='%23ffd166'/%3E%3Crect x='38' y='20' width='18' height='18' fill='%238e6b5e'/%3E%3Crect x='44' y='26' width='5' height='5' fill='%23ffd166'/%3E%3C/svg%3E",
    text: "Warm light spills from crooked windows. A tavern sign creaks overhead.",
    choices: [
      { label: "Enter the tavern", next: "tavern" },
      { label: "Return to crossroads", next: "crossroads" }
    ]
  },
  camp: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23121a2f'/%3E%3Crect y='40' width='64' height='24' fill='%2345342a'/%3E%3Crect x='29' y='29' width='6' height='10' fill='%23ff7f11'/%3E%3Crect x='27' y='33' width='10' height='5' fill='%23ffd166'/%3E%3Crect x='20' y='39' width='24' height='3' fill='%238b6b3f'/%3E%3C/svg%3E",
    text: "You make a small fire. The night is calm, and your thoughts settle.",
    choices: [{ label: "Wake and continue", next: "crossroads" }]
  },
  brook: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2317242f'/%3E%3Crect y='42' width='64' height='22' fill='%232e5d3a'/%3E%3Crect x='0' y='44' width='64' height='8' fill='%233f88c5'/%3E%3Crect x='14' y='22' width='6' height='20' fill='%236b4f2e'/%3E%3Crect x='11' y='15' width='12' height='10' fill='%233f8f53'/%3E%3C/svg%3E",
    text: "By the brook, you spot a silver key half-buried in moss. The adventure continues...",
    choices: [{ label: "Back to crossroads", next: "crossroads" }]
  },
  tavern: {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2330262d'/%3E%3Crect y='42' width='64' height='22' fill='%2353403e'/%3E%3Crect x='8' y='16' width='48' height='26' fill='%236c4f49'/%3E%3Crect x='14' y='22' width='8' height='8' fill='%23ffd166'/%3E%3Crect x='42' y='22' width='8' height='8' fill='%23ffd166'/%3E%3C/svg%3E",
    text: "Inside, a bard begins your favorite song as a map is slid across the table.",
    choices: [{ label: "Begin a new night", next: "crossroads" }]
  }
};

function renderScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;

  sceneImage.src = scene.image;
  sceneText.textContent = scene.text;

  choiceButtons.forEach((button, index) => {
    const choice = scene.choices[index];

    if (!choice) {
      button.hidden = true;
      button.onclick = null;
      return;
    }

    button.hidden = false;
    button.textContent = choice.label;
    button.onclick = () => renderScene(choice.next);
  });
}

renderScene("crossroads");
