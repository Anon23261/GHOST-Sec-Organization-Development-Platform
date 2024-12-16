class OSDevGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.levels = [
            {
                challenge: 'Write the bootloader entry point in x86 assembly',
                solution: 'bits 16\norg 0x7c00\ncli\nxor ax, ax\nmov ds, ax\nmov es, ax\nmov ss, ax\nmov sp, 0x7c00\nsti',
                hint: 'Start with 16-bit mode and set up segments'
            },
            {
                challenge: 'Set up the GDT (Global Descriptor Table)',
                solution: 'gdt_start:\n    dq 0x0\ngdt_code:\n    dw 0xFFFF\n    dw 0x0\n    db 0x0\n    db 10011010b\n    db 11001111b\n    db 0x0',
                hint: 'Define null descriptor first, then code segment'
            },
            {
                challenge: 'Enable protected mode',
                solution: 'cli\nlgdt [gdt_descriptor]\nmov eax, cr0\nor eax, 0x1\nmov cr0, eax\njmp CODE_SEG:init_pm',
                hint: 'Load GDT, modify CR0 register'
            },
            {
                challenge: 'Implement basic memory management',
                solution: 'class MemoryManager {\n    void* allocate(size_t size) {\n        // First-fit allocation\n        return find_free_block(size);\n    }\n}',
                hint: 'Start with a simple first-fit allocator'
            }
        ];
        this.init();
    }

    createTerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'os-dev-terminal';
        
        const editor = document.createElement('div');
        editor.className = 'code-editor';
        editor.contentEditable = true;
        editor.spellcheck = false;
        terminal.appendChild(editor);

        const controls = document.createElement('div');
        controls.className = 'editor-controls';
        
        const runBtn = document.createElement('button');
        runBtn.textContent = 'Run Code';
        runBtn.onclick = () => this.checkSolution();
        controls.appendChild(runBtn);
        
        const hintBtn = document.createElement('button');
        hintBtn.textContent = 'Get Hint';
        hintBtn.onclick = () => this.showHint();
        controls.appendChild(hintBtn);
        
        terminal.appendChild(controls);
        return terminal;
    }

    init() {
        this.container.innerHTML = '';
        this.container.appendChild(this.terminal);

        const challenge = document.createElement('div');
        challenge.className = 'challenge-text';
        challenge.innerHTML = `<h3>Level ${this.currentLevel + 1}</h3><p>${this.levels[this.currentLevel].challenge}</p>`;
        this.container.insertBefore(challenge, this.terminal);

        const editor = this.terminal.querySelector('.code-editor');
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertText', false, '    ');
            }
        });
    }

    checkSolution() {
        const editor = this.terminal.querySelector('.code-editor');
        const userCode = editor.innerText.trim();
        const solution = this.levels[this.currentLevel].solution;
        
        // Basic comparison - in real implementation, would need more sophisticated checking
        if (userCode.replace(/\s+/g, '') === solution.replace(/\s+/g, '')) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Correct! Moving to next level...';
        this.container.appendChild(message);
        
        setTimeout(() => {
            this.currentLevel++;
            if (this.currentLevel < this.levels.length) {
                this.init();
            } else {
                this.showVictory();
            }
        }, 1500);
    }

    showError() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = 'Not quite right. Try again!';
        this.container.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    showHint() {
        const hint = document.createElement('div');
        hint.className = 'hint-message';
        hint.textContent = `Hint: ${this.levels[this.currentLevel].hint}`;
        this.container.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 5000);
    }

    showVictory() {
        this.container.innerHTML = `
            <div class="victory-message">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You've completed all OS development challenges!</p>
                <button onclick="location.reload()">Start Over</button>
            </div>
        `;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new OSDevGame('osDevGameContainer');
});
