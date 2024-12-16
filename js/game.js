class TerminalGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.loadLevels();
        this.userProgress = this.loadProgress();
    }

    async loadLevels() {
        try {
            const response = await fetch('/game/levels.json');
            this.levels = await response.json();
            this.init();
        } catch (error) {
            console.error('Error loading levels:', error);
        }
    }

    loadProgress() {
        const progress = localStorage.getItem('slackwareGameProgress');
        return progress ? JSON.parse(progress) : {
            currentLevel: 0,
            completedLevels: [],
            achievements: []
        };
    }

    saveProgress() {
        localStorage.setItem('slackwareGameProgress', JSON.stringify(this.userProgress));
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
        prompt.textContent = 'slackware@build:~$ ';
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
        if (!this.levels) return;
        
        this.container.innerHTML = '';
        this.container.appendChild(this.createLevelInfo());
        this.container.appendChild(this.terminal);
        this.container.appendChild(this.createControls());

        const input = this.terminal.querySelector('.terminal-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processCommand(input.value);
                input.value = '';
            }
        });

        this.updateLevelDisplay();
    }

    createLevelInfo() {
        const levelInfo = document.createElement('div');
        levelInfo.className = 'level-info';

        const levelHeader = document.createElement('div');
        levelHeader.className = 'level-header';
        
        const levelTitle = document.createElement('h2');
        levelTitle.textContent = `Level ${this.currentLevel + 1}: ${this.levels.levels[this.currentLevel].title}`;
        levelHeader.appendChild(levelTitle);

        const levelDescription = document.createElement('p');
        levelDescription.className = 'level-description';
        levelDescription.textContent = this.levels.levels[this.currentLevel].description;
        levelHeader.appendChild(levelDescription);

        levelInfo.appendChild(levelHeader);

        const objectives = document.createElement('div');
        objectives.className = 'objectives';
        objectives.innerHTML = '<h3>Objectives:</h3>';
        const objectivesList = document.createElement('ul');
        this.levels.levels[this.currentLevel].objectives.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = obj;
            objectivesList.appendChild(li);
        });
        objectives.appendChild(objectivesList);
        levelInfo.appendChild(objectives);

        return levelInfo;
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'game-controls';

        const hintButton = document.createElement('button');
        hintButton.className = 'hint-button';
        hintButton.textContent = 'Get Hint';
        hintButton.onclick = () => this.showHint();
        controls.appendChild(hintButton);

        const resetButton = document.createElement('button');
        resetButton.className = 'reset-button';
        resetButton.textContent = 'Reset Level';
        resetButton.onclick = () => this.resetLevel();
        controls.appendChild(resetButton);

        return controls;
    }

    processCommand(command) {
        const output = this.terminal.querySelector('.terminal-output');
        const commandDisplay = document.createElement('div');
        commandDisplay.className = 'command-line';
        commandDisplay.innerHTML = `<span class="terminal-prompt">slackware@build:~$ </span>${command}`;
        output.appendChild(commandDisplay);

        const currentLevelData = this.levels.levels[this.currentLevel];
        if (currentLevelData.commands.includes(command.trim())) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Command successful! Objective completed.';
            output.appendChild(successMessage);
            
            if (!this.userProgress.completedLevels.includes(this.currentLevel)) {
                this.userProgress.completedLevels.push(this.currentLevel);
                this.saveProgress();
            }

            if (this.isLevelComplete()) {
                this.showLevelComplete();
            }
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Command not recognized. Try again or use hint.';
            output.appendChild(errorMessage);
        }

        output.scrollTop = output.scrollHeight;
    }

    isLevelComplete() {
        const currentLevelData = this.levels.levels[this.currentLevel];
        const requiredCommands = new Set(currentLevelData.commands);
        const completedCommands = new Set(
            Array.from(this.terminal.querySelectorAll('.command-line'))
                .map(cmd => cmd.textContent.replace('slackware@build:~$ ', '').trim())
                .filter(cmd => requiredCommands.has(cmd))
        );
        return completedCommands.size === requiredCommands.size;
    }

    showLevelComplete() {
        const modal = document.createElement('div');
        modal.className = 'level-complete-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Level ${this.currentLevel + 1} Complete!</h2>
                <p>You've mastered ${this.levels.levels[this.currentLevel].title}</p>
                <button class="next-level-btn">Continue to Next Level</button>
            </div>
        `;
        
        this.container.appendChild(modal);
        
        modal.querySelector('.next-level-btn').onclick = () => {
            modal.remove();
            this.nextLevel();
        };
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.levels.levels.length) {
            this.userProgress.currentLevel = this.currentLevel;
            this.saveProgress();
            this.init();
        } else {
            this.showVictory();
        }
    }

    showHint() {
        const output = this.terminal.querySelector('.terminal-output');
        const hintDisplay = document.createElement('div');
        hintDisplay.className = 'hint-message';
        const currentLevelData = this.levels.levels[this.currentLevel];
        hintDisplay.textContent = `Hint: Try using one of these commands: ${currentLevelData.commands.join(', ')}`;
        output.appendChild(hintDisplay);
        output.scrollTop = output.scrollHeight;
    }

    resetLevel() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
        const resetMessage = document.createElement('div');
        resetMessage.className = 'system-message';
        resetMessage.textContent = 'Level reset. Start fresh!';
        output.appendChild(resetMessage);
    }

    showVictory() {
        this.container.innerHTML = `
            <div class="victory-screen">
                <h1>Congratulations!</h1>
                <p>You've completed all 15 levels of the Slackware Build System tutorial!</p>
                <p>You are now ready to build your own custom Slackware-based operating system.</p>
                <button onclick="location.reload()">Start Over</button>
            </div>
        `;
    }

    updateLevelDisplay() {
        const progress = document.createElement('div');
        progress.className = 'level-progress';
        progress.textContent = `Level ${this.currentLevel + 1} of ${this.levels.levels.length}`;
        this.container.insertBefore(progress, this.container.firstChild);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const game = new TerminalGame('gameContainer');
    } else {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div class="login-required">
                    <h2>Login Required</h2>
                    <p>Please <a href="login.html">login</a> or <a href="register.html">register</a> to play the Slackware Build System game.</p>
                </div>
            `;
        }
    }
});
