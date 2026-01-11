export class Game2D {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512; // Square canvas works better for Invaders
    this.ctx = this.canvas.getContext('2d');
    
    this.reset();

    // Desktop testing styles
    this.canvas.style.backgroundColor = '#000000'; // Space background
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '10px';
    this.canvas.style.left = '10px';
    this.canvas.style.zIndex = '1000';
    this.canvas.style.border = '2px solid #00ff00';
    document.body.appendChild(this.canvas);
  }

  reset() {
    this.playerX = 236;
    this.playerY = 460;
    this.bullets = [];
    this.invaders = [];
    this.invaderDirection = 1;
    this.invaderStepDown = false;
    this.gameOver = false;
    this.score = 0;

    // Create a 5x8 grid of invaders
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        this.invaders.push({
          x: 50 + col * 50,
          y: 50 + row * 40,
          alive: true
        });
      }
    }
  }

  // Called by Right/Left on stick or A button
  move(dir) {
    this.playerX += dir * 10;
    // Keep player on screen
    this.playerX = Math.max(0, Math.min(472, this.playerX));
  }

  shoot() {
    if (this.gameOver) { this.reset(); return; }
    // Only allow 3 bullets at a time to prevent spamming
    if (this.bullets.length < 3) {
      this.bullets.push({ x: this.playerX + 18, y: this.playerY });
    }
  }

  update(deltaTime) {
    if (this.gameOver) {
      this.ctx.fillStyle = '#00ff00';
      this.ctx.font = 'bold 40px Courier New';
      this.ctx.fillText('MISSION FAILED', 100, 250);
      return;
    }

    this.ctx.clearRect(0, 0, 512, 512);

    // 1. Update Invaders movement
    let hitEdge = false;
    this.invaders.forEach(inv => {
      if (!inv.alive) return;
      inv.x += (50 * deltaTime) * this.invaderDirection;
      if (inv.x > 480 || inv.x < 10) hitEdge = true;
      if (inv.y > 440) this.gameOver = true; // Invaders reached the bottom
    });

    if (hitEdge) {
      this.invaderDirection *= -1;
      this.invaders.forEach(inv => inv.y += 20);
    }

    // 2. Update Bullets & Collision
    this.bullets.forEach((bullet, bIndex) => {
      bullet.y -= 300 * deltaTime;
      if (bullet.y < 0) this.bullets.splice(bIndex, 1);

      this.invaders.forEach(inv => {
        if (inv.alive && bullet.x > inv.x && bullet.x < inv.x + 30 && bullet.y > inv.y && bullet.y < inv.y + 30) {
          inv.alive = false;
          this.bullets.splice(bIndex, 1);
          this.score += 10;
        }
      });
    });

    // 3. DRAWING
    // Draw Player (Green Tank)
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(this.playerX, this.playerY, 40, 20);

    // Draw Invaders
    this.ctx.fillStyle = '#ffffff';
    this.invaders.forEach(inv => {
      if (inv.alive) this.ctx.fillRect(inv.x, inv.y, 30, 20);
    });

    // Draw Bullets
    this.ctx.fillStyle = '#ffff00';
    this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, 4, 10));

    // Draw Score
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '20px Courier New';
    this.ctx.fillText(`SCORE: ${this.score}`, 10, 30);
  }
}