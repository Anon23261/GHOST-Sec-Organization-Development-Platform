#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <chrono>
#include <thread>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <termios.h>
#include <unistd.h>

using namespace std;

struct Level {
    int id;
    string title;
    string description;
    vector<string> objectives;
    vector<string> commands;
    string hint;
};

class TerminalGame {
private:
    vector<Level> levels;
    int currentLevel;
    string playerName;
    map<int, bool> completedLevels;
    
    void initializeLevels() {
        levels = {
            {1, "Basic System Navigation", 
             "Learn to navigate the Slackware file system",
             {"Navigate directories", "List files", "Show current path"},
             {"cd", "ls", "pwd"},
             "Try using basic navigation commands"},
            
            {2, "File Operations", 
             "Master basic file operations in Slackware",
             {"Create directory", "Create file", "Copy file"},
             {"mkdir", "touch", "cp"},
             "Use mkdir to create directories"},
            
            {3, "Package Management Basics", 
             "Learn basic package management in Slackware",
             {"Update package list", "Install package", "Remove package"},
             {"slackpkg update", "slackpkg install", "slackpkg remove"},
             "Start with updating package lists"},
            
            {4, "System Information", 
             "Get information about your Slackware system",
             {"Check system info", "View processes", "Check disk space"},
             {"uname -a", "ps aux", "df -h"},
             "The uname command shows system information"},
            
            {5, "User Management", 
             "Learn to manage users in Slackware",
             {"Add user", "Change password", "Modify user"},
             {"useradd", "passwd", "usermod"},
             "User management requires root privileges"},
            
            {6, "Network Configuration", 
             "Configure network settings in Slackware",
             {"Check IP", "Test connection", "View network interfaces"},
             {"ip addr", "ping", "ifconfig"},
             "Start by checking your IP address"},
            
            {7, "Service Management", 
             "Learn to manage system services",
             {"Start service", "Stop service", "Check status"},
             {"rc.d start", "rc.d stop", "rc.d status"},
             "Services are managed through rc.d scripts"},
            
            {8, "File Permissions", 
             "Master file permissions in Slackware",
             {"Change permissions", "Change owner", "View permissions"},
             {"chmod", "chown", "ls -l"},
             "chmod modifies file permissions"},
            
            {9, "Process Management", 
             "Learn to manage system processes",
             {"View processes", "Kill process", "Background process"},
             {"top", "kill", "bg"},
             "Use top to view running processes"},
            
            {10, "System Monitoring", 
             "Monitor system resources and performance",
             {"Check memory", "View CPU info", "Monitor system"},
             {"free -h", "lscpu", "htop"},
             "free shows memory usage"},
            
            {11, "Shell Scripting Basics", 
             "Learn basic shell scripting",
             {"Create script", "Make executable", "Run script"},
             {"nano script.sh", "chmod +x", "./script.sh"},
             "Scripts need execute permissions"},
            
            {12, "Package Building", 
             "Learn to build Slackware packages",
             {"Download source", "Configure build", "Make package"},
             {"wget", "./configure", "makepkg"},
             "Start by downloading the source"},
            
            {13, "System Backup", 
             "Learn system backup procedures",
             {"Backup files", "Create archive", "Compress files"},
             {"rsync", "tar cvf", "gzip"},
             "tar creates archives of files"},
            
            {14, "Boot Management", 
             "Manage system boot configuration",
             {"Edit LILO", "Update boot", "View boot log"},
             {"liloconfig", "lilo", "dmesg"},
             "LILO is the Slackware bootloader"},
            
            {15, "Kernel Management", 
             "Learn to manage the Linux kernel",
             {"Check kernel", "Configure kernel", "Build kernel"},
             {"uname -r", "make menuconfig", "make"},
             "Start by checking current kernel version"},
            
            {16, "Security Hardening", 
             "Implement basic security measures",
             {"Configure firewall", "Set permissions", "Check logs"},
             {"iptables", "chmod 750", "tail -f /var/log/messages"},
             "Start with basic firewall rules"},
            
            {17, "System Recovery", 
             "Learn system recovery procedures",
             {"Check filesystem", "Repair boot", "Emergency mode"},
             {"fsck", "lilo -v", "init 1"},
             "fsck checks filesystem integrity"},
            
            {18, "Network Services", 
             "Configure basic network services",
             {"Setup SSH", "Configure FTP", "Web server"},
             {"sshd_config", "vsftpd", "httpd"},
             "Start with SSH configuration"},
            
            {19, "Performance Tuning", 
             "Optimize system performance",
             {"CPU governor", "IO scheduling", "Memory management"},
             {"cpufreq-set", "ionice", "sysctl"},
             "CPU frequency affects performance"},
            
            {20, "Advanced System Administration", 
             "Master advanced system administration",
             {"LVM management", "RAID setup", "System audit"},
             {"lvcreate", "mdadm", "auditctl"},
             "LVM provides flexible storage management"}
        };
    }

