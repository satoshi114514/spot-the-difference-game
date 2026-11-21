// Drawing for the three scenes. drawScene(ctx, level, variant, x, y, w, h)
// paints one panel. Variant 0 is the original, variant 1 is the same scene
// with exactly the level's differences applied. Everything is drawn with
// the canvas API only, so the game needs no image files and works offline.

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function tree(ctx, x, y, s) {
  rect(ctx, x - 6 * s, y, 12 * s, 44 * s, '#7a4a2b');
  circle(ctx, x, y - 18 * s, 34 * s, '#2d6a4f');
  circle(ctx, x - 24 * s, y - 4 * s, 24 * s, '#40916c');
  circle(ctx, x + 24 * s, y - 4 * s, 24 * s, '#40916c');
}

function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.arc(x - 8 * s, y, 8 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(x + 8 * s, y, 8 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 22 * s, y + 6 * s, 22 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 22 * s, y + 6 * s, 22 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPark(ctx, v, x, y, w, h) {
  rect(ctx, x, y, w, h, '#87ceeb');
  circle(ctx, x + 120, y + 70, 36, '#ffd60a');
  if (v === 0) {
    // Sunglasses on the sun, only in the original.
    ctx.strokeStyle = '#22303f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x + 108, y + 66, 9, 0, Math.PI * 2);
    ctx.arc(x + 134, y + 66, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 117, y + 66);
    ctx.lineTo(x + 125, y + 66);
    ctx.stroke();
  }
  if (v === 0) cloud(ctx, x + 360, y + 120, 1);
  cloud(ctx, x + 180, y + 50, 0.8);
  if (v === 0) bird(ctx, x + 430, y + 90, 1, '#22303f');
  bird(ctx, x + 480, y + 60, 0.9, '#22303f');
  rect(ctx, x, y + 300, w, 160, '#74c69d');
  ellipse(ctx, x + 280, y + 360, 180, 55, '#4cc9f0');
  if (v === 1) {
    circle(ctx, x + 470, y + 340, 16, '#ffffff');
    circle(ctx, x + 462, y + 336, 5, '#22303f');
  }
  if (v === 0) {
    circle(ctx, x + 90, y + 300, 10, '#e63946');
    circle(ctx, x + 78, y + 292, 7, '#e63946');
    circle(ctx, x + 102, y + 292, 7, '#e63946');
  }
  tree(ctx, x + 70, y + 220, 1);
  tree(ctx, x + 500, y + 210, 0.85);
  // Kite: diamond, string and tail. The tail is only in the original.
  ctx.fillStyle = '#ef476f';
  ctx.beginPath();
  ctx.moveTo(x + 280, y + 170);
  ctx.lineTo(x + 310, y + 210);
  ctx.lineTo(x + 280, y + 250);
  ctx.lineTo(x + 250, y + 210);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#22303f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 280, y + 250);
  ctx.lineTo(x + 300, y + 300);
  ctx.stroke();
  if (v === 0) {
    circle(ctx, x + 288, y + 268, 6, '#ffd60a');
    circle(ctx, x + 296, y + 286, 6, '#06d6a0');
  }
  // Bench: two slats in the original, one in the variant.
  rect(ctx, x + 170, y + 370, 90, 10, '#8b5a2b');
  if (v === 0) rect(ctx, x + 170, y + 388, 90, 10, '#8b5a2b');
  rect(ctx, x + 176, y + 380, 8, 44, '#5c3d1e');
  rect(ctx, x + 246, y + 380, 8, 44, '#5c3d1e');
  ctx.fillStyle = '#22303f';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Sunny Park', x + 18, y + 34);
}

function drawCafe(ctx, v, x, y, w, h) {
  rect(ctx, x, y, w, h, '#f4a261');
  rect(ctx, x, y, w, 300, '#ffe8c2');
  rect(ctx, x, y + 300, w, 160, '#b08968');
  // Window with a cat on the sill.
  rect(ctx, x + 40, y + 40, 220, 180, '#a8dadc');
  circle(ctx, x + 90, y + 80, 24, '#ffd60a');
  rect(ctx, x + 40, y + 220, 220, 12, '#7a4a2b');
  ellipse(ctx, x + 150, y + 205, 42, 26, '#f4f1de');
  circle(ctx, x + 132, y + 178, 18, '#f4f1de');
  circle(ctx, x + 124, y + 164, 7, '#f4f1de');
  circle(ctx, x + 140, y + 164, 7, '#f4f1de');
  if (v === 0) {
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.moveTo(x + 132, y + 186);
    ctx.lineTo(x + 146, y + 182);
    ctx.lineTo(x + 139, y + 194);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#4361ee';
    ctx.beginPath();
    ctx.moveTo(x + 132, y + 186);
    ctx.lineTo(x + 146, y + 182);
    ctx.lineTo(x + 139, y + 194);
    ctx.closePath();
    ctx.fill();
  }
  // Tail tip: orange in the original, cream in the variant.
  ctx.strokeStyle = v === 0 ? '#fb8500' : '#f4f1de';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x + 188, y + 208);
  ctx.quadraticCurveTo(x + 210, y + 200, x + 214, y + 182);
  ctx.stroke();
  // Wall clock.
  circle(ctx, x + 430, y + 80, 34, '#ffffff');
  ctx.strokeStyle = '#22303f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + 430, y + 80, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 430, y + 80);
  ctx.lineTo(x + 430, y + 58);
  ctx.moveTo(x + 430, y + 80);
  ctx.lineTo(x + (v === 0 ? 448 : 414), y + 88);
  ctx.stroke();
  // Picture frame: present in the original, empty wall in the variant.
  if (v === 0) {
    rect(ctx, x + 180, y + 60, 60, 44, '#2a9d8f');
    ctx.strokeStyle = '#22303f';
    ctx.strokeRect(x + 180, y + 60, 60, 44);
  }
  // Shelf with books.
  rect(ctx, x + 330, y + 280, 190, 12, '#7a4a2b');
  const bookColors = ['#e63946', '#2a9d8f', '#ffb703', '#4361ee'];
  bookColors.forEach((c, i) => {
    if (v === 1 && i === 3) return; // one book missing in the variant
    rect(ctx, x + 340 + i * 34, y + 240, 28, 40, c);
  });
  // Coffee cup with steam in the original only.
  rect(ctx, x + 260, y + 340, 70, 50, '#ffffff');
  ctx.strokeStyle = '#22303f';
  ctx.strokeRect(x + 260, y + 340, 70, 50);
  if (v === 0) {
    ctx.strokeStyle = '#9fb0c0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 280, y + 330);
    ctx.quadraticCurveTo(x + 272, y + 315, x + 280, y + 300);
    ctx.moveTo(x + 305, y + 330);
    ctx.quadraticCurveTo(x + 297, y + 315, x + 305, y + 300);
    ctx.stroke();
  }
  // Plant: three leaves in the original, two in the variant.
  rect(ctx, x + 70, y + 380, 50, 40, '#e63946');
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(x + 82, y + 350, 10, 26, -0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 108, y + 350, 10, 26, 0.4, 0, Math.PI * 2);
  if (v === 0) ctx.ellipse(x + 95, y + 336, 10, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22303f';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Cat Café', x + 18, y + 34);
}

function drawBeach(ctx, v, x, y, w, h) {
  rect(ctx, x, y, w, h, '#ffbe8a');
  rect(ctx, x, y, w, 220, '#6d5df6');
  if (v === 0) circle(ctx, x + 120, y + 80, 8, '#ffffff');
  circle(ctx, x + 180, y + 60, 6, '#ffffff');
  circle(ctx, x + 300, y + 90, 6, '#ffffff');
  if (v === 0) bird(ctx, x + 210, y + 130, 1, '#22303f');
  bird(ctx, x + 260, y + 100, 0.9, '#22303f');
  ellipse(ctx, x + 280, y + 210, 220, 60, '#4361ee');
  // Boat: sail up in the original, down in the variant.
  rect(ctx, x + 420, y + 180, 6, 50, '#7a4a2b');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  if (v === 0) {
    ctx.moveTo(x + 426, y + 180);
    ctx.lineTo(x + 426, y + 130);
    ctx.lineTo(x + 462, y + 180);
  } else {
    ctx.moveTo(x + 426, y + 180);
    ctx.lineTo(x + 426, y + 230);
    ctx.lineTo(x + 462, y + 180);
  }
  ctx.closePath();
  ctx.fill();
  rect(ctx, x, y + 280, w, 180, '#f7d6a0');
  // Umbrella: red-white in the original, blue-white in the variant.
  ctx.fillStyle = v === 0 ? '#e63946' : '#4361ee';
  ctx.beginPath();
  ctx.arc(x + 280, y + 250, 70, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x + 280, y + 180);
  ctx.lineTo(x + 310, y + 250);
  ctx.lineTo(x + 250, y + 250);
  ctx.closePath();
  ctx.fill();
  rect(ctx, x + 277, y + 250, 6, 90, '#7a4a2b');
  // Crab: two claws in the original, one in the variant.
  circle(ctx, x + 470, y + 350, 18, '#e63946');
  circle(ctx, x + 452, y + 338, 8, '#e63946');
  if (v === 0) circle(ctx, x + 488, y + 338, 8, '#e63946');
  // Shell in the original only.
  if (v === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 100, y + 300, 14, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  }
  // Beach ball in the variant only.
  if (v === 1) {
    circle(ctx, x + 360, y + 390, 20, '#ffd60a');
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.moveTo(x + 360, y + 370);
    ctx.lineTo(x + 376, y + 390);
    ctx.lineTo(x + 360, y + 410);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#22303f';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Beach at Dusk', x + 18, y + 34);
}

export function drawScene(ctx, level, variant, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (level.id === 'park') drawPark(ctx, variant, x, y, w, h);
  else if (level.id === 'cafe') drawCafe(ctx, variant, x, y, w, h);
  else drawBeach(ctx, variant, x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = '#2b3a4a';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
}
