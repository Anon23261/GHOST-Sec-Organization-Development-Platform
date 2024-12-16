class OSDevGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.terminal = this.createTerminal();
        this.currentLevel = 0;
        this.bootloader = null;
        this.customConfig = {
            packages: [],
            kernelModules: [],
            initSystem: 'sysvinit'
        };
        
        this.levels = {
            'preparation': [
                {
                    challenge: 'Prepare Slackware installation environment',
                    tasks: [
                        'Create partition scheme',
                        'Format partitions',
                        'Mount filesystems'
                    ],
                    solution: `# Create partitions
fdisk /dev/sda
n # new partition
p # primary
1 # partition number
# Enter for default start
+512M # boot partition
n # new partition
p
2
# Enter for default start
+2G # swap partition
n # new partition
p
3
# Enter for default
# Enter for rest of disk
w # write changes`,
                    hint: 'Use fdisk to create boot (512MB), swap (2GB), and root partitions'
                }
            ],
            'base_install': [
                {
                    challenge: 'Install base Slackware system',
                    tasks: [
                        'Setup package sources',
                        'Install base system',
                        'Configure fstab'
                    ],
                    solution: `# Mount target partitions
mount /dev/sda3 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
mkswap /dev/sda2
swapon /dev/sda2

# Install base system
setup2hd
# Select: BASE SYSTEM`,
                    hint: 'Mount partitions first, then use setup2hd for base installation'
                }
            ],
            'bootloader_lilo': [
                {
                    challenge: 'Configure LILO bootloader',
                    tasks: [
                        'Edit lilo.conf',
                        'Set boot options',
                        'Install LILO'
                    ],
                    solution: `# /etc/lilo.conf
boot = /dev/sda
map = /boot/map
install = /boot/boot.b
prompt
timeout = 50
default = slackware

image = /boot/vmlinuz
    root = /dev/sda3
    label = slackware
    read-only`,
                    hint: 'Configure boot device, kernel image path, and root partition'
                }
            ],
            'bootloader_grub': [
                {
                    challenge: 'Configure GRUB bootloader',
                    tasks: [
                        'Install GRUB',
                        'Configure grub.cfg',
                        'Set boot parameters'
                    ],
                    solution: `# Install GRUB
grub-install --target=i386-pc /dev/sda

# /boot/grub/grub.cfg
menuentry "Slackware" {
    set root=(hd0,1)
    linux /vmlinuz root=/dev/sda3 ro
    initrd /initrd.gz
}`,
                    hint: 'Install GRUB to MBR, then configure kernel and initrd paths'
                }
            ],
            'custom_build': [
                {
                    challenge: 'Create custom Slackware build',
                    tasks: [
                        'Select packages',
                        'Configure kernel',
                        'Set build options'
                    ],
                    solution: null, // Dynamic based on user choices
                    hint: 'Choose packages and modules based on your system needs'
                }
            ]
        };
        
        this.init();
    }

    createTerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'os-dev-terminal';
        
        const bootloaderSelect = document.createElement('select');
        bootloaderSelect.className = 'bootloader-select';
        bootloaderSelect.innerHTML = `
            <option value="">Select Bootloader</option>
            <option value="lilo">LILO</option>
            <option value="grub">GRUB</option>
        `;
        bootloaderSelect.onchange = (e) => this.selectBootloader(e.target.value);
        
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'customize-btn';
        customizeBtn.textContent = 'Customize Build';
        customizeBtn.onclick = () => this.showCustomizeModal();
        
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        controls.appendChild(bootloaderSelect);
        controls.appendChild(customizeBtn);
        
        const editor = document.createElement('div');
        editor.className = 'code-editor';
        editor.contentEditable = true;
        editor.spellcheck = false;
        
        const outputArea = document.createElement('div');
        outputArea.className = 'terminal-output';
        
        terminal.appendChild(controls);
        terminal.appendChild(editor);
        terminal.appendChild(outputArea);
        
        return terminal;
    }

    showCustomizeModal() {
        const modal = document.createElement('div');
        modal.className = 'customize-modal';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = `
            <h3>Customize Slackware Build</h3>
            
            <div class="section">
                <h4>Package Selection</h4>
                <div class="package-list">
                    <label><input type="checkbox" value="X11"> X Window System</label>
                    <label><input type="checkbox" value="KDE"> KDE Plasma</label>
                    <label><input type="checkbox" value="XFCE"> XFCE</label>
                    <label><input type="checkbox" value="DEV"> Development Tools</label>
                    <label><input type="checkbox" value="NET"> Networking</label>
                </div>
            </div>
            
            <div class="section">
                <h4>Kernel Modules</h4>
                <div class="module-list">
                    <label><input type="checkbox" value="nvidia"> NVIDIA Drivers</label>
                    <label><input type="checkbox" value="virtualbox"> VirtualBox Support</label>
                    <label><input type="checkbox" value="bluetooth"> Bluetooth Support</label>
                </div>
            </div>
            
            <div class="section">
                <h4>Init System</h4>
                <select class="init-select">
                    <option value="sysvinit">SysVinit (Traditional)</option>
                    <option value="systemd">systemd</option>
                </select>
            </div>
            
            <button class="save-btn">Save Configuration</button>
            <button class="close-btn">Close</button>
        `;
        
        modal.appendChild(content);
        this.container.appendChild(modal);
        
        const saveBtn = content.querySelector('.save-btn');
        saveBtn.onclick = () => this.saveCustomConfig(modal);
        
        const closeBtn = content.querySelector('.close-btn');
        closeBtn.onclick = () => modal.remove();
    }

    saveCustomConfig(modal) {
        const packages = Array.from(modal.querySelectorAll('.package-list input:checked')).map(cb => cb.value);
        const modules = Array.from(modal.querySelectorAll('.module-list input:checked')).map(cb => cb.value);
        const initSystem = modal.querySelector('.init-select').value;
        
        this.customConfig = {
            packages,
            kernelModules: modules,
            initSystem
        };
        
        this.updateCustomSolution();
        modal.remove();
    }

    updateCustomSolution() {
        let solution = '# Custom Slackware Build Configuration\n\n';
        
        // Package selection
        solution += '# Selected Packages\n';
        this.customConfig.packages.forEach(pkg => {
            solution += `installpkg ${pkg.toLowerCase()}-*.txz\n`;
        });
        
        // Kernel modules
        solution += '\n# Kernel Modules\n';
        this.customConfig.kernelModules.forEach(module => {
            solution += `echo "${module}" >> /etc/modules\n`;
        });
        
        // Init system
        solution += `\n# Init System: ${this.customConfig.initSystem}\n`;
        if (this.customConfig.initSystem === 'systemd') {
            solution += 'installpkg systemd-*.txz\n';
            solution += 'rm /etc/inittab\n';
            solution += 'systemctl enable systemd-journald\n';
        }
        
        this.levels.custom_build[0].solution = solution;
    }

    selectBootloader(bootloader) {
        this.bootloader = bootloader;
        if (bootloader) {
            this.currentLevel = 0;
            this.init();
        }
    }

    getCurrentSection() {
        if (!this.bootloader) return 'preparation';
        if (this.currentLevel === 0) return 'base_install';
        if (this.currentLevel === 1) return this.bootloader === 'lilo' ? 'bootloader_lilo' : 'bootloader_grub';
        return 'custom_build';
    }

    init() {
        const section = this.getCurrentSection();
        const level = this.levels[section][0];
        
        const challenge = document.createElement('div');
        challenge.className = 'challenge-text';
        challenge.innerHTML = `
            <h3>${level.challenge}</h3>
            <div class="tasks">
                ${level.tasks.map(task => `<div class="task">${task}</div>`).join('')}
            </div>
        `;
        
        this.terminal.querySelector('.code-editor').innerHTML = '';
        this.terminal.querySelector('.terminal-output').innerHTML = '';
        
        this.container.innerHTML = '';
        this.container.appendChild(challenge);
        this.container.appendChild(this.terminal);
        
        const hintBtn = document.createElement('button');
        hintBtn.className = 'hint-btn';
        hintBtn.textContent = 'Get Hint';
        hintBtn.onclick = () => this.showHint();
        
        const runBtn = document.createElement('button');
        runBtn.className = 'run-btn';
        runBtn.textContent = 'Run Commands';
        runBtn.onclick = () => this.checkSolution();
        
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.appendChild(hintBtn);
        controls.appendChild(runBtn);
        
        this.container.appendChild(controls);
    }

    checkSolution() {
        const section = this.getCurrentSection();
        const level = this.levels[section][0];
        const userCode = this.terminal.querySelector('.code-editor').innerText.trim();
        
        if (section === 'custom_build') {
            this.showSuccess('Custom build configuration saved!');
            return;
        }
        
        const solution = level.solution.trim();
        const normalizedUserCode = userCode.replace(/\s+/g, ' ');
        const normalizedSolution = solution.replace(/\s+/g, ' ');
        
        if (normalizedUserCode === normalizedSolution) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }

    showSuccess(message = 'Correct! Moving to next level...') {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML += `<div class="success">${message}</div>`;
        
        setTimeout(() => {
            this.currentLevel++;
            this.init();
        }, 1500);
    }

    showError() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML += '<div class="error">Command sequence incorrect. Check the syntax and try again.</div>';
    }

    showHint() {
        const section = this.getCurrentSection();
        const level = this.levels[section][0];
        
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML += `<div class="hint">Hint: ${level.hint}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new OSDevGame('osDevGameContainer');
});
