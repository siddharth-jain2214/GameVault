// Check if user is logged in
function checkLogin() {
  const username = localStorage.getItem("currentUser");
  const authSection = document.getElementById("authSection");

  if (username) {
    authSection.innerHTML = `
                    <div class="user-info">
                        <span class="username-display">👤 ${username}</span>
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
  location.reload();
}

// Load user stats from localStorage
function loadStats() {
  const memoryHistory = JSON.parse(
    localStorage.getItem("memoryGameHistory") || "[]"
  );
  const wordHistory = JSON.parse(
    localStorage.getItem("wordGameHistory") || "[]"
  );

  const totalGames = memoryHistory.length + wordHistory.length;

  const memoryScore = memoryHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const wordScore = wordHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const totalScore = memoryScore + wordScore;

  let bestStreak = 0;
  memoryHistory.forEach((game) => {
    if (game.accuracy >= 70) bestStreak++;
  });
  wordHistory.forEach((game) => {
    if (game.score > 50) bestStreak++;
  });

  let favoriteGame = "-";
  if (memoryHistory.length > wordHistory.length) {
    favoriteGame = "Memory";
  } else if (wordHistory.length > memoryHistory.length) {
    favoriteGame = "Word Chain";
  } else if (totalGames > 0) {
    favoriteGame = "Tied";
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

  if (gameType === "memory") {
    window.location.href = "memory-game.html";
  } else if (gameType === "word-association") {
    window.location.href = "word-association.html";
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
