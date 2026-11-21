// Every tuning number, colour and level definition in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it
// to the window, so no rule below depends on the screen size.
// Each panel is 560x460, drawn side by side with a 40px gap.

export const FIELD = { width: 1280, height: 720 };
export const PANEL = { width: 560, height: 460, leftX: 40, rightX: 680, y: 150 };
export const DIFF_RADIUS = 34;
export const FIND_POINTS = 100;
export const MISS_POINTS = -25;
export const HINT_POINTS = -50;
export const LEVEL_SECONDS = 120;
export const BEST_KEY = 'spot-the-difference.best';

export const PALETTE = {
  backdrop: '#1d2b3a',
  panel: '#f7f3e8',
  panelEdge: '#2b3a4a',
  text: '#f7f3e8',
  darkText: '#22303f',
  muted: '#9fb0c0',
  accent: '#ffb703',
  accentDark: '#fb8500',
  found: '#2a9d8f',
  miss: '#e63946',
  hint: '#4361ee',
  hud: '#24344a',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

// A difference is a circle in panel coordinates (x, y, radius) plus a short
// name the end screen can list. Variant 1 of a scene changes exactly these.
export const LEVELS = [
  {
    id: 'park',
    name: 'Sunny Park',
    hint: 'A sunny park: a kite, a pond, a bench and a picnic.',
    differences: [
      { x: 120, y: 70, r: 30, name: 'the sun wears sunglasses' },
      { x: 430, y: 90, r: 28, name: 'a bird in the sky' },
      { x: 90, y: 300, r: 32, name: 'a red flower by the pond' },
      { x: 290, y: 275, r: 30, name: 'the kite tail' },
      { x: 470, y: 340, r: 30, name: 'a duck on the pond' },
      { x: 200, y: 390, r: 28, name: 'the bench slat' },
      { x: 360, y: 120, r: 26, name: 'a cloud' },
    ],
  },
  {
    id: 'cafe',
    name: 'Cat Café Morning',
    hint: 'A cat café: a cat on the sill, coffee, books and plants.',
    differences: [
      { x: 139, y: 188, r: 30, name: 'the cat’s bow' },
      { x: 430, y: 80, r: 28, name: 'the wall clock hands' },
      { x: 95, y: 336, r: 30, name: 'a plant leaf' },
      { x: 292, y: 315, r: 28, name: 'steam over the cup' },
      { x: 442, y: 260, r: 30, name: 'a book on the shelf' },
      { x: 200, y: 80, r: 26, name: 'a picture frame' },
      { x: 200, y: 195, r: 28, name: 'the cat’s tail tip' },
    ],
  },
  {
    id: 'beach',
    name: 'Beach at Dusk',
    hint: 'A beach at dusk: an umbrella, a crab, a boat and shells.',
    differences: [
      { x: 120, y: 80, r: 30, name: 'a star in the sky' },
      { x: 440, y: 180, r: 28, name: 'the boat sail' },
      { x: 100, y: 300, r: 30, name: 'a shell on the sand' },
      { x: 280, y: 230, r: 30, name: 'the umbrella stripe' },
      { x: 488, y: 338, r: 28, name: 'the crab claw' },
      { x: 210, y: 130, r: 26, name: 'a seagull' },
      { x: 360, y: 390, r: 28, name: 'a beach ball' },
    ],
  },
];
