import { Game2D } from './Game2D.js';

const game = new Game2D();
let lastTime = 0;

function gameLoop(timestamp) {
  // Calculate deltaTime in seconds
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Only update if deltaTime is a valid, small number
  if (deltaTime > 0 && deltaTime < 0.1) {
    game.update(deltaTime);
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') game.jump();
});

// Start the loop
requestAnimationFrame(gameLoop);
