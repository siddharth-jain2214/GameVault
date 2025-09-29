// Game navigation function
        function playGame(gameType) {
            const gameRoutes = {
                memory: 'memory-game.html',
                'word-association': 'word-association.html'
            };

            if (gameRoutes[gameType]) {
                window.location.href = gameRoutes[gameType];
            } else {
                alert('Game coming soon!');
            }
        }

        // Load and display user stats from localStorage
        function loadUserStats() {
            try {
                const memoryStats = JSON.parse(localStorage.getItem('memoryGameHistory') || '[]');
                const wordStats = JSON.parse(localStorage.getItem('wordGameHistory') || '[]');
                
                const totalGames = memoryStats.length + wordStats.length;
                const totalScore = memoryStats.reduce((sum, game) => sum + (game.score || 0), 0) +
                                 wordStats.reduce((sum, game) => sum + (game.score || 0), 0);
                
                let bestStreak = 0;
                memoryStats.concat(wordStats).forEach(game => {
                    if (game.accuracy >= 70 || game.score > 50) {
                        bestStreak++;
                    }
                });
                
                let favoriteGame = '-';
                if (memoryStats.length > wordStats.length) {
                    favoriteGame = 'Memory';
                } else if (wordStats.length > memoryStats.length) {
                    favoriteGame = 'Word Chain';
                } else if (totalGames > 0) {
                    favoriteGame = 'Tied';
                }
                
                document.getElementById('totalGames').textContent = totalGames;
                document.getElementById('totalScore').textContent = totalScore;
                document.getElementById('bestStreak').textContent = bestStreak;
                document.getElementById('favoriteGame').textContent = favoriteGame;
                
            } catch (error) {
                console.log('No previous game stats found');
            }
        }

        // Smooth scrolling for navigation
        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        // Animate game cards on scroll
        function initCardAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.game-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadUserStats();
            initSmoothScroll();
            initCardAnimations();
            
            // Update footer year
            document.querySelector('.footer p').innerHTML = 
                `&copy; ${new Date().getFullYear()} GameVault. Challenge your mind with fun brain games!`;
        });

        // Auto-refresh stats when user returns from a game
        setInterval(loadUserStats, 5000);