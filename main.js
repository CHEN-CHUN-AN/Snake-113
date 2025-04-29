const GRID_SIZE = 30;
let snake = [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 0 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = null;
let score = 0;
let speed = 200;
let gameInterval = null;
let isRunning = false;
let speedBoost = false; // Flag for speed boost
let speedBoostTimeout = null; // Timeout to reset speed boost

// Initialize the game board
function initBoard() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      gameBoard.appendChild(cell);
    }
  }
}

// Clear the board
function clearBoard() {
  document.querySelectorAll('.snake').forEach(cell => cell.classList.remove('snake'));
  document.querySelectorAll('.food').forEach(cell => cell.classList.remove('food'));
}

// Draw the snake
function drawSnake() {
  snake.forEach(segment => {
    const cell = document.querySelector(`.cell[data-x="${segment.x}"][data-y="${segment.y}"]`);
    if (cell) cell.classList.add('snake');
  });
}

// Draw the food
function drawFood() {
  if (food) {
    const cell = document.querySelector(`.cell[data-x="${food.x}"][data-y="${food.y}"]`);
    if (cell) cell.classList.add('food');
  }
}

// Generate random food
function randomFood() {
  let newFood;
  do {
    newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

// Update the game state
function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Boundary collision detection
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    alert('Game Over! You hit the wall.');
    clearInterval(gameInterval);
    isRunning = false;
    return;
  }

  // Self-collision detection
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    alert('Game Over!');
    clearInterval(gameInterval);
    isRunning = false;
    return;
  }

  snake.unshift(head);

  // Check if food is eaten
  if (food && head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;
    food = randomFood();
    speed = Math.max(50, speed - 10); // Increase speed
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  } else {
    snake.pop();
  }
}

// Main game loop
function gameLoop() {
  if (!isRunning) return;
  clearBoard();
  update();
  drawSnake();
  drawFood();
}

// Start the game
function startGame() {
  clearInterval(gameInterval);
  initBoard();
  snake = [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 0 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  food = randomFood();
  score = 0;
  speed = 200;
  isRunning = true;
  document.getElementById('score').textContent = `Score: ${score}`;
  gameInterval = setInterval(gameLoop, speed);
}

// Pause or resume the game
function togglePause() {
  if (isRunning) {
    clearInterval(gameInterval);
    isRunning = false;
  } else {
    gameInterval = setInterval(gameLoop, speed);
    isRunning = true;
  }
}

// Handle keydown events
window.addEventListener('keydown', e => {
  if (!isRunning) return;
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };
  const newDirection = keyMap[e.key];
  if (newDirection && (newDirection.x + direction.x !== 0 || newDirection.y + direction.y !== 0)) {
    nextDirection = newDirection;

    // Enable speed boost
    if (!speedBoost) {
      speedBoost = true;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed / 2); // Speed up
    }

    // Reset speed boost timer
    clearTimeout(speedBoostTimeout);
    speedBoostTimeout = setTimeout(() => {
      speedBoost = false;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed); // Restore normal speed
    }, 500); // 0.5 seconds to reset speed
  }
});

// Update direction periodically
setInterval(() => {
  direction = nextDirection;
}, speed);

// Bind button events
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);