class TerminalGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.levels = [
            {
                challenge: 'Find the hidden file in /home/user/',
                solution: 'ls -la /home/user',
                hint: 'Try using ls with some flags to show hidden files'
            },
            {
                challenge: 'Change directory permissions to 755',
                solution: 'chmod 755',
                hint: 'chmod command changes permissions'
            },
            {
                challenge: 'Create a new directory called "secure_files"',
                solution: 'mkdir secure_files',
                hint: 'mkdir creates new directories'
            }
        ];
        this.init();
    }

    createTerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'game-terminal';
        
        const output = document.createElement('div');
        output.className = 'terminal-output';
        terminal.appendChild(output);

        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-input-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'user@ghostsec:~$ ';
        inputLine.appendChild(prompt);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'terminal-input';
        input.id = 'terminal-command-input';
        input.name = 'command';
        input.setAttribute('autocomplete', 'off');
        inputLine.appendChild(input);

        terminal.appendChild(inputLine);
        return terminal;
    }

    init() {
        this.container.innerHTML = '';
        this.container.appendChild(this.terminal);

        const levelDisplay = document.createElement('div');
        levelDisplay.className = 'level-display';
        levelDisplay.textContent = `Level ${this.currentLevel + 1}`;
        this.container.insertBefore(levelDisplay, this.terminal);

        const challenge = document.createElement('div');
        challenge.className = 'challenge';
        challenge.textContent = this.levels[this.currentLevel].challenge;
        this.container.insertBefore(challenge, this.terminal);

        const hintButton = document.createElement('button');
        hintButton.className = 'hint-button';
        hintButton.textContent = 'Get Hint';
        hintButton.onclick = () => this.showHint();
        this.container.appendChild(hintButton);

        const input = this.terminal.querySelector('.terminal-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processCommand(input.value);
                input.value = '';
            }
        });
    }

    processCommand(command) {
        const output = this.terminal.querySelector('.terminal-output');
        const commandDisplay = document.createElement('div');
        commandDisplay.className = 'command-line';
        commandDisplay.innerHTML = `<span class="terminal-prompt">user@ghostsec:~$ </span>${command}`;
        output.appendChild(commandDisplay);

        if (command.trim().toLowerCase() === this.levels[this.currentLevel].solution.toLowerCase()) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Correct! Moving to next level...';
            output.appendChild(successMessage);
            
            setTimeout(() => {
                this.currentLevel++;
                if (this.currentLevel < this.levels.length) {
                    this.init();
                } else {
                    this.showVictory();
                }
            }, 1500);
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Command not recognized. Try again!';
            output.appendChild(errorMessage);
        }

        output.scrollTop = output.scrollHeight;
    }

    showHint() {
        const output = this.terminal.querySelector('.terminal-output');
        const hintMessage = document.createElement('div');
        hintMessage.className = 'hint-message';
        hintMessage.textContent = `Hint: ${this.levels[this.currentLevel].hint}`;
        output.appendChild(hintMessage);
        output.scrollTop = output.scrollHeight;
    }

    showVictory() {
        this.container.innerHTML = `
            <div class="victory-message">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You've completed all levels!</p>
                <button onclick="location.reload()">Play Again</button>
            </div>
        `;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TerminalGame('gameContainer');
});
