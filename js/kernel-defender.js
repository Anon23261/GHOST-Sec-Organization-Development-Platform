class KernelDefender {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Player
        this.player = {
            x: this.width / 2,
            y: this.height - 30,
            width: 50,
            height: 20,
            speed: 5
        };
        
        // Game state
        this.processes = [];
        this.score = 0;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.spawnInterval = 60;
        
        // Input handling
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.key] = true);
        window.addEventListener('keyup', e => this.keys[e.key] = false);
        
        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    spawnProcess() {
        const isVirus = Math.random() < 0.3;
        this.processes.push({
            x: Math.random() * (this.width - 20),
            y: -20,
            width: 20,
            height: 20,
            speed: 2,
            isVirus
        });
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        // Update player
        if (this.keys['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight']) {
            this.player.x = Math.min(this.width - this.player.width, this.player.x + this.player.speed);
        }
        
        // Spawn processes
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnProcess();
            this.spawnTimer = 0;
        }
        
        // Update processes
        for (let i = this.processes.length - 1; i >= 0; i--) {
            const process = this.processes[i];
            process.y += process.speed;
            
            // Check collision with player
            if (this.checkCollision(process, this.player)) {
                if (process.isVirus) {
                    this.score -= 10;
                    if (this.score < 0) this.gameOver = true;
                } else {
                    this.score += 10;
                }
                this.processes.splice(i, 1);
                continue;
            }
            
            // Remove if off screen
            if (process.y > this.height) {
                this.processes.splice(i, 1);
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw player
        this.ctx.fillStyle = '#0088FF';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw processes
        this.processes.forEach(process => {
            this.ctx.fillStyle = process.isVirus ? '#FF0000' : '#00FF00';
            this.ctx.fillRect(process.x, process.y, process.width, process.height);
        });
        
        // Draw score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        
        // Draw game over
        if (this.gameOver) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.width / 2, this.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Start to play again', this.width / 2, this.height / 2 + 40);
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    restart() {
        this.processes = [];
        this.score = 0;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.player.x = this.width / 2;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('kernelDefenderCanvas');
    canvas.width = 800;
    canvas.height = 600;
    
    let game = new KernelDefender(canvas);
    
    document.getElementById('startKernelDefender').addEventListener('click', () => {
        game.restart();
    });
});
