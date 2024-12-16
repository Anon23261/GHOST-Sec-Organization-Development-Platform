class OSGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.isRunning = false;
        this.processes = [];
        this.interval = null;

        // Game objects
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            width: 50,
            height: 20,
            speed: 5
        };

        // Event listeners
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    startGame() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.score = 0;
        this.processes = [];
        document.getElementById('scoreValue').textContent = this.score;
        
        // Start game loop
        this.interval = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);

        // Spawn processes
        this.processSpawner = setInterval(() => {
            this.spawnProcess();
        }, 2000);
    }

    spawnProcess() {
        const process = {
            x: Math.random() * (this.canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: 2,
            type: Math.random() < 0.3 ? 'bad' : 'good'
        };
        this.processes.push(process);
    }

    update() {
        // Update processes
        for (let i = this.processes.length - 1; i >= 0; i--) {
            const process = this.processes[i];
            process.y += process.speed;

            // Check collision with player
            if (this.checkCollision(this.player, process)) {
                if (process.type === 'good') {
                    this.score += 10;
                } else {
                    this.score -= 5;
                }
                document.getElementById('scoreValue').textContent = this.score;
                this.processes.splice(i, 1);
                continue;
            }

            // Remove processes that are off screen
            if (process.y > this.canvas.height) {
                if (process.type === 'good') {
                    this.score -= 2;
                    document.getElementById('scoreValue').textContent = this.score;
                }
                this.processes.splice(i, 1);
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#121212';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw processes
        this.processes.forEach(process => {
            this.ctx.fillStyle = process.type === 'good' ? '#3498db' : '#e74c3c';
            this.ctx.fillRect(process.x, process.y, process.width, process.height);
        });
    }

    handleKeyPress(e) {
        if (!this.isRunning) return;

        switch(e.key) {
            case 'ArrowLeft':
                this.player.x = Math.max(0, this.player.x - this.player.speed);
                break;
            case 'ArrowRight':
                this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
                break;
        }
    }

    handleKeyUp(e) {
        // Handle key release if needed
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    const game = new OSGame();
});
