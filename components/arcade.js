(() => {
  const panel = document.getElementById('arcade');
  const trigger = document.getElementById('arcade-secret');
  const canvas = document.getElementById('arcade-screen');
  const ctx = canvas?.getContext('2d');
  if (!panel || !trigger || !ctx) return;

  const toggle = document.getElementById('arcade-toggle');
  const status = document.getElementById('arcade-status');
  const scoreLabel = document.getElementById('arcade-score');
  const bestLabel = document.getElementById('arcade-best');
  const livesLabel = document.getElementById('arcade-lives');
  const highScoreCookie = 'arcade_high_score';
  let bestScore = readHighScore();
  const width = canvas.width;
  const height = canvas.height;
  const keys = new Set();
  const invader = [
    '00100000100', '00010001000', '00111111100', '01101110110',
    '11111111111', '10111111101', '10100000101', '00011011000'
  ];
  const shipSprite = [
    '0000001000000', '0000011100000', '0000011100000',
    '0111111111110', '1111111111111', '1111111111111'
  ];
  let mode = 'ready';
  let frame = null;
  let previousTime = null;
  let score = 0;
  let lives = 3;
  let wave = 1;
  let enemies = [];
  let shots = [];
  let enemyShots = [];
  let direction = 1;
  let marchTimer = 0;
  let enemyFireTimer = 0;
  let fireCooldown = 0;
  let protection = 0;
  const ship = { x: (width - 26) / 2, y: height - 24, w: 26, h: 12 };

  function announce(message) {
    status.textContent = message;
  }

  function readHighScore() {
    try {
      const value = document.cookie.split(';').map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(`${highScoreCookie}=`))
        ?.slice(highScoreCookie.length + 1);
      if (!value || !/^\d+$/.test(value)) return 0;
      const saved = Number(value);
      return Number.isSafeInteger(saved) ? saved : 0;
    } catch {
      return 0;
    }
  }

  function saveHighScore() {
    if (score <= bestScore) return;
    // Keep a higher record saved by another tab, if one exists.
    bestScore = Math.max(bestScore, readHighScore());
    if (score <= bestScore) return;
    bestScore = score;
    try {
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${highScoreCookie}=${bestScore}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
    } catch {
      // The current session still tracks its best score if cookies are blocked.
    }
  }

  function updateHud() {
    saveHighScore();
    scoreLabel.textContent = String(score).padStart(4, '0');
    bestLabel.textContent = String(bestScore).padStart(4, '0');
    livesLabel.textContent = String(lives);
  }

  function createWave() {
    enemies = [];
    const rows = Math.min(2 + wave, 4);
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < 6; column++) {
        enemies.push({ x: 12 + column * 32, y: 26 + row * 24, w: 22, h: 16 });
      }
    }
    shots = [];
    enemyShots = [];
    direction = 1;
    marchTimer = 0;
    enemyFireTimer = 0;
    fireCooldown = 0;
  }

  function reset() {
    score = 0;
    lives = 3;
    wave = 1;
    protection = 0;
    ship.x = (width - ship.w) / 2;
    keys.clear();
    createWave();
    updateHud();
  }

  function sprite(pattern, x, y) {
    pattern.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] === '1') ctx.fillRect(Math.round(x) + dx * 2, Math.round(y) + dy * 2, 2, 2);
      }
    });
  }

  function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#111';
    // Sparse, stationary pixels keep the playfield in the site's monochrome style.
    for (let i = 0; i < 16; i++) ctx.fillRect((i * 67 + 19) % width, (i * 41 + 13) % (height - 35), 1, 1);
    enemies.forEach(enemy => sprite(invader, enemy.x, enemy.y));
    sprite(shipSprite, ship.x, ship.y);
    shots.forEach(shot => ctx.fillRect(shot.x, shot.y, shot.w, shot.h));
    enemyShots.forEach(shot => ctx.fillRect(shot.x, shot.y, shot.w, shot.h));
    if (protection > 0) ctx.strokeRect(Math.round(ship.x) - 3, ship.y - 4, ship.w + 6, ship.h + 8);
    ctx.fillRect(8, height - 6, width - 16, 1);
    if (mode === 'playing') return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(15, 101, width - 30, 58);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(15.5, 101.5, width - 31, 57);
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(mode === 'over' ? 'GAME OVER' : mode === 'paused' ? 'PAUSED' : 'HELLO, INVADERS.', width / 2, 124);
    ctx.font = '10px monospace';
    ctx.fillText(mode === 'over' ? `SCORE ${score}` : mode === 'paused' ? 'Resume when ready.' : 'Press Start to play.', width / 2, 144);
  }

  function stopFrames() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    keys.clear();
  }

  function pause() {
    if (mode !== 'playing') return;
    mode = 'paused';
    stopFrames();
    toggle.textContent = 'Resume';
    announce('Paused. Your place is saved.');
    draw();
  }

  function play() {
    if (mode === 'playing') return;
    if (mode === 'ready' || mode === 'over') reset();
    mode = 'playing';
    toggle.textContent = 'Pause';
    announce(`Wave ${wave}. Clear the invaders!`);
    canvas.focus({ preventScroll: true });
    previousTime = null;
    frame = requestAnimationFrame(tick);
  }

  function gameOver() {
    mode = 'over';
    stopFrames();
    toggle.textContent = 'Play again';
    announce(`Game over. Final score: ${score}.`);
  }

  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function step(dt) {
    protection = Math.max(0, protection - dt);
    fireCooldown = Math.max(0, fireCooldown - dt);
    const movement = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
    ship.x = Math.max(4, Math.min(width - ship.w - 4, ship.x + movement * 120 * dt));
    if ((keys.has('ArrowUp') || keys.has(' ')) && fireCooldown === 0) {
      shots.push({ x: ship.x + ship.w / 2 - 1, y: ship.y - 7, w: 2, h: 7 });
      fireCooldown = 0.24;
    }
    shots.forEach(shot => { shot.y -= 200 * dt; });
    enemyShots.forEach(shot => { shot.y += (86 + wave * 8) * dt; });
    shots = shots.filter(shot => shot.y + shot.h > 0);
    enemyShots = enemyShots.filter(shot => shot.y < height);

    for (const shot of [...shots]) {
      const target = enemies.find(enemy => overlaps(shot, enemy));
      if (!target) continue;
      enemies = enemies.filter(enemy => enemy !== target);
      shots = shots.filter(item => item !== shot);
      score += 10;
      updateHud();
    }
    for (const shot of [...enemyShots]) {
      if (!overlaps(shot, ship)) continue;
      enemyShots = enemyShots.filter(item => item !== shot);
      if (protection > 0) continue;
      lives--;
      protection = 1.25;
      updateHud();
      if (lives === 0) {
        gameOver();
        return;
      }
    }
    if (!enemies.length) {
      wave++;
      createWave();
      announce(`Wave ${wave}. Here comes the next fleet.`);
      return;
    }
    marchTimer += dt;
    if (marchTimer >= Math.max(0.12, 0.5 - wave * 0.035 - (24 - enemies.length) * 0.008)) {
      marchTimer = 0;
      const atEdge = enemies.some(enemy => enemy.x + direction * 6 < 4 || enemy.x + enemy.w + direction * 6 > width - 4);
      if (atEdge) {
        direction *= -1;
        enemies.forEach(enemy => { enemy.y += 10; });
      } else {
        enemies.forEach(enemy => { enemy.x += direction * 6; });
      }
      if (enemies.some(enemy => enemy.y + enemy.h >= ship.y)) {
        gameOver();
        return;
      }
    }
    enemyFireTimer += dt;
    if (enemyFireTimer >= Math.max(0.4, 1.15 - wave * 0.08)) {
      enemyFireTimer = 0;
      // Only a frontmost invader fires, so shots don't pass through its fleet.
      const front = enemies.filter(enemy => !enemies.some(other => other.x === enemy.x && other.y > enemy.y));
      const shooter = front[Math.floor(Math.random() * front.length)];
      enemyShots.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, w: 2, h: 6 });
    }
  }

  function tick(time) {
    frame = null;
    if (mode !== 'playing' || panel.hidden) return;
    const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.035);
    previousTime = time;
    step(dt);
    draw();
    if (mode === 'playing') frame = requestAnimationFrame(tick);
  }

  function reveal() {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    draw();
    if (matchMedia('(max-width: 1399px)').matches) panel.scrollIntoView({ block: 'center', behavior: 'instant' });
    canvas.focus({ preventScroll: true });
  }

  function close() {
    pause();
    panel.hidden = true;
    stopFrames();
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  }

  trigger.hidden = false;
  trigger.addEventListener('click', () => panel.hidden ? reveal() : close());
  document.getElementById('arcade-close').addEventListener('click', close);
  toggle.addEventListener('click', () => mode === 'playing' ? pause() : play());
  document.getElementById('arcade-restart').addEventListener('click', () => {
    stopFrames();
    mode = 'ready';
    play();
  });

  // Keyboard input belongs to the game only while focus is inside its window.
  panel.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    // Preserve ordinary Space/Enter activation when a button has focus.
    if (event.target !== canvas) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(event.key)) {
      event.preventDefault();
      if (mode === 'playing') keys.add(event.key);
    } else if (['ArrowDown', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
      if (!event.repeat) mode === 'playing' ? pause() : mode === 'paused' && play();
    }
  });
  panel.addEventListener('keyup', event => { keys.delete(event.key); });
  panel.addEventListener('focusout', event => {
    if (!panel.contains(event.relatedTarget)) pause();
  });
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });

  panel.querySelectorAll('[data-arcade-key]').forEach(button => {
    const key = button.dataset.arcadeKey;
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      if (mode !== 'playing') return;
      button.setPointerCapture(event.pointerId);
      canvas.focus({ preventScroll: true });
      keys.add(key);
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(name, () => keys.delete(key));
    }
  });

  reset();
})();
