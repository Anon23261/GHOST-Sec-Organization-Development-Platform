class TerminalGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.loadLevels();
        this.userProgress = this.loadProgress();
    }

    async loadLevels() {
        try {
            const response = await fetch('levels.json');
            this.levels = await response.json();
            this.init();
        } catch (error) {
            console.error('Error loading levels:', error);
            this.showError('Failed to load game levels. Please refresh the page.');
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
        prompt.textContent = 'root@slackware:~# ';
        inputLine.appendChild(prompt);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'terminal-input';
        input.id = 'terminal-command-input';
        input.name = 'command';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('spellcheck', 'false');
        inputLine.appendChild(input);

        terminal.appendChild(inputLine);
        
        // Setup command history navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion(input.value);
            }
        });

        return terminal;
    }

    navigateHistory(direction) {
        const input = this.terminal.querySelector('.terminal-input');
        if (direction === 'up' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex > -1) {
            this.historyIndex--;
            input.value = this.historyIndex >= 0 ? this.commandHistory[this.historyIndex] : '';
        }
    }

    handleTabCompletion(partial) {
        const currentLevel = this.levels.levels[this.currentLevel];
        const matches = currentLevel.commands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            this.terminal.querySelector('.terminal-input').value = matches[0];
        } else if (matches.length > 1) {
            this.appendToOutput('Possible commands:');
            matches.forEach(match => this.appendToOutput(`  ${match}`));
        }
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
                const command = input.value.trim();
                if (command) {
                    this.commandHistory.unshift(command);
                    this.historyIndex = -1;
                    this.processCommand(command);
                    input.value = '';
                }
            }
        });

        this.updateLevelDisplay();
        this.focusInput();
        this.welcomeMessage();
    }

    welcomeMessage() {
        const messages = [
            'Welcome to Slackware Linux Build System Tutorial!',
            `Level ${this.currentLevel + 1}: ${this.levels.levels[this.currentLevel].title}`,
            'Type commands to complete the objectives. Use "help" for assistance.',
            ''
        ];
        messages.forEach(msg => this.appendToOutput(msg));
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
        hintButton.innerHTML = '<i class="fas fa-lightbulb"></i> Get Hint';
        hintButton.onclick = () => this.showHint();
        controls.appendChild(hintButton);

        const resetButton = document.createElement('button');
        resetButton.className = 'reset-button';
        resetButton.innerHTML = '<i class="fas fa-redo"></i> Reset Level';
        resetButton.onclick = () => this.resetLevel();
        controls.appendChild(resetButton);

        const helpButton = document.createElement('button');
        helpButton.className = 'help-button';
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Help';
        helpButton.onclick = () => this.showHelp();
        controls.appendChild(helpButton);

        return controls;
    }

    processCommand(command) {
        if (command === 'help') {
            this.showHelp();
            return;
        }

        if (command === 'clear') {
            this.clearTerminal();
            return;
        }

        this.appendToOutput(`root@slackware:~# ${command}`, 'command-line');

        const currentLevelData = this.levels.levels[this.currentLevel];
        if (currentLevelData.commands.includes(command)) {
            this.appendToOutput('Command successful! Objective completed.', 'success-message');
            
            if (!this.userProgress.completedLevels.includes(this.currentLevel)) {
                this.userProgress.completedLevels.push(this.currentLevel);
                this.saveProgress();
            }

            if (this.isLevelComplete()) {
                this.showLevelComplete();
            }
        } else {
            this.appendToOutput('Command not recognized or incorrect for this level. Try again or use hint.', 'error-message');
        }
    }

    appendToOutput(message, className = '') {
        const output = this.terminal.querySelector('.terminal-output');
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.textContent = message;
        output.appendChild(messageDiv);
        output.scrollTop = output.scrollHeight;
    }

    clearTerminal() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
        this.appendToOutput('Terminal cleared.');
    }

    isLevelComplete() {
        const currentLevelData = this.levels.levels[this.currentLevel];
        const requiredCommands = new Set(currentLevelData.commands);
        const completedCommands = new Set(
            Array.from(this.terminal.querySelectorAll('.command-line'))
                .map(cmd => cmd.textContent.replace('root@slackware:~# ', '').trim())
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
                <div class="level-summary">
                    <h3>Level Summary:</h3>
                    <ul>
                        ${this.levels.levels[this.currentLevel].objectives.map(obj => `<li>${obj} ✓</li>`).join('')}
                    </ul>
                </div>
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
        const currentLevelData = this.levels.levels[this.currentLevel];
        const hintIndex = Math.floor(Math.random() * currentLevelData.hints.length);
        this.appendToOutput(`Hint: ${currentLevelData.hints[hintIndex]}`, 'hint-message');
    }

    showHelp() {
        const helpText = [
            'Available Commands:',
            '  help     - Show this help message',
            '  clear    - Clear the terminal',
            '',
            'Navigation:',
            '  ↑/↓      - Navigate command history',
            '  Tab      - Command completion',
            '',
            'Game Controls:',
            '  Hint     - Get a hint for current level',
            '  Reset    - Reset current level',
            ''
        ];
        helpText.forEach(line => this.appendToOutput(line, 'help-text'));
    }

    resetLevel() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
        this.appendToOutput('Level reset. Start fresh!', 'system-message');
        this.welcomeMessage();
    }

    showVictory() {
        this.container.innerHTML = `
            <div class="victory-screen">
                <h1>🏆 Congratulations, System Master! 🏆</h1>
                <p>You've mastered all 20 levels of the Slackware Build System tutorial!</p>
                
                <div class="achievement-summary">
                    <h2>🌟 Your Achievements 🌟</h2>
                    
                    <div class="achievement-category">
                        <h3>🛠️ System Administration</h3>
                        <ul>
                            <li><span class="achievement-icon">🎯</span> Command Line Virtuoso</li>
                            <li><span class="achievement-icon">⚡</span> Shell Script Sorcerer</li>
                            <li><span class="achievement-icon">🔧</span> System Configuration Expert</li>
                            <li><span class="achievement-icon">📊</span> Resource Management Specialist</li>
                        </ul>
                    </div>

                    <div class="achievement-category">
                        <h3>📦 Package Management</h3>
                        <ul>
                            <li><span class="achievement-icon">📥</span> Package Installation Master</li>
                            <li><span class="achievement-icon">🏗️</span> SlackBuild Creator</li>
                            <li><span class="achievement-icon">🔄</span> Dependency Resolution Expert</li>
                            <li><span class="achievement-icon">🎁</span> Custom Package Builder</li>
                        </ul>
                    </div>

                    <div class="achievement-category">
                        <h3>💻 Kernel Development</h3>
                        <ul>
                            <li><span class="achievement-icon">🔋</span> Kernel Configuration Master</li>
                            <li><span class="achievement-icon">⚙️</span> Module Management Expert</li>
                            <li><span class="achievement-icon">🚀</span> Performance Optimization Guru</li>
                            <li><span class="achievement-icon">🛡️</span> Security Hardening Specialist</li>
                        </ul>
                    </div>

                    <div class="achievement-category">
                        <h3>🌐 Network & Services</h3>
                        <ul>
                            <li><span class="achievement-icon">🔌</span> Network Configuration Pro</li>
                            <li><span class="achievement-icon">🔒</span> Service Security Expert</li>
                            <li><span class="achievement-icon">📡</span> Remote Management Master</li>
                            <li><span class="achievement-icon">🌍</span> Web Services Guru</li>
                        </ul>
                    </div>

                    <div class="achievement-category">
                        <h3>🎓 Advanced Skills</h3>
                        <ul>
                            <li><span class="achievement-icon">🔬</span> System Analysis Expert</li>
                            <li><span class="achievement-icon">🎮</span> Process Management Master</li>
                            <li><span class="achievement-icon">📈</span> Performance Tuning Specialist</li>
                            <li><span class="achievement-icon">🎨</span> Custom Distribution Architect</li>
                        </ul>
                    </div>
                </div>

                <div class="mastery-level">
                    <h3>🏅 Overall Mastery Level: Expert</h3>
                    <div class="mastery-bar">
                        <div class="mastery-progress"></div>
                    </div>
                </div>

                <p class="congratulation-message">You are now a certified Slackware System Master, capable of building and maintaining your own custom Slackware-based operating system!</p>
                
                <div class="victory-buttons">
                    <button class="restart-btn" onclick="location.reload()">
                        <span class="btn-icon">🔄</span> Start New Journey
                    </button>
                    <button class="docs-btn" onclick="window.open('https://docs.slackware.com')">
                        <span class="btn-icon">📚</span> View Documentation
                    </button>
                </div>
            </div>
        `;

        // Add animation classes after a short delay
        setTimeout(() => {
            const achievements = document.querySelectorAll('.achievement-category li');
            achievements.forEach((achievement, index) => {
                setTimeout(() => {
                    achievement.classList.add('achievement-reveal');
                }, index * 100);
            });
        }, 100);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-screen';
        errorDiv.innerHTML = `
            <h2>Error</h2>
            <p>${message}</p>
            <button onclick="location.reload()">Retry</button>
        `;
        this.container.innerHTML = '';
        this.container.appendChild(errorDiv);
    }

    updateLevelDisplay() {
        const progress = document.createElement('div');
        progress.className = 'level-progress';
        progress.innerHTML = `
            <span class="level-number">Level ${this.currentLevel + 1} of ${this.levels.levels.length}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${(this.currentLevel / this.levels.levels.length) * 100}%"></div>
            </div>
        `;
        this.container.insertBefore(progress, this.container.firstChild);
    }

    focusInput() {
        this.terminal.querySelector('.terminal-input').focus();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TerminalGame('gameContainer');
});