    void clearScreen() {
        cout << "\033[2J\033[1;1H";
    }

    void setTerminalMode() {
        struct termios term;
        tcgetattr(STDIN_FILENO, &term);
        term.c_lflag &= ~ICANON;
        tcsetattr(STDIN_FILENO, TCSANOW, &term);
    }

    void resetTerminalMode() {
        struct termios term;
        tcgetattr(STDIN_FILENO, &term);
        term.c_lflag |= ICANON;
        tcsetattr(STDIN_FILENO, TCSANOW, &term);
    }

    void displayPrompt() {
        cout << "\033[32mslackware@learn\033[0m:\033[34m~$\033[0m ";
    }

    void displayLevel() {
        clearScreen();
        cout << "\033[1;32m=== Level " << currentLevel + 1 << ": " << levels[currentLevel].title << " ===\033[0m\n\n";
        cout << "Description: " << levels[currentLevel].description << "\n\n";
        cout << "Objectives:\n";
        for (const auto& obj : levels[currentLevel].objectives) {
            cout << "- " << obj << "\n";
        }
        cout << "\n";
    }

    bool checkCommand(const string& command) {
        return find(levels[currentLevel].commands.begin(),
                   levels[currentLevel].commands.end(),
                   command) != levels[currentLevel].commands.end();
    }

    void saveProgress() {
        ofstream file("progress.txt");
        file << playerName << endl;
        file << currentLevel << endl;
        for (const auto& pair : completedLevels) {
            file << pair.first << " " << pair.second << endl;
        }
    }

    void loadProgress() {
        ifstream file("progress.txt");
        if (file) {
            getline(file, playerName);
            file >> currentLevel;
            int level;
            bool completed;
            while (file >> level >> completed) {
                completedLevels[level] = completed;
            }
        }
    }

public:
    TerminalGame() : currentLevel(0) {
        initializeLevels();
        setTerminalMode();
    }

    ~TerminalGame() {
        resetTerminalMode();
    }

    void start() {
        clearScreen();
        cout << "\033[1;32m=== Slackware Terminal Learning Game ===\033[0m\n\n";
        cout << "Enter your name: ";
        getline(cin, playerName);
        
        loadProgress();
        
        string command;
        while (true) {
            displayLevel();
            displayPrompt();
            getline(cin, command);

            if (command == "exit") {
                break;
            } else if (command == "help") {
                cout << "Hint: " << levels[currentLevel].hint << "\n";
            } else if (command == "progress") {
                cout << "Completed levels: ";
                for (const auto& pair : completedLevels) {
                    if (pair.second) cout << pair.first + 1 << " ";
                }
                cout << "\n";
            } else if (checkCommand(command)) {
                cout << "\033[32mCorrect command!\033[0m\n";
                completedLevels[currentLevel] = true;
                if (currentLevel < levels.size() - 1) {
                    cout << "Moving to next level...\n";
                    this_thread::sleep_for(chrono::seconds(1));
                    currentLevel++;
                } else {
                    cout << "\033[1;32mCongratulations! You've completed all levels!\033[0m\n";
                    break;
                }
                saveProgress();
            } else {
                cout << "\033[31mIncorrect command. Try again or type 'help' for a hint.\033[0m\n";
            }
        }
    }
};

int main() {
    TerminalGame game;
    game.start();
    return 0;
}
