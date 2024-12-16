#include <SFML/Graphics.hpp>
#include <vector>
#include <cmath>
#include <memory>
#include <random>

class Process {
public:
    Process(float x, float y, bool isVirus) 
        : position(x, y), isVirus(isVirus) {
        shape.setRadius(10.f);
        shape.setPosition(position);
        shape.setFillColor(isVirus ? sf::Color::Red : sf::Color::Green);
    }

    void update(float dt) {
        position.y += 200.f * dt;
        shape.setPosition(position);
    }

    bool isOffscreen() const {
        return position.y > 600.f;
    }

    sf::CircleShape shape;
    sf::Vector2f position;
    bool isVirus;
};

class Player {
public:
    Player() {
        shape.setSize(sf::Vector2f(50.f, 20.f));
        shape.setFillColor(sf::Color::Blue);
        shape.setPosition(375.f, 550.f);
    }

    void move(float dx) {
        sf::Vector2f pos = shape.getPosition();
        pos.x = std::max(0.f, std::min(750.f, pos.x + dx));
        shape.setPosition(pos);
    }

    sf::RectangleShape shape;
};

class KernelDefender {
public:
    KernelDefender() 
        : window(sf::VideoMode(800, 600), "Kernel Defender")
        , player()
        , score(0) {
        if (!font.loadFromFile("arial.ttf")) {
            // Handle font loading error
        }
        scoreText.setFont(font);
        scoreText.setCharacterSize(24);
        scoreText.setFillColor(sf::Color::White);
        scoreText.setPosition(10.f, 10.f);
    }

    void run() {
        sf::Clock clock;
        while (window.isOpen()) {
            sf::Time elapsed = clock.restart();
            processEvents();
            update(elapsed.asSeconds());
            render();
        }
    }

private:
    void processEvents() {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left))
            player.move(-400.f * 0.016f);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right))
            player.move(400.f * 0.016f);
    }

    void spawnProcess() {
        static std::random_device rd;
        static std::mt19937 gen(rd());
        static std::uniform_real_distribution<> xDist(0.f, 750.f);
        static std::uniform_real_distribution<> typeDist(0.f, 1.f);

        float x = xDist(gen);
        bool isVirus = typeDist(gen) < 0.3f;
        processes.emplace_back(std::make_unique<Process>(x, -20.f, isVirus));
    }

    void update(float dt) {
        spawnTimer += dt;
        if (spawnTimer >= 1.f) {
            spawnProcess();
            spawnTimer = 0.f;
        }

        for (auto it = processes.begin(); it != processes.end();) {
            (*it)->update(dt);
            
            if ((*it)->isOffscreen()) {
                it = processes.erase(it);
            } else {
                sf::FloatRect bounds = (*it)->shape.getGlobalBounds();
                if (bounds.intersects(player.shape.getGlobalBounds())) {
                    score += (*it)->isVirus ? -10 : 10;
                    it = processes.erase(it);
                } else {
                    ++it;
                }
            }
        }

        scoreText.setString("Score: " + std::to_string(score));
    }

    void render() {
        window.clear(sf::Color(30, 30, 30));
        
        window.draw(player.shape);
        for (const auto& process : processes) {
            window.draw(process->shape);
        }
        window.draw(scoreText);
        
        window.display();
    }

    sf::RenderWindow window;
    Player player;
    std::vector<std::unique_ptr<Process>> processes;
    float spawnTimer = 0.f;
    int score;
    sf::Font font;
    sf::Text scoreText;
};

int main() {
    KernelDefender game;
    game.run();
    return 0;
}
