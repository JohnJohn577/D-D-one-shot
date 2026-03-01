# D-D-one-shot

A D&D inspired one-shot game.

## Scene system

Scenes are keyed by `id` and contain player choices. A choice can either:

- move directly to a `nextSceneId`, or
- run an ability check against a DC and branch to `successSceneId`/`failureSceneId`.

```js
const scenes = new Map([
  [
    'gate',
    {
      id: 'gate',
      choices: [
        {
          id: 'pick-lock',
          label: 'Pick the lock',
          check: {
            ability: 'dexterity',
            dc: 14,
            successSceneId: 'courtyard',
            failureSceneId: 'guard-post',
          },
        },
      ],
    },
  ],
]);
```

Use `resolveChoice(sceneMap, currentSceneId, choiceId, context, options)` from `src/sceneSystem.js` to evaluate the selected choice.

- `context.abilities` is a map of ability modifiers (for example `dexterity: 3`).
- A d20 roll is added to the modifier.
- If total `>= dc`, it branches to `successSceneId`; otherwise `failureSceneId`.
