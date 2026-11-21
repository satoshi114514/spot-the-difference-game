// Game state: which level, which differences are found, score, time and
// hints. Pure logic, no drawing and no input: the renderer paints it and
// main.js feeds it clicks.

import { DIFF_RADIUS, FIND_POINTS, HINT_POINTS, LEVELS, LEVEL_SECONDS, MISS_POINTS } from './config.js';

export const EVENT_FOUND = 1;
export const EVENT_MISS = 2;
export const EVENT_LEVEL_DONE = 4;
export const EVENT_GAME_DONE = 8;
export const EVENT_TIME_UP = 16;

export function createWorld() {
  const state = {
    levelIndex: 0,
    found: [],
    score: 0,
    timeLeft: LEVEL_SECONDS,
    hintsLeft: 3,
    misses: 0,
    finds: 0,
    hintFlash: null,
    missFlash: null,
    done: false,
    timeUp: false,
  };

  function level() {
    return LEVELS[state.levelIndex];
  }

  function resetLevel(index) {
    state.levelIndex = index;
    state.found = level().differences.map(() => false);
    state.timeLeft = LEVEL_SECONDS;
    state.hintFlash = null;
    state.missFlash = null;
    state.done = false;
    state.timeUp = false;
  }

  function reset() {
    state.score = 0;
    state.misses = 0;
    state.finds = 0;
    state.hintsLeft = 3;
    resetLevel(0);
  }

  function remaining() {
    return state.found.filter((f) => !f).length;
  }

  function tick(dt) {
    if (state.done || state.timeUp) return 0;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.timeUp = true;
      return EVENT_TIME_UP;
    }
    return 0;
  }

  // A click in panel coordinates (panel 0 = left, 1 = right; x, y inside
  // the panel). Returns an event mask. Clicking a found difference again
  // does nothing; clicking elsewhere costs points.
  function click(panel, x, y) {
    if (state.done || state.timeUp) return 0;
    const diffs = level().differences;
    for (let i = 0; i < diffs.length; i += 1) {
      if (state.found[i]) continue;
      const d = diffs[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= DIFF_RADIUS * DIFF_RADIUS) {
        state.found[i] = true;
        state.finds += 1;
        state.score += FIND_POINTS;
        state.missFlash = null;
        if (remaining() === 0) {
          state.score += Math.round(state.timeLeft) * 2;
          if (state.levelIndex + 1 >= LEVELS.length) {
            state.done = true;
            return EVENT_FOUND | EVENT_LEVEL_DONE | EVENT_GAME_DONE;
          }
          return EVENT_FOUND | EVENT_LEVEL_DONE;
        }
        return EVENT_FOUND;
      }
    }
    state.misses += 1;
    state.score = Math.max(0, state.score + MISS_POINTS);
    state.missFlash = { panel, x, y, t: 0.6 };
    return EVENT_MISS;
  }

  function nextLevel() {
    if (state.levelIndex + 1 < LEVELS.length) {
      resetLevel(state.levelIndex + 1);
      return true;
    }
    return false;
  }

  function hint() {
    if (state.done || state.timeUp || state.hintsLeft <= 0) return null;
    const diffs = level().differences;
    for (let i = 0; i < diffs.length; i += 1) {
      if (!state.found[i]) {
        state.hintsLeft -= 1;
        state.score = Math.max(0, state.score + HINT_POINTS);
        state.hintFlash = { index: i, t: 2.5 };
        return diffs[i];
      }
    }
    return null;
  }

  return { state, level, reset, resetLevel, remaining, tick, click, nextLevel, hint };
}
