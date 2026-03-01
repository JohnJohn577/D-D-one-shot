/**
 * Scene shape:
 * {
 *   id: string,
 *   text: string,
 *   choices: Array<Choice>
 * }
 *
 * Choice shape:
 * {
 *   id: string,
 *   label: string,
 *   nextSceneId?: string,
 *   check?: {
 *     ability: string,
 *     dc: number,
 *     successSceneId: string,
 *     failureSceneId: string
 *   }
 * }
 */

/**
 * Roll a d20.
 * @param {() => number} rng function that returns a float in [0, 1)
 * @returns {number}
 */
function rollD20(rng = Math.random) {
  return Math.floor(rng() * 20) + 1;
}

/**
 * Resolve the outcome of a choice in a scene.
 *
 * @param {Map<string, any>} sceneMap keyed by scene ID
 * @param {string} currentSceneId
 * @param {string} choiceId
 * @param {{ abilities?: Record<string, number> }} context
 * @param {{ rng?: () => number }} [options]
 * @returns {{
 *   nextSceneId: string,
 *   check?: {
 *     ability: string,
 *     dc: number,
 *     roll: number,
 *     modifier: number,
 *     total: number,
 *     passed: boolean
 *   }
 * }}
 */
function resolveChoice(sceneMap, currentSceneId, choiceId, context = {}, options = {}) {
  const scene = sceneMap.get(currentSceneId);
  if (!scene) {
    throw new Error(`Unknown scene: ${currentSceneId}`);
  }

  const choice = scene.choices?.find((entry) => entry.id === choiceId);
  if (!choice) {
    throw new Error(`Unknown choice '${choiceId}' for scene '${currentSceneId}'`);
  }

  if (!choice.check) {
    if (!choice.nextSceneId) {
      throw new Error(`Choice '${choiceId}' must define either nextSceneId or check`);
    }

    return { nextSceneId: choice.nextSceneId };
  }

  const { ability, dc, successSceneId, failureSceneId } = choice.check;
  const modifier = context.abilities?.[ability] ?? 0;
  const roll = rollD20(options.rng);
  const total = roll + modifier;
  const passed = total >= dc;

  return {
    nextSceneId: passed ? successSceneId : failureSceneId,
    check: {
      ability,
      dc,
      roll,
      modifier,
      total,
      passed,
    },
  };
}

module.exports = {
  rollD20,
  resolveChoice,
};
