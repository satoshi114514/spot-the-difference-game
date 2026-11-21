// Mouse and keyboard input. Clicks are reported in canvas pixels; main.js
// turns them into panel coordinates. Keys: H hint, N next level, R restart,
// Space / Enter confirm, P or Esc pause.

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_NEXT = 8;
export const ACTION_RESTART = 16;

export function createInput(canvas) {
  let actions = 0;
  const clicks = [];

  function canvasPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    clicks.push(canvasPos(event));
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'Space' || event.code === 'Enter') actions |= ACTION_CONFIRM;
    else if (event.code === 'KeyP' || event.code === 'Escape') actions |= ACTION_PAUSE;
    else if (event.code === 'KeyH') actions |= ACTION_HINT;
    else if (event.code === 'KeyN') actions |= ACTION_NEXT;
    else if (event.code === 'KeyR') actions |= ACTION_RESTART;
  });

  function takeActions() {
    const taken = actions;
    actions = 0;
    return taken;
  }

  function takeClicks() {
    return clicks.splice(0, clicks.length);
  }

  return { takeActions, takeClicks };
}
