cmake_minimum_required(VERSION 3.10)
project(KernelDefender)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(EMSCRIPTEN)
    # Emscripten-specific settings
    set(CMAKE_EXECUTABLE_SUFFIX ".html")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_SFML=1 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_WEBGL2=1 -s FULL_ES3=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --shell-file ${CMAKE_SOURCE_DIR}/shell.html")
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
else()
    # Native build settings
    find_package(SFML 2.5 COMPONENTS graphics window system REQUIRED)
endif()

# Add executable
add_executable(KernelDefender KernelDefender.cpp)

if(NOT EMSCRIPTEN)
    # Link SFML for native build
    target_link_libraries(KernelDefender sfml-graphics sfml-window sfml-system)
endif()
