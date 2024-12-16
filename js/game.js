class Process {
    constructor(id, name, priority, memoryUsage) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.memoryUsage = memoryUsage;
        this.state = 'ready';
        this.position = { x: 0, y: 0 };
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }
}

class ProcessGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.processes = [];
        this.score = 0;
        this.gameLoop = null;
        this.paused = true;
        
        // Matrix rain effect
        this.drops = [];
        this.fontSize = 14;
        this.matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        
        this.setupGame();
        this.setupControls();
    }

    setupGame() {
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize matrix rain
        const columns = Math.floor(this.canvas.width / this.fontSize);
        for(let i = 0; i < columns; i++) {
            this.drops[i] = 1;
        }
    }

    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = 400;
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Initialize System';
        startBtn.addEventListener('click', () => this.toggleGame());
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score';
        scoreDisplay.innerHTML = '<span>System Load: </span><span id="scoreValue">0</span>';
        
        controls.appendChild(startBtn);
        controls.appendChild(scoreDisplay);
        this.container.appendChild(controls);
    }

    toggleGame() {
        if (this.paused) {
            this.startGame();
        } else {
            this.pauseGame();
        }
    }

    startGame() {
        this.paused = false;
        this.gameLoop = requestAnimationFrame(() => this.update());
        this.spawnProcess();
    }

    pauseGame() {
        this.paused = true;
        cancelAnimationFrame(this.gameLoop);
    }

    spawnProcess() {
        if (this.processes.length < 10) {
            const process = new Process(
                Date.now(),
                `Process_${Math.floor(Math.random() * 1000)}`,
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 100)
            );
            
            process.position = {
                x: Math.random() * (this.canvas.width - 30),
                y: 0
            };
            
            this.processes.push(process);
        }
    }

    drawMatrixRain() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';
        
        for(let i = 0; i < this.drops.length; i++) {
            const text = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    update() {
        if (this.paused) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMatrixRain();
        
        // Update and draw processes
        this.processes.forEach((process, index) => {
            process.position.y += 2 + process.priority * 0.5;
            
            // Draw process
            this.ctx.fillStyle = process.color;
            this.ctx.fillRect(process.position.x, process.position.y, 30, 30);
            
            // Draw process info
            this.ctx.fillStyle = '#00FF00';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(process.name, process.position.x, process.position.y - 5);
            
            // Check if process reached bottom
            if (process.position.y > this.canvas.height) {
                this.processes.splice(index, 1);
                this.score += process.priority * 10;
                document.getElementById('scoreValue').textContent = this.score;
            }
        });
        
        // Spawn new process
        if (Math.random() < 0.02) {
            this.spawnProcess();
        }
        
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ProcessGame('game');
});
