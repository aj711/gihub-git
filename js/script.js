// Beginner JS game: Catch the Square
const square = document.getElementById('square');
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreSpan = document.getElementById('score');
const missesSpan = document.getElementById('misses');
const timeSpan = document.getElementById('time');

let score = 0;
let misses = 0;
let timeLeft = 30; // seconds
let timerId = null;
let moveInterval = null;
let gameRunning = false;

function randomPosition() {
  const areaRect = gameArea.getBoundingClientRect();
  const size = square.offsetWidth;
  const x = Math.floor(Math.random() * (areaRect.width - size));
  const y = Math.floor(Math.random() * (areaRect.height - size));
  square.style.left = x + 'px';
  square.style.top = y + 'px';
}

function nextSpeed() {
  // speed in ms between moves; beginner logic: decrease interval as score increases
  return Math.max(300, 1000 - score * 50);
}

function moveSquareOnce() {
  randomPosition();
}

function startMoving() {
  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    moveSquareOnce();
  }, nextSpeed());
}

function startGame() {
  if (gameRunning) return;
  score = 0; misses = 0; timeLeft = 30;
  updateUI();
  gameRunning = true;
  randomPosition();
  startMoving();
  timerId = setInterval(() => {
    timeLeft -= 1;
    timeSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timerId);
  clearInterval(moveInterval);
  timerId = null; moveInterval = null;
  alert('Time up! Your score: ' + score + '\nMisses: ' + misses);
}

function resetGame() {
  clearInterval(timerId);
  clearInterval(moveInterval);
  timerId = null; moveInterval = null;
  score = 0; misses = 0; timeLeft = 30; gameRunning = false;
  updateUI();
  // put square in center
  square.style.left = (gameArea.clientWidth - square.offsetWidth) / 2 + 'px';
  square.style.top = (gameArea.clientHeight - square.offsetHeight) / 2 + 'px';
}

function updateUI() {
  scoreSpan.textContent = score;
  missesSpan.textContent = misses;
  timeSpan.textContent = timeLeft;
}

// handle clicks
square.addEventListener('click', (e) => {
  if (!gameRunning) return;
  score += 1;
  updateUI();
  // give a little feedback
  square.style.transform = 'scale(0.9)';
  setTimeout(() => { square.style.transform = ''; }, 120);
  // move immediately and restart interval (to speed up as score grows)
  moveSquareOnce();
  startMoving();
});

// count misses when player clicks the game area but not the square
gameArea.addEventListener('click', (e) => {
  if (!gameRunning) return;
  if (e.target === square) return; // already handled
  misses += 1;
  updateUI();
  // small visual flash
  gameArea.style.borderColor = '#f66';
  setTimeout(() => { gameArea.style.borderColor = '#ddd'; }, 120);
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// beginner-friendly: position square in center on load
window.addEventListener('load', () => {
  resetGame();
});
