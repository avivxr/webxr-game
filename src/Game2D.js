export class Game2D {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d');
    
    // Dino state
    this.dinoY = 0;
    this.velocity = 0;
    this.gravity = -2000;
    this.isJumping = false;
    this.power = 800;

    // Cactus state
    this.cactusX = 512;
    
    // Game state
    this.score = 0;
    this.gameOver = false;

    // Desktop testing styles
    this.canvas.style.backgroundColor = '#757575'; // Keeps the game area white

    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '10px';
    this.canvas.style.left = '10px';
    this.canvas.style.zIndex = '1000';
    this.canvas.style.border = '2px solid red';
    document.body.appendChild(this.canvas);
  }

jump() {
    if (this.gameOver) {
      this.reset();
      return;
    }
    if (!this.isJumping) {
      this.velocity = this.power; // Set initial upward velocity
      this.isJumping = true;
    }
  }

  reset() {
    this.dinoY = 0;
    this.cactusX = 512;
    this.score = 0;
    this.gameOver = false;
    this.velocity = 0;
  }

  checkCollision() {
    // Define the Dino bounding box
    const dinoLeft = 50;
    const dinoRight = 90; 
    const dinoBottom = 240 - this.dinoY; 
    const dinoTop = dinoBottom - 40;

    // Define the Cactus bounding box
    const cactusLeft = this.cactusX;
    const cactusRight = this.cactusX + 20;
    const cactusTop = 240 - 30; 
    const cactusBottom = 240;

    // Collision math: check if boxes overlap
    if (
      dinoRight > cactusLeft &&
      dinoLeft < cactusRight &&
      dinoBottom > cactusTop
    ) {
      this.gameOver = true;
    }
  }

  update(deltaTime) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // If game is over, stop logic and show text
    if (this.gameOver) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 40px Arial';
      this.ctx.fillText('GAME OVER', 140, 120);
      this.ctx.font = '20px Arial';
      this.ctx.fillText('Press Space/A to Restart', 155, 150);
      return;
    }

    // Physics logic
    if (this.isJumping) {
     this.dinoY += this.velocity * deltaTime;
      this.velocity += this.gravity * deltaTime; 
      
      if (this.dinoY <= 0) {
        this.dinoY = 0;
        this.isJumping = false;
        this.velocity = 0;
      }
    }

    // Move cactus (speed in pixels per second)
    this.cactusX -= 250 * deltaTime; 
    
    // Score point when cactus passes dino
    if (this.cactusX < -20) {
      this.cactusX = 512;
      this.score++;
    }

    this.checkCollision();

    // --- DRAWING ---
    // Draw Dino (Relative to floor at y=240)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(50, 240 - this.dinoY - 40, 40, 40);
    
    // Draw Cactus
    this.ctx.fillStyle  = '#00ff00';
    this.ctx.fillRect(this.cactusX, 240 - 30, 20, 30);
    
    // Draw Floor
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 240, 512, 4);
    
    // Draw Score UI
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 410, 30);
  }
}