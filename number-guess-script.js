let secretNumber = 0;
let attempts = 0;
let isPlaying = false;
let guessHistory = [];
let startTime = 0;

function startGame() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  isPlaying = true;
  guessHistory = [];
  startTime = Date.now();

  updateStats();
  loadBestScore();
  renderGameArea();

  document.getElementById("guessInput").focus();
}

function renderGameArea() {
  const gameContent = document.getElementById("gameContent");
  gameContent.innerHTML = `
                <div class="number-display">?</div>
                <div class="feedback" id="feedback"></div>
                <div class="input-area">
                    <input 
                        type="number" 
                        id="guessInput" 
                        class="number-input" 
                        placeholder="1-100"
                        min="1"
                        max="100"
                    >
                    <br>
                    <button class="guess-btn" onclick="makeGuess()">Guess</button>
                </div>
                <div class="attempts-list">
                    <div class="attempts-title">Your guesses:</div>
                    <div class="attempts-history" id="attemptsHistory">-</div>
                </div>
            `;

  document.getElementById("guessInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") makeGuess();
  });
}

function makeGuess() {
  if (!isPlaying) return;

  const input = document.getElementById("guessInput");
  const guess = parseInt(input.value);

  if (!guess || guess < 1 || guess > 100) {
    showFeedback("Please enter a number between 1 and 100!", "high");
    return;
  }

  attempts++;
  guessHistory.push(guess);
  updateStats();

  if (guess === secretNumber) {
    winGame();
  } else if (guess > secretNumber) {
    showFeedback("📉 Too High! Try lower.", "high");
  } else {
    showFeedback("📈 Too Low! Try higher.", "low");
  }

  input.value = "";
  input.focus();

  document.getElementById("attemptsHistory").textContent =
    guessHistory.join(", ");
}

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function winGame() {
  isPlaying = false;
  const timeUsed = Math.floor((Date.now() - startTime) / 1000);
  const score = Math.max(100 - attempts * 5, 10);

  const gameContent = document.getElementById("gameContent");
  gameContent.innerHTML = `
                <div class="number-display">${secretNumber}</div>
                <div class="game-message">
                    🎉 Congratulations! You found it!<br>
                    <br>
                    Attempts: ${attempts}<br>
                    Time: ${timeUsed} seconds<br>
                    Score: ${score} points
                </div>
                <div class="attempts-list">
                    <div class="attempts-title">Your guesses:</div>
                    <div class="attempts-history">${guessHistory.join(
                      ", "
                    )}</div>
                </div>
            `;

  document.getElementById("scoreCount").textContent = score;

  saveGame({
    date: new Date().toISOString(),
    attempts: attempts,
    timeUsed: timeUsed,
    score: score,
    secretNumber: secretNumber,
  });

  loadBestScore();
}

function updateStats() {
  document.getElementById("attemptsCount").textContent = attempts;
  const currentScore = Math.max(100 - attempts * 5, 10);
  document.getElementById("scoreCount").textContent = isPlaying
    ? currentScore
    : 0;
}

function loadBestScore() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const history = JSON.parse(
    localStorage.getItem(`${currentUser}_numberGameHistory`) || "[]"
  );
  if (history.length > 0) {
    const best = Math.max(...history.map((g) => g.score));
    document.getElementById("bestScore").textContent = best;
  } else {
    document.getElementById("bestScore").textContent = "-";
  }
}

function saveGame(gameData) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const storageKey = `${currentUser}_numberGameHistory`;
  const history = JSON.parse(localStorage.getItem(storageKey) || "[]");
  history.unshift(gameData);

  if (history.length > 10) {
    history.splice(10);
  }

  localStorage.setItem(storageKey, JSON.stringify(history));
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please login first to play!");
    window.location.href = "login.html";
  } else {
    loadBestScore();
  }
});
