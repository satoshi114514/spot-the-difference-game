// Painting: the HUD, the two panels, found markers, and the title, pause
// and end screens. The playfield is 1280x720 logical pixels; the renderer
// scales it to the canvas size.

import { FIELD, FONT, LEVELS, PALETTE, PANEL } from './config.js';
import { drawScene } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function fit() {
    const scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    const ox = (canvas.width - FIELD.width * scale) / 2;
    const oy = (canvas.height - FIELD.height * scale) / 2;
    ctx.setTransform(scale, 0, 0, scale, ox, oy);
  }

  function panelOrigin(panel) {
    return panel === 0
      ? { x: PANEL.leftX, y: PANEL.y }
      : { x: PANEL.rightX, y: PANEL.y };
  }

  function drawMarker(x, y, r, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = 'bold 18px ' + FONT;
    ctx.fillText(label, x + r + 6, y + 6);
  }

  function drawHud(state, level, best) {
    ctx.fillStyle = PALETTE.hud;
    ctx.fillRect(0, 0, FIELD.width, 110);
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 34px ' + FONT;
    ctx.fillText('Spot the Difference', 40, 48);
    ctx.font = '20px ' + FONT;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(level.name + '  ·  Level ' + (state.levelIndex + 1) + ' of ' + LEVELS.length, 40, 82);
    const remain = state.found.filter((f) => !f).length;
    ctx.fillStyle = PALETTE.accent;
    ctx.font = 'bold 30px ' + FONT;
    ctx.fillText('🔍 ' + remain + ' left', 560, 52);
    ctx.fillStyle = PALETTE.text;
    ctx.font = '24px ' + FONT;
    ctx.fillText('Score ' + state.score, 820, 48);
    ctx.fillText('Best ' + best, 820, 82);
    const secs = Math.ceil(state.timeLeft);
    ctx.fillStyle = secs <= 20 ? PALETTE.miss : PALETTE.text;
    ctx.font = 'bold 30px ' + FONT;
    ctx.fillText('⏱ ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), 1060, 52);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = '18px ' + FONT;
    ctx.fillText('Hints ' + state.hintsLeft + ' (H)  ·  P pause', 560, 82);
    // Timer bar.
    ctx.fillStyle = '#0f1a26';
    ctx.fillRect(40, 640, 1200, 12);
    ctx.fillStyle = secs <= 20 ? PALETTE.miss : PALETTE.found;
    ctx.fillRect(40, 640, 1200 * Math.max(0, state.timeLeft / 120), 12);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = '18px ' + FONT;
    ctx.fillText(level.hint, 40, 680);
  }

  function drawPanels(state, level) {
    drawScene(ctx, level, 0, PANEL.leftX, PANEL.y, PANEL.width, PANEL.height);
    drawScene(ctx, level, 1, PANEL.rightX, PANEL.y, PANEL.width, PANEL.height);
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 18px ' + FONT;
    ctx.fillText('LEFT — original', PANEL.leftX, PANEL.y - 10);
    ctx.fillText('RIGHT — find the changes', PANEL.rightX, PANEL.y - 10);
    level.differences.forEach((d, i) => {
      if (!state.found[i]) return;
      const left = panelOrigin(0);
      const right = panelOrigin(1);
      drawMarker(left.x + d.x, left.y + d.y, d.r, PALETTE.found, '✓');
      drawMarker(right.x + d.x, right.y + d.y, d.r, PALETTE.found, '✓');
    });
    if (state.hintFlash) {
      const d = level.differences[state.hintFlash.index];
      const right = panelOrigin(1);
      ctx.strokeStyle = PALETTE.hint;
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(right.x + d.x, right.y + d.y, d.r + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (state.missFlash) {
      const origin = panelOrigin(state.missFlash.panel);
      ctx.strokeStyle = PALETTE.miss;
      ctx.lineWidth = 5;
      const x = origin.x + state.missFlash.x;
      const y = origin.y + state.missFlash.y;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 12);
      ctx.lineTo(x + 12, y + 12);
      ctx.moveTo(x + 12, y - 12);
      ctx.lineTo(x - 12, y + 12);
      ctx.stroke();
    }
  }

  function overlay(title, lines, accent) {
    ctx.fillStyle = 'rgba(15, 26, 38, 0.82)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = accent;
    ctx.font = 'bold 54px ' + FONT;
    ctx.textAlign = 'center';
    ctx.fillText(title, FIELD.width / 2, 250);
    ctx.fillStyle = PALETTE.text;
    ctx.font = '24px ' + FONT;
    lines.forEach((line, i) => {
      ctx.fillText(line, FIELD.width / 2, 310 + i * 40);
    });
    ctx.textAlign = 'left';
  }

  function draw(state, screen, best) {
    canvas.width = canvas.width; // clear
    fit();
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    const level = LEVELS[state.levelIndex];
    if (screen === SCREEN_TITLE) {
      drawPanels({ ...state, found: level.differences.map(() => false), hintFlash: null, missFlash: null }, level);
      overlay('Spot the Difference', [
        'Two pictures, seven changes. Find them all before the timer ends.',
        'Click a difference in either picture  ·  H for a hint  ·  3 levels, 21 finds',
        'Press Space or click to start',
      ], PALETTE.accent);
      return;
    }
    drawHud(state, level, best);
    drawPanels(state, level);
    if (screen === SCREEN_PAUSED) {
      overlay('Paused', ['Press P or Space to keep hunting.'], PALETTE.accent);
    } else if (screen === SCREEN_OVER) {
      const won = state.done;
      const lines = won
        ? [
            'You found all 21 differences!',
            'Score ' + state.score + '  ·  Best ' + best,
            'Press Space to play again',
          ]
        : [
            'Time is up. You found ' + state.finds + ' of 21 differences.',
            'Score ' + state.score + '  ·  Best ' + best,
            'Press Space to try again',
          ];
      overlay(won ? 'You found them all!' : 'Time’s up!', lines, won ? PALETTE.found : PALETTE.miss);
    }
  }

  return { draw, panelOrigin };
}
