// Variables to control game state
let gameRunning = false; // Keeps track of active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
let timeLeft = 30;
let countdownTimer;

// Arrays for winning and losing messages
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

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("start-btn").style.display = "none"; // Hide start button during game

  // Clear any existing drops in container
  document.getElementById("game-container").innerHTML = "";

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Start the 30-second countdown timer
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

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  const gameContainer = document.getElementById("game-container");
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add click event to collect points
  drop.addEventListener("mousedown", () => {
    if (!gameRunning) return;
    score++;
    document.getElementById("score").textContent = score;
    drop.remove(); // Remove drop immediately when clicked
  });

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);

  // Clear remaining drops
  document.getElementById("game-container").innerHTML = "";
  document.getElementById("start-btn").style.display = "inline-block";
  document.getElementById("start-btn").textContent = "Play Again";

  // Pick a random message based on score
  let finalMessage = "";
  if (score >= 20) {
    const randomIndex = Math.floor(Math.random() * winMessages.length);
    finalMessage = winMessages[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * loseMessages.length);
    finalMessage = loseMessages[randomIndex];
  }

  // Display the final score and message in the container
  const container = document.getElementById("game-container");
  container.innerHTML = `
    <div class="game-over-screen">
      <h2>Game Over!</h2>
      <p>Your Final Score: <strong>${score}</strong></p>
      <p class="end-message">${finalMessage}</p>
    </div>
  `;
}