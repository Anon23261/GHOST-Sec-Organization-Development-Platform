cmake_minimum_required(VERSION 3.10)
project(GhostSecProcessGame)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find SFML package
find_package(SFML 2.5 COMPONENTS graphics window system REQUIRED)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# Add executable
add_executable(process_game
    src/main.cpp
    src/ProcessGame.cpp
)

# Link SFML libraries
target_link_libraries(process_game
    sfml-graphics
    sfml-window
    sfml-system
)
