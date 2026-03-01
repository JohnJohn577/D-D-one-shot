const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveChoice, rollD20 } = require('../src/sceneSystem');

function buildScenes() {
  return new Map([
    [
      'gate',
      {
        id: 'gate',
        text: 'A locked gate blocks the road.',
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
          {
            id: 'walk-away',
            label: 'Leave quietly',
            nextSceneId: 'forest-path',
          },
        ],
      },
    ],
    ['courtyard', { id: 'courtyard', text: 'You slip inside.', choices: [] }],
    ['guard-post', { id: 'guard-post', text: 'A guard notices you.', choices: [] }],
    ['forest-path', { id: 'forest-path', text: 'You retreat.', choices: [] }],
  ]);
}

test('rollD20 returns numbers from 1 to 20', () => {
  assert.equal(rollD20(() => 0), 1);
  assert.equal(rollD20(() => 0.999999), 20);
});

test('non-check choice goes directly to nextSceneId', () => {
  const result = resolveChoice(buildScenes(), 'gate', 'walk-away', {
    abilities: { dexterity: 3 },
  });

  assert.deepEqual(result, { nextSceneId: 'forest-path' });
});

test('ability check success branches to successSceneId', () => {
  const result = resolveChoice(
    buildScenes(),
    'gate',
    'pick-lock',
    { abilities: { dexterity: 4 } },
    { rng: () => 0.7 }, // 15 on d20, total 19
  );

  assert.equal(result.nextSceneId, 'courtyard');
  assert.deepEqual(result.check, {
    ability: 'dexterity',
    dc: 14,
    roll: 15,
    modifier: 4,
    total: 19,
    passed: true,
  });
});

test('ability check failure branches to failureSceneId', () => {
  const result = resolveChoice(
    buildScenes(),
    'gate',
    'pick-lock',
    { abilities: { dexterity: 1 } },
    { rng: () => 0.1 }, // 3 on d20, total 4
  );

  assert.equal(result.nextSceneId, 'guard-post');
  assert.deepEqual(result.check, {
    ability: 'dexterity',
    dc: 14,
    roll: 3,
    modifier: 1,
    total: 4,
    passed: false,
  });
});

test('throws when scene is missing', () => {
  assert.throws(
    () => resolveChoice(buildScenes(), 'missing-scene', 'pick-lock', {}),
    /Unknown scene: missing-scene/,
  );
});

test('throws when choice is missing', () => {
  assert.throws(
    () => resolveChoice(buildScenes(), 'gate', 'missing-choice', {}),
    /Unknown choice 'missing-choice' for scene 'gate'/,
  );
});
