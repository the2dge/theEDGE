
        const emojis = ['🎈', '🎨', '🎯', '🎪', '🎭', '🎸', '🎺', '🎲'];
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let gameStarted = false;
        let startTime;
        let timerInterval;

        function initializeGame() {
            // Create pairs of emojis
            const gameEmojis = [...emojis, ...emojis];
            
            // Shuffle the array
            for (let i = gameEmojis.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameEmojis[i], gameEmojis[j]] = [gameEmojis[j], gameEmojis[i]];
            }

            // Create card elements
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';
            cards = [];

            gameEmojis.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.emoji = emoji;
                
                card.innerHTML = `
                    <div class="card-face card-front">
                        <span class="emoji">${emoji}</span>
                    </div>
                    <div class="card-face card-back">
                        ?
                    </div>
                `;
                
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
                cards.push(card);
            });
        }

        function flipCard() {
            if (!gameStarted) {
                startGame();
            }

            const card = this;
            
            // Prevent flipping if:
            // - Card is already flipped
            // - Card is already matched
            // - Two cards are already flipped
            if (card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                flippedCards.length === 2) {
                return;
            }

            // Flip the card
            card.classList.add('flipped');
            flippedCards.push(card);

            // Check for match when two cards are flipped
            if (flippedCards.length === 2) {
                moves++;
                updateMoves();
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const match = card1.dataset.emoji === card2.dataset.emoji;

            if (match) {
                // Cards match
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    updateMatches();
                    
                    if (matchedPairs === emojis.length) {
                        endGame();
                    }
                    
                    flippedCards = [];
                }, 500);
            } else {
                // Cards don't match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }

        function startGame() {
            gameStarted = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }

        function updateMoves() {
            document.getElementById('moves').textContent = moves;
        }

        function updateMatches() {
            document.getElementById('matches').textContent = `${matchedPairs}/${emojis.length}`;
        }

        function endGame() {
            clearInterval(timerInterval);
            
            const finalTime = document.getElementById('timer').textContent;
            document.getElementById('finalMoves').textContent = moves;
            document.getElementById('finalTime').textContent = finalTime;
            
            setTimeout(() => {
                document.getElementById('overlay').classList.add('show');
                document.getElementById('winMessage').classList.add('show');
            }, 500);
        }

        function resetGame() {
            // Reset game state
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            gameStarted = false;
            clearInterval(timerInterval);
            
            // Update UI
            updateMoves();
            updateMatches();
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('winMessage').classList.remove('show');
            
            // Reinitialize game
            initializeGame();
        }

        // Start the game when page loads
        initializeGame();