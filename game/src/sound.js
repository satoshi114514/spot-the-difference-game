// Tiny WebAudio sounds, made with oscillators only: no sound files, no
// network, and silence when the browser has no audio.

let ctx = null;

function audio() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, dur, type, vol, when = 0) {
  const ac = audio();
  if (!ac) return;
  try {
    if (ac.state === 'suspended') ac.resume();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + when);
    osc.stop(ac.currentTime + when + dur);
  } catch {
    // Sound is garnish: a failure never breaks the game.
  }
}

export function playFound() {
  tone(660, 0.12, 'sine', 0.15);
  tone(880, 0.18, 'sine', 0.15, 0.09);
}

export function playMiss() {
  tone(180, 0.2, 'sawtooth', 0.08);
}

export function playHint() {
  tone(520, 0.15, 'triangle', 0.12);
}

export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'sine', 0.15, i * 0.11));
}

export function playLevel() {
  tone(784, 0.12, 'sine', 0.12);
  tone(1047, 0.2, 'sine', 0.12, 0.1);
}
