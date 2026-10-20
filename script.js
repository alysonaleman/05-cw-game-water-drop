// Variables to control game state
let gameRunning = false;
let dropMaker;
let score = 0;
let timeLeft = 30;
let countdownTimer;

// Messages
const winMessages = [
  "Amazing job! You brought clean water closer to reality! 💧",
  "Fantastic work! Every drop counts towards a better future! 🌟",
  "You crushed it! Clean water for everyone is within reach! 🎉"
];

const loseMessages = [
  "Good effort! Let's try again and catch even more drops! 💪",
  "Not quite 20, but practice makes progress! Give it another shot! 💧",
  "So close! Try again to make an even bigger splash! 🌊"
];

// Event Listener for Start / Reset Button
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Reset any running loops if clicking Reset mid-game
  clearInterval(dropMaker);
  clearInterval(countdownTimer);

  gameRunning = true;
  score = 0;
  timeLeft = 30;

  // Update UI Displays
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  
  // Change button text to indicate active reset capability
  const startBtn = document.getElementById("start-btn");
  startBtn.textContent = "Reset Game";

  // Clear container screen
  const container = document.getElementById("game-container");
  container.innerHTML = "";

  // Drop creation loop (creates a drop every 800ms)
  dropMaker = setInterval(createDrop, 800);

  // Timer loop
  countdownTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("div");
  
  // 25% chance to generate a "Dirty Water" bad drop
  const isBadDrop = Math.random() < 0.25;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Size calculation
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  // Position within game container
  const gameContainer = document.getElementById("game-container");
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = `${xPosition}px`;

  drop.style.animationDuration = "4s";

  // Click / Tap listener
  drop.addEventListener("mousedown", () => {
    if (!gameRunning) return;

    if (isBadDrop) {
      score = Math.max(0, score - 2); // Deduct 2 points for bad drop
    } else {
      score++; // Add 1 point for good drop
    }

    document.getElementById("score").textContent = score;
    drop.remove();
  });

  gameContainer.appendChild(drop);

  // Clean up drops reaching bottom
  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);

  document.getElementById("game-container").innerHTML = "";
  
  const startBtn = document.getElementById("start-btn");
  startBtn.textContent = "Play Again";

  const isWin = score >= 20;
  let finalMessage = "";

  if (isWin) {
    const randomIndex = Math.floor(Math.random() * winMessages.length);
    finalMessage = winMessages[randomIndex];
    triggerConfetti();
  } else {
    const randomIndex = Math.floor(Math.random() * loseMessages.length);
    finalMessage = loseMessages[randomIndex];
  }

  const container = document.getElementById("game-container");
  container.innerHTML = `
    <div class="game-over-screen">
      <h2>${isWin ? "🎉 Victory!" : "Game Over!"}</h2>
      <p>Your Final Score: <strong>${score}</strong></p>
      <p class="end-message">${finalMessage}</p>
    </div>
  `;
}

function triggerConfetti() {
  const container = document.getElementById("game-container");
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor = ["#FFC200", "#4facfe", "#2ed573", "#ff4757"][
      Math.floor(Math.random() * 4)
    ];
    confetti.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(confetti);
  }
}