// The screenshot scenes behind ?shot=start|play|end. Each one stages a real
// game state, so the frame is what a short game really looks like and the
// same seed always gives the same frame.

import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

// Play shot: two differences found, five still unfound, timer part used.
export function stageShot(name, world) {
  world.reset();
  if (name === 'play') {
    world.state.found[0] = true;
    world.state.found[3] = true;
    world.state.finds = 2;
    world.state.score = 200;
    world.state.timeLeft = 87;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'end') {
    world.state.found = world.state.found.map(() => true);
    world.state.finds = 21;
    world.state.score = 2450;
    world.state.timeLeft = 34;
    world.state.done = true;
    return { screen: SCREEN_OVER, best: 2450 };
  }
  return { screen: SCREEN_TITLE, best: 0 };
}
