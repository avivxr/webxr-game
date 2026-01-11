import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.160.0/examples/jsm/webxr/ARButton.js';
import { Game2D } from './Game2D.js';

// --- THE 3D AR SCENE ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

document.body.appendChild(ARButton.createButton(renderer, { 
  requiredFeatures: ['hand-tracking'] 
}));

const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
scene.add(light);

const game = new Game2D();
const gameTexture = new THREE.CanvasTexture(game.canvas);
const gameMaterial = new THREE.MeshBasicMaterial({ 
  map: gameTexture, 
  side: THREE.DoubleSide,
  transparent: true // This tells Three.js to use the alpha channel of the canvas
});

const gameScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), gameMaterial);
gameScreen.position.set(0, 0.2, -1.5);
gameScreen.scale.set(0.3,0.3,0.3 ); // Flip the plane to match canvas coordinates
scene.add(gameScreen);

// Handle the "Click" to jump
const controller = renderer.xr.getController(0);
controller.addEventListener('select', () => game.jump());


function SetCanvasPosition() {
  const handPos = new THREE.Vector3();
  const handRotation = new THREE.Quaternion();

  controller.getWorldPosition(handPos);
  controller.getWorldQuaternion(handRotation);

  gameScreen.position.copy(handPos);
  gameScreen.quaternion.copy(handRotation);

  gameScreen.translateY(0.2); 
  gameScreen.translateZ(-0.1); 
}

let lastTime = performance.now();
function render(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (deltaTime < 0.1) { 
    game.update(deltaTime);
  }

  const session = renderer.xr.getSession();
  if (session) {
    for (const source of session.inputSources) {
      if (source.gamepad && source.handedness === 'right') {
        if (source.gamepad.buttons[4].pressed) game.jump();
      }
    }
  }

  SetCanvasPosition();
  gameTexture.needsUpdate = true;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);