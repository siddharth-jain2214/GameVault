
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


function logout() {
  localStorage.removeItem("currentUser");

  
  document.getElementById("totalGames").textContent = "0";
  document.getElementById("totalScore").textContent = "0";
  document.getElementById("bestStreak").textContent = "0";
  document.getElementById("favoriteGame").textContent = "-";

  
  document.getElementById("authSection").innerHTML =
    '<a href="login.html" class="login-btn">Login</a>';
}


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


  const totalGames =
    memoryHistory.length + numberHistory.length 

  const memoryScore = memoryHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  const numberScore = numberHistory.reduce(
    (sum, game) => sum + (game.score || 0),
    0
  );
  
  const totalScore = memoryScore + numberScore;

  let bestStreak = 0;
  memoryHistory.forEach((game) => {
    if (game.accuracy >= 70) bestStreak++;
  });
  numberHistory.forEach((game) => {
    if (game.attempts <= 7) bestStreak++;
  });
  

  let favoriteGame = "-";
  const gameCounts = {
    Memory: memoryHistory.length,
    "Number Guess": numberHistory.length,
    
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


function playGame(gameType) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Please login first to play games!");
    window.location.href = "login.html";
    return;
  }

  
  if (gameType === "memory") {
    window.location.href = "memory-game.html";
  } else if (gameType === "number-guess") {
    window.location.href = "number-guess.html";
  }  else {
    alert("Game coming soon!");
  }
}


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

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  loadStats();
  initSmoothScroll();
});


setInterval(loadStats, 3000);