function playGame(gameType) {
  switch (gameType) {
    case "memory":
      // Redirect to memory game page
      window.location.href = "memory-game.html";
      break;
    case "word-association":
      // Redirect to word association game page
      window.location.href = "word-association.html";
      break;
    default:
      alert("Game coming soon!");
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Load and display user stats
function loadUserStats() {
  try {
    // Get stats from localStorage
    const memoryStats = JSON.parse(
      localStorage.getItem("memoryGameHistory") || "[]"
    );
    const wordStats = JSON.parse(
      localStorage.getItem("wordGameHistory") || "[]"
    );

    // Calculate total games
    const totalGames = memoryStats.length + wordStats.length;

    // Calculate total score (approximate)
    const memoryScore = memoryStats.reduce(
      (sum, game) => sum + (game.score || 0),
      0
    );
    const wordScore = wordStats.reduce(
      (sum, game) => sum + (game.score || 0),
      0
    );
    const totalScore = memoryScore + wordScore;

    // Find best streak (placeholder logic)
    const bestStreak = Math.max(
      memoryStats.length > 0
        ? Math.max(...memoryStats.map((g) => g.accuracy || 0))
        : 0,
      wordStats.length > 0 ? Math.max(...wordStats.map((g) => g.score || 0)) : 0
    );

    // Determine favorite game
    let favoriteGame = "-";
    if (memoryStats.length > wordStats.length) {
      favoriteGame = "Memory";
    } else if (wordStats.length > memoryStats.length) {
      favoriteGame = "Word Chain";
    } else if (totalGames > 0) {
      favoriteGame = "Tied";
    }

    // Update display
    document.getElementById("totalGames").textContent = totalGames;
    document.getElementById("totalScore").textContent = totalScore;
    document.getElementById("bestStreak").textContent = Math.floor(
      bestStreak / 10
    );
    document.getElementById("favoriteGame").textContent = favoriteGame;
  } catch (error) {
    console.log("No previous game stats found");
  }
}

// Load stats when page loads
document.addEventListener("DOMContentLoaded", loadUserStats);

// Refresh stats every 5 seconds (in case user comes back from a game)
setInterval(loadUserStats, 5000);

// Simple animation for game cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe game cards for animation
document.querySelectorAll(".game-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Update copyright year
document.querySelector(
  ".footer p"
).innerHTML = `&copy; ${new Date().getFullYear()} GameVault. Challenge your mind with fun brain games!`;
