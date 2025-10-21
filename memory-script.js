// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isPlaying = false;
let startTime = null;
let timerInterval = null;

// Start new game
function startGame() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  isPlaying = true;
  startTime = Date.now();

  generateCards();
  renderBoard();
  updateStats();
  hideMessage();
  startTimer();
}

// Generate 36 cards (18 pairs) with numbers 1-18
function generateCards() {
  const numbers = [];
  for (let i = 1; i <= 18; i++) {
    numbers.push(i);
    numbers.push(i);
  }

  // Shuffle cards
  cards = numbers
    .sort(() => Math.random() - 0.5)
    .map((num, index) => ({
      id: index,
      value: num,
      isFlipped: false,
      isMatched: false,
    }));
}

// Render game board
function renderBoard() {
  const board = document.getElementById("gameBoard");
  board.className = "game-board";
  board.innerHTML = "";

  cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.id = card.id;

    const front = document.createElement("div");
    front.className = "card-front";
    front.textContent = card.value;
    cardEl.appendChild(front);

    cardEl.onclick = () => flipCard(card.id);
    board.appendChild(cardEl);
  });
}

// Flip a card
function flipCard(cardId) {
  if (!isPlaying || flippedCards.length >= 2) return;

  const card = cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  flippedCards.push(card);
  updateCardDisplay(cardId);

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    setTimeout(checkMatch, 600);
  }
}

// Check if cards match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.value === card2.value) {
    card1.isMatched = true;
    card2.isMatched = true;
    matchedPairs++;
    updateCardDisplay(card1.id);
    updateCardDisplay(card2.id);

    if (matchedPairs === 18) {
      endGame();
    }
  } else {
    card1.isFlipped = false;
    card2.isFlipped = false;
    updateCardDisplay(card1.id);
    updateCardDisplay(card2.id);
  }

  flippedCards = [];
  updateStats();
}

// Update card display
function updateCardDisplay(cardId) {
  const card = cards.find((c) => c.id === cardId);
  const cardEl = document.querySelector(`[data-id="${cardId}"]`);

  if (!cardEl) return;

  cardEl.className = "card";
  if (card.isFlipped) cardEl.classList.add("flipped");
  if (card.isMatched) cardEl.classList.add("matched");
}

// Update stats
function updateStats() {
  document.getElementById("movesCount").textContent = moves;
  document.getElementById("matchesCount").textContent = matchedPairs;
}

// Start timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!isPlaying) return;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    document.getElementById("timerCount").textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

// End game
function endGame() {
  isPlaying = false;
  clearInterval(timerInterval);

  const finalTime = Math.floor((Date.now() - startTime) / 1000);
  const accuracy = Math.round((matchedPairs / moves) * 100);

  showMessage(
    `🎉 You Won! Time: ${Math.floor(finalTime / 60)}:${(finalTime % 60)
      .toString()
      .padStart(2, "0")} | Moves: ${moves} | Accuracy: ${accuracy}%`
  );

  saveGame({
    date: new Date().toISOString(),
    moves: moves,
    matches: matchedPairs,
    time: finalTime,
    accuracy: accuracy,
    score: Math.round(accuracy * (18 / (finalTime / 60))),
  });
}

// Save game to user's history
function saveGame(gameData) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const storageKey = `${currentUser}_memoryGameHistory`;
  const history = JSON.parse(localStorage.getItem(storageKey) || "[]");
  history.unshift(gameData);

  if (history.length > 10) {
    history.splice(10);
  }

  localStorage.setItem(storageKey, JSON.stringify(history));
}

// Show message
function showMessage(text) {
  const msg = document.getElementById("gameMessage");
  msg.textContent = text;
  msg.className = "game-message win show";
}

// Hide message
function hideMessage() {
  document.getElementById("gameMessage").className = "game-message";
}

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please login first to play!");
    window.location.href = "login.html";
  }
});
