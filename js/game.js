class ProcessGame {
    constructor() {
        this.processes = [];
        this.maxProcesses = 10;
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.initializeGame();
    }

    initializeGame() {
        // Create game container
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'process-game';
        this.gameContainer.className = 'process-game';

        // Create score display
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.className = 'score-display';
        this.updateScore();

        // Create process container
        this.processContainer = document.createElement('div');
        this.processContainer.className = 'process-container';

        // Create controls
        this.controls = document.createElement('div');
        this.controls.className = 'game-controls';
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.onclick = () => this.startGame();
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.onclick = () => this.resetGame();

        this.controls.appendChild(startButton);
        this.controls.appendChild(resetButton);

        // Assemble game elements
        this.gameContainer.appendChild(this.scoreDisplay);
        this.gameContainer.appendChild(this.processContainer);
        this.gameContainer.appendChild(this.controls);

        // Add to page
        const gameSection = document.getElementById('game');
        if (gameSection) {
            gameSection.appendChild(this.gameContainer);
        }

        // Add styles
        this.addStyles();
    }

    addStyles() {
        const styles = `
            .process-game {
                width: 100%;
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                background: #1a1a1a;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .score-display {
                font-size: 24px;
                color: #00ff00;
                text-align: center;
                margin-bottom: 20px;
                font-family: 'Courier New', monospace;
            }

            .process-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }

            .process {
                background: #2a2a2a;
                padding: 15px;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid #3a3a3a;
                text-align: center;
            }

            .process:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 4px rgba(0, 255, 0, 0.2);
                border-color: #00ff00;
            }

            .process.high-priority {
                border-color: #ff4444;
            }

            .game-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
            }

            .game-controls button {
                padding: 10px 20px;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background: #00ff00;
                color: #000;
                transition: all 0.3s ease;
            }

            .game-controls button:hover {
                background: #00cc00;
                transform: translateY(-2px);
            }

            @keyframes processSpawn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .process {
                animation: processSpawn 0.3s ease-out;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    startGame() {
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.updateScore();
        this.gameLoop();
    }

    resetGame() {
        this.gameStarted = false;
        this.gameOver = true;
        this.score = 0;
        this.processes = [];
        this.updateScore();
        this.updateProcessDisplay();
    }

    createProcess() {
        if (this.processes.length >= this.maxProcesses) return;
        
        const process = {
            id: Math.random().toString(36).substr(2, 9),
            priority: Math.random() > 0.7,
            timeToLive: Math.floor(Math.random() * 5000) + 3000
        };
        
        this.processes.push(process);
        this.updateProcessDisplay();
    }

    removeProcess(id) {
        const index = this.processes.findIndex(p => p.id === id);
        if (index !== -1) {
            if (this.processes[index].priority) {
                this.score += 100;
            } else {
                this.score += 50;
            }
            this.processes.splice(index, 1);
            this.updateScore();
            this.updateProcessDisplay();
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }

    updateProcessDisplay() {
        this.processContainer.innerHTML = '';
        this.processes.forEach(process => {
            const processElement = document.createElement('div');
            processElement.className = `process ${process.priority ? 'high-priority' : ''}`;
            processElement.textContent = process.priority ? 'Priority Process' : 'Normal Process';
            processElement.onclick = () => this.removeProcess(process.id);
            this.processContainer.appendChild(processElement);
        });
    }

    async gameLoop() {
        while (!this.gameOver && this.gameStarted) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (Math.random() > 0.7) {
                this.createProcess();
            }
            
            // Remove expired processes
            this.processes = this.processes.filter(process => {
                process.timeToLive -= 1000;
                return process.timeToLive > 0;
            });
            
            this.updateProcessDisplay();
            
            // Check game over condition
            if (this.processes.length >= this.maxProcesses) {
                this.gameOver = true;
                alert(`Game Over! Final Score: ${this.score}`);
                this.resetGame();
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProcessGame();
});
