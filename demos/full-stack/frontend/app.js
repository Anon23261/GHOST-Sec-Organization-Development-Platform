new Vue({
    el: '#app',
    data: {
        isLoggedIn: false,
        showRegisterForm: false,
        username: '',
        currentLevel: 0,
        command: '',
        terminalOutput: [],
        hintsUsed: 0,
        maxHints: 3,
        loginData: {
            email: '',
            password: ''
        },
        registerData: {
            username: '',
            email: '',
            password: ''
        },
        levels: [
            {
                title: "Basic Navigation",
                objectives: ["Navigate directories", "List files", "Show current path"],
                commands: ["cd", "ls", "pwd"],
                hint: "Try using basic navigation commands"
            },
            // Add more levels here
        ],
        completedObjectives: new Set()
    },
    computed: {
        progressPercentage() {
            return (this.completedObjectives.size / this.currentLevelObjectives.length) * 100;
        },
        currentObjectives() {
            return this.levels[this.currentLevel].objectives;
        },
        currentHint() {
            return this.levels[this.currentLevel].hint;
        }
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/login', this.loginData);
                localStorage.setItem('token', response.data.token);
                this.username = response.data.user.username;
                this.isLoggedIn = true;
                this.loadProgress();
            } catch (error) {
                alert('Login failed. Please check your credentials.');
            }
        },
        async register() {
            try {
                const response = await axios.post('http://localhost:3000/api/register', this.registerData);
                localStorage.setItem('token', response.data.token);
                this.username = response.data.user.username;
                this.isLoggedIn = true;
                this.showRegisterForm = false;
            } catch (error) {
                alert('Registration failed. Please try again.');
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.username = '';
            this.currentLevel = 0;
            this.completedObjectives.clear();
        },
        async loadProgress() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.currentLevel = response.data.currentLevel;
                response.data.completedLevels.forEach(level => {
                    this.completedObjectives.add(level);
                });
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        },
        async saveProgress() {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:3000/api/progress', {
                    currentLevel: this.currentLevel,
                    completedLevel: Array.from(this.completedObjectives)
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        },
        executeCommand() {
            const cmd = this.command.trim();
            this.terminalOutput.push({
                type: 'command',
                text: `$ ${cmd}`
            });

            if (this.levels[this.currentLevel].commands.includes(cmd)) {
                this.completedObjectives.add(cmd);
                this.terminalOutput.push({
                    type: 'success',
                    text: 'Command executed successfully!'
                });

                if (this.isLevelComplete()) {
                    this.completeLevel();
                }
            } else {
                this.terminalOutput.push({
                    type: 'error',
                    text: 'Command not recognized. Try again or use a hint.'
                });
            }

            this.command = '';
            this.$nextTick(() => {
                this.$refs.output.scrollTop = this.$refs.output.scrollHeight;
                this.$refs.commandInput.focus();
            });
        },
        isLevelComplete() {
            const requiredCommands = new Set(this.levels[this.currentLevel].commands);
            const completedCommands = new Set(Array.from(this.completedObjectives));
            return requiredCommands.size === completedCommands.size;
        },
        async completeLevel() {
            this.terminalOutput.push({
                type: 'success',
                text: 'Level completed! Moving to next level...'
            });

            await this.saveProgress();

            if (this.currentLevel < this.levels.length - 1) {
                setTimeout(() => {
                    this.currentLevel++;
                    this.completedObjectives.clear();
                    this.terminalOutput = [];
                    this.hintsUsed = 0;
                }, 2000);
            } else {
                this.terminalOutput.push({
                    type: 'success',
                    text: 'Congratulations! You\'ve completed all levels!'
                });
            }
        },
        showHint() {
            if (this.hintsUsed < this.maxHints) {
                this.hintsUsed++;
                this.terminalOutput.push({
                    type: 'hint',
                    text: `Hint: ${this.currentHint}`
                });
            }
        },
        showRegister() {
            this.showRegisterForm = true;
        },
        showLogin() {
            this.showRegisterForm = false;
        },
        isObjectiveCompleted(objective) {
            return this.completedObjectives.has(objective);
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (token) {
            this.isLoggedIn = true;
            this.loadProgress();
        }
    }
});
