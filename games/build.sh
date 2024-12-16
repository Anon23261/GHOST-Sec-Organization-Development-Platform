#!/bin/bash

# Compile the terminal game
g++ -std=c++11 terminal_game.cpp -o slackware_terminal_game

# Make the game executable
chmod +x slackware_terminal_game

echo "Build complete! Run ./slackware_terminal_game to start playing."
