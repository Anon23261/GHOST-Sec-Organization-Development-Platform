class OSDevGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('OS Development Game container not found!');
            return;
        }
        
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.bootloader = 'lilo'; // Default bootloader
        this.customConfig = {
            packages: [],
            kernelModules: [],
            initSystem: 'sysvinit'
        };
        
        this.initializeUI();
        this.loadLevel(0);
    }
    
    createTerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'os-dev-terminal';
        this.container.appendChild(terminal);
        return terminal;
    }
    
    initializeUI() {
        // Create game controls
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        
        // Bootloader selection
        const bootloaderSelect = document.createElement('select');
        bootloaderSelect.className = 'bootloader-select';
        bootloaderSelect.id = 'bootloader-select';
        bootloaderSelect.name = 'bootloader';
        bootloaderSelect.innerHTML = `
            <option value="lilo">LILO</option>
            <option value="grub">GRUB</option>
        `;
        bootloaderSelect.addEventListener('change', (e) => {
            this.bootloader = e.target.value;
            this.updateTerminal(`Switched to ${this.bootloader.toUpperCase()} bootloader`);
        });
        
        // Customize button
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'customize-btn';
        customizeBtn.textContent = 'Customize Build';
        customizeBtn.addEventListener('click', () => this.showCustomizeModal());
        
        controls.appendChild(bootloaderSelect);
        controls.appendChild(customizeBtn);
        this.container.insertBefore(controls, this.terminal);
        
        // Create challenge text area
        const challengeText = document.createElement('div');
        challengeText.className = 'challenge-text';
        this.container.insertBefore(challengeText, controls);
        
        // Create tasks list
        const tasks = document.createElement('div');
        tasks.className = 'tasks';
        this.container.insertBefore(tasks, this.terminal);
    }
    
    showCustomizeModal() {
        const modal = document.createElement('div');
        modal.className = 'customize-modal';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = `
            <h3>Customize Your Build</h3>
            
            <div class="section">
                <h4>Init System</h4>
                <select class="init-select" id="init-system" name="init-system">
                    <option value="sysvinit">SysVinit</option>
                    <option value="systemd">systemd</option>
                </select>
            </div>
            
            <div class="section">
                <h4>Optional Packages</h4>
                <div class="package-list">
                    <label><input type="checkbox" id="pkg-x11" name="pkg-x11" value="X11"> X Window System</label>
                    <label><input type="checkbox" id="pkg-kde" name="pkg-kde" value="kde"> KDE Plasma</label>
                    <label><input type="checkbox" id="pkg-xfce" name="pkg-xfce" value="xfce"> XFCE</label>
                    <label><input type="checkbox" id="pkg-dev" name="pkg-dev" value="dev-tools"> Development Tools</label>
                    <label><input type="checkbox" id="pkg-net" name="pkg-net" value="network"> Network Tools</label>
                </div>
            </div>
            
            <div class="section">
                <h4>Kernel Modules</h4>
                <div class="module-list">
                    <label><input type="checkbox" id="mod-nvidia" name="mod-nvidia" value="nvidia"> NVIDIA Drivers</label>
                    <label><input type="checkbox" id="mod-amd" name="mod-amd" value="amd"> AMD Drivers</label>
                    <label><input type="checkbox" id="mod-wifi" name="mod-wifi" value="wifi"> WiFi Support</label>
                    <label><input type="checkbox" id="mod-bt" name="mod-bt" value="bluetooth"> Bluetooth Support</label>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="save-btn">Save Configuration</button>
                <button class="close-btn">Close</button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Handle save button
        content.querySelector('.save-btn').addEventListener('click', () => {
            this.saveConfiguration(content);
            document.body.removeChild(modal);
        });
        
        // Handle close button
        content.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    saveConfiguration(modalContent) {
        const initSystem = modalContent.querySelector('.init-select').value;
        const packages = Array.from(modalContent.querySelectorAll('.package-list input:checked'))
            .map(input => input.value);
        const modules = Array.from(modalContent.querySelectorAll('.module-list input:checked'))
            .map(input => input.value);
        
        this.customConfig = {
            initSystem,
            packages,
            kernelModules: modules
        };
        
        this.updateTerminal(`Configuration updated:
- Init System: ${initSystem}
- Packages: ${packages.join(', ') || 'none'}
- Kernel Modules: ${modules.join(', ') || 'none'}`);
    }
    
    updateTerminal(text, type = 'success') {
        const message = document.createElement('div');
        message.className = type;
        message.textContent = text;
        this.terminal.appendChild(message);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    loadLevel(levelIndex) {
        const levels = [
            {
                title: 'Preparation',
                description: 'Prepare the system for Slackware installation',
                tasks: [
                    'Create partition scheme',
                    'Format partitions',
                    'Mount filesystems'
                ]
            },
            {
                title: 'Base Installation',
                description: 'Install and configure the base Slackware system',
                tasks: [
                    'Install base packages',
                    'Configure network',
                    'Set up users and passwords'
                ]
            },
            {
                title: 'Bootloader Configuration',
                description: `Configure ${this.bootloader.toUpperCase()} bootloader`,
                tasks: [
                    'Install bootloader',
                    'Configure boot parameters',
                    'Test boot configuration'
                ]
            }
        ];
        
        const level = levels[levelIndex];
        if (!level) {
            this.updateTerminal('Congratulations! You have completed all levels!', 'success');
            return;
        }
        
        const challengeText = this.container.querySelector('.challenge-text');
        challengeText.innerHTML = `
            <h3>${level.title}</h3>
            <p>${level.description}</p>
        `;
        
        const tasks = this.container.querySelector('.tasks');
        tasks.innerHTML = level.tasks.map(task => `
            <div class="task">${task}</div>
        `).join('');
        
        this.updateTerminal(`Level ${levelIndex + 1}: ${level.title}`, 'hint');
    }
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('osDevGameContainer')) {
            console.log('Initializing OS Development Game...');
            const game = new OSDevGame('osDevGameContainer');
        }
    });
} else {
    if (document.getElementById('osDevGameContainer')) {
        console.log('Initializing OS Development Game...');
        const game = new OSDevGame('osDevGameContainer');
    }
}
