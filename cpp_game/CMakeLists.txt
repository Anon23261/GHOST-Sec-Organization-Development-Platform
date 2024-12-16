cmake_minimum_required(VERSION 3.10)
project(KernelDefender)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find SFML
find_package(SFML 2.5 COMPONENTS graphics window system REQUIRED)

# Add executable
add_executable(KernelDefender KernelDefender.cpp)

# Link SFML
target_link_libraries(KernelDefender sfml-graphics sfml-window sfml-system)
