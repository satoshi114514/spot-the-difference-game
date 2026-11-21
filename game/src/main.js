// Boot and the one loop: input is read every frame, the timer advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between four screens: title, play, paused and game over.
// ?shot=start|play|end stages that scene instead of running the loop,
// paints it twice and sets window.__shotReady for a screenshot.

import { BEST_KEY, FIELD, PANEL } from './config.js';
import { createWorld, EVENT_FOUND, EVENT_GAME_DONE, EVENT_LEVEL_DONE, EVENT_MISS, EVENT_TIME_UP } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_NEXT, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';
import { playFound, playHint, playLevel, playMiss, playWin } from './sound.js';

const STEP_SECONDS = 1 / 60;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let last = performance.now();
  let accumulator = 0;

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.reset();
    screen = SCREEN_PLAY;
    announce('Playing. Find 7 differences in Sunny Park.');
  }

  function endGame() {
    screen = SCREEN_OVER;
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
    announce(world.state.done ? 'You found them all. Score ' + world.state.score : 'Time is up. Score ' + world.state.score);
  }

  function handleClicks() {
    if (screen !== SCREEN_PLAY) return;
    for (const click of input.takeClicks()) {
      // Turn canvas pixels into panel coordinates.
      const scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
      const ox = (canvas.width - FIELD.width * scale) / 2;
      const oy = (canvas.height - FIELD.height * scale) / 2;
      const x = (click.x - ox) / scale;
      const y = (click.y - oy) / scale;
      let panel = -1;
      let px = 0;
      let py = 0;
      if (x >= PANEL.leftX && x < PANEL.leftX + PANEL.width && y >= PANEL.y && y < PANEL.y + PANEL.height) {
        panel = 0;
        px = x - PANEL.leftX;
        py = y - PANEL.y;
      } else if (x >= PANEL.rightX && x < PANEL.rightX + PANEL.width && y >= PANEL.y && y < PANEL.y + PANEL.height) {
        panel = 1;
        px = x - PANEL.rightX;
        py = y - PANEL.y;
      }
      if (panel < 0) continue;
      const events = world.click(panel, px, py);
      if (events & EVENT_FOUND) {
        playFound();
        announce('Found one! ' + (world.remaining() + (world.state.levelIndex === 2 && world.remaining() === 0 ? 0 : 0)) + ' left in this picture.');
      }
      if (events & EVENT_MISS) {
        playMiss();
        announce('Not a difference. Minus 25 points.');
      }
      if (events & EVENT_LEVEL_DONE) {
        if (events & EVENT_GAME_DONE) {
          playWin();
          endGame();
        } else {
          playLevel();
          announce('Level clear! Next picture.');
          world.nextLevel();
        }
      }
      if (events & EVENT_TIME_UP) endGame();
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_OVER)) startGame();
    else if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    } else if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && screen === SCREEN_PAUSED) {
      screen = SCREEN_PLAY;
      announce('Playing.');
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      const hint = world.hint();
      if (hint) {
        playHint();
        announce('Hint: look near the right picture.');
      }
    }
    if (actions & ACTION_NEXT && screen === SCREEN_PLAY && world.remaining() === 0) world.nextLevel();
    if (actions & ACTION_RESTART) {
      world.reset();
      screen = SCREEN_PLAY;
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    handleActions();
    handleClicks();
    if (screen === SCREEN_PLAY) {
      accumulator += dt;
      while (accumulator >= STEP_SECONDS) {
        const events = world.tick(STEP_SECONDS);
        accumulator -= STEP_SECONDS;
        if (events & EVENT_TIME_UP) {
          endGame();
          break;
        }
      }
      if (world.state.hintFlash) {
        world.state.hintFlash.t -= dt;
        if (world.state.hintFlash.t <= 0) world.state.hintFlash = null;
      }
      if (world.state.missFlash) {
        world.state.missFlash.t -= dt;
        if (world.state.missFlash.t <= 0) world.state.missFlash = null;
      }
    }
    renderer.draw(world.state, screen, best);
  }

  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
