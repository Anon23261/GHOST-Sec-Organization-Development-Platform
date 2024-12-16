#ifndef PROCESS_GAME_HPP
#define PROCESS_GAME_HPP

#include <SFML/Graphics.hpp>
#include <vector>
#include <memory>
#include <random>
#include <string>

class Process {
public:
    Process(float x, float y, bool isPriority);
    void update(float deltaTime);
    void draw(sf::RenderWindow& window);
    bool isExpired() const;
    bool isPriority() const;
    sf::FloatRect getBounds() const;

private:
    sf::RectangleShape shape;
    float lifetime;
    bool priority;
    float speed;
};

class ProcessGame {
public:
    ProcessGame();
    void run();
    int getScore() const;
    bool isGameOver() const;

private:
    void processEvents();
    void update(float deltaTime);
    void render();
    void spawnProcess();
    void handleProcessClick(const sf::Vector2i& mousePos);
    void updateScore(int points);
    void checkGameOver();
    void reset();

    sf::RenderWindow window;
    std::vector<std::unique_ptr<Process>> processes;
    sf::Font font;
    sf::Text scoreText;
    sf::Text gameOverText;
    int score;
    bool gameOver;
    
    // Game settings
    static constexpr float SPAWN_INTERVAL = 1.0f;
    static constexpr int MAX_PROCESSES = 10;
    static constexpr int PRIORITY_SCORE = 100;
    static constexpr int NORMAL_SCORE = 50;
    
    float spawnTimer;
    std::mt19937 rng;
};

#endif // PROCESS_GAME_HPP
