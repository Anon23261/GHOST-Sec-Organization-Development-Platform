#!/bin/bash

# Create build directory if it doesn't exist
mkdir -p build

# Navigate to build directory
cd build

# Generate build files with CMake
cmake ..

# Build the project
make -j$(nproc)

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! The game executable is in the build directory."
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi
