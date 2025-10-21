// Check if user is logged in
function checkLogin() {
  const username = localStorage.getItem("currentUser");
  const authSection = document.getElementById("authSection");

  if (username) {
    authSection.innerHTML = `
                    <div class="user-info">
                        <span class="use  rname-display">👤 ${username}</span>
                        <button class="logout-btn" onclick="logout()">Logout</button>
                    </div>
                `;
  } else {
    authSection.innerHTML = '<a href="login.html" class="login-btn">Login</a>';
  }
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser");

  // Reset stats to 0 immediately
  document.getElementById("totalGames").textContent = "0";
  document.getElementById("totalScore").textContent = "0";
  document.getElementById("bestStreak").textContent = "0";
  document.getElementById("favoriteGame").textContent = "-";

  // Update UI to show login button
  document.getElementById("authSection").innerHTML =
    '<a href="login.html" class="login-btn">Login</a>';
}

// Load user stats from localStorage
function loadStats() {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    document.getElementById("totalGames").textContent = "0";
    document.getElementById("totalScore").textContent = "0";
    document.getElementById("bestStreak").textContent = "0";
    document.getElementById("favoriteGame").textContent = "-";
    return;
  }

  // Load user-specific game history
  const memoryHistory = JSON.parse(
    localStorage.getItem(`${currentUser}_memoryGameHistory`) || "[]"
  );
  const numberHistory = JSON.parse(
    localStorage.getItem(`${currentUser}_numberGameHistory`) || "[]"
  );
  const reactionHistory = JSON.parse(
    localStorage.getItem(`${currentUser}_reactionGameHistory`) || "[]"
  );

  const totalGames =
    memoryHistory.length + numberHistory.length + reactionHistory.length;

  const memoryScore = memoryHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const numberScore = numberHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const reactionScore = reactionHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const totalScore = memoryScore + numberScore + reactionScore;

  let bestStreak = 0;
  memoryHistory.forEach((game) => {
    if (game.accuracy >= 70) bestStreak++;
  });
  numberHistory.forEach((game) => {
    if (game.attempts <= 7) bestStreak++;
  });
  reactionHistory.forEach((game) => {
    if (game.avgTime < 300) bestStreak++;
  });

  let favoriteGame = "-";
  const gameCounts = {
    Memory: memoryHistory.length,
    "Number Guess": numberHistory.length,
    Reaction: reactionHistory.length,
  };

  const maxGames = Math.max(...Object.values(gameCounts));
  if (maxGames > 0) {
    const favorites = Object.keys(gameCounts).filter(
      (game) => gameCounts[game] === maxGames
    );
    favoriteGame = favorites.length === 1 ? favorites[0] : "Tied";
  }

  document.getElementById("totalGames").textContent = totalGames;
  document.getElementById("totalScore").textContent = totalScore;
  document.getElementById("bestStreak").textContent = bestStreak;
  document.getElementById("favoriteGame").textContent = favoriteGame;
}

// Game navigation
function playGame(gameType) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Please login first to play games!");
    window.location.href = "login.html";
    return;
  }

  // Navigate to appropriate game page
  if (gameType === "memory") {
    window.location.href = "memory-game.html";
  } else if (gameType === "number-guess") {
    window.location.href = "number-guess.html";
  } else if (gameType === "reaction-time") {
    window.location.href = "reaction-time.html";
  } else {
    alert("Game coming soon!");
  }
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  loadStats();
  initSmoothScroll();
});

// Auto-refresh stats when user comes back from a game
setInterval(loadStats, 3000);
