#include "ProcessGame.hpp"
#include <ctime>

Process::Process(float x, float y, bool isPriority)
    : lifetime(5.0f), priority(isPriority), speed(100.0f) {
    shape.setSize(sf::Vector2f(50.0f, 50.0f));
    shape.setPosition(x, y);
    shape.setFillColor(isPriority ? sf::Color::Red : sf::Color::Blue);
    shape.setOutlineThickness(2.0f);
    shape.setOutlineColor(sf::Color::White);
}

void Process::update(float deltaTime) {
    lifetime -= deltaTime;
    shape.move(0.0f, speed * deltaTime);
}

void Process::draw(sf::RenderWindow& window) {
    window.draw(shape);
}

bool Process::isExpired() const {
    return lifetime <= 0.0f || shape.getPosition().y > 600.0f;
}

bool Process::isPriority() const {
    return priority;
}

sf::FloatRect Process::getBounds() const {
    return shape.getGlobalBounds();
}

ProcessGame::ProcessGame()
    : window(sf::VideoMode(800, 600), "Process Management Game"),
      score(0),
      gameOver(false),
      spawnTimer(0.0f),
      rng(std::time(nullptr)) {
    
    window.setFramerateLimit(60);
    
    if (!font.loadFromFile("assets/fonts/arial.ttf")) {
        // Handle font loading error
        throw std::runtime_error("Failed to load font");
    }
    
    scoreText.setFont(font);
    scoreText.setCharacterSize(24);
    scoreText.setFillColor(sf::Color::White);
    scoreText.setPosition(10.0f, 10.0f);
    
    gameOverText.setFont(font);
    gameOverText.setCharacterSize(48);
    gameOverText.setFillColor(sf::Color::Red);
    gameOverText.setString("Game Over!");
    gameOverText.setPosition(
        400.0f - gameOverText.getGlobalBounds().width / 2.0f,
        300.0f - gameOverText.getGlobalBounds().height / 2.0f
    );
}

void ProcessGame::run() {
    sf::Clock clock;
    
    while (window.isOpen()) {
        float deltaTime = clock.restart().asSeconds();
        
        processEvents();
        
        if (!gameOver) {
            update(deltaTime);
        }
        
        render();
    }
}

void ProcessGame::processEvents() {
    sf::Event event;
    while (window.pollEvent(event)) {
        if (event.type == sf::Event::Closed) {
            window.close();
        }
        else if (event.type == sf::Event::MouseButtonPressed) {
            if (event.mouseButton.button == sf::Mouse::Left) {
                if (!gameOver) {
                    handleProcessClick(sf::Mouse::getPosition(window));
                }
                else {
                    reset();
                }
            }
        }
    }
}

void ProcessGame::update(float deltaTime) {
    spawnTimer += deltaTime;
    if (spawnTimer >= SPAWN_INTERVAL) {
        spawnProcess();
        spawnTimer = 0.0f;
    }
    
    for (auto it = processes.begin(); it != processes.end();) {
        (*it)->update(deltaTime);
        if ((*it)->isExpired()) {
            if ((*it)->isPriority()) {
                gameOver = true;
            }
            it = processes.erase(it);
        }
        else {
            ++it;
        }
    }
    
    checkGameOver();
    scoreText.setString("Score: " + std::to_string(score));
}

void ProcessGame::render() {
    window.clear(sf::Color(32, 32, 32));
    
    for (const auto& process : processes) {
        process->draw(window);
    }
    
    window.draw(scoreText);
    
    if (gameOver) {
        window.draw(gameOverText);
    }
    
    window.display();
}

void ProcessGame::spawnProcess() {
    if (processes.size() >= MAX_PROCESSES) {
        gameOver = true;
        return;
    }
    
    std::uniform_real_distribution<float> xDist(0.0f, 750.0f);
    std::uniform_real_distribution<float> probDist(0.0f, 1.0f);
    
    float x = xDist(rng);
    bool isPriority = probDist(rng) < 0.3f;
    
    processes.push_back(std::make_unique<Process>(x, 0.0f, isPriority));
}

void ProcessGame::handleProcessClick(const sf::Vector2i& mousePos) {
    sf::Vector2f mouseFloat = sf::Vector2f(static_cast<float>(mousePos.x),
                                         static_cast<float>(mousePos.y));
    
    for (auto it = processes.begin(); it != processes.end(); ++it) {
        if ((*it)->getBounds().contains(mouseFloat)) {
            updateScore((*it)->isPriority() ? PRIORITY_SCORE : NORMAL_SCORE);
            processes.erase(it);
            break;
        }
    }
}

void ProcessGame::updateScore(int points) {
    score += points;
}

void ProcessGame::checkGameOver() {
    if (processes.size() >= MAX_PROCESSES) {
        gameOver = true;
    }
}

void ProcessGame::reset() {
    processes.clear();
    score = 0;
    gameOver = false;
    spawnTimer = 0.0f;
}

int ProcessGame::getScore() const {
    return score;
}

bool ProcessGame::isGameOver() const {
    return gameOver;
}
