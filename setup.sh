#!/bin/bash

# Setup script for Calendar Sidebar Extension

echo "📅 Setting up Calendar Sidebar Extension Environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if command_exists node; then
    echo "✅ Node.js is installed ($(node --version))"
else
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check for npm
if command_exists npm; then
    echo "✅ npm is installed ($(npm --version))"
else
    echo "❌ npm is not installed."
    exit 1
fi

# Initialize package.json if it doesn't exist
if [ ! -f package.json ]; then
    echo "📦 Initializing package.json..."
    npm init -y
else
    echo "✅ package.json already exists"
fi

# Install dev dependencies
echo "⬇️  Installing development dependencies..."
npm install --save-dev eslint prettier

# Create basic ESLint config if it doesn't exist
if [ ! -f .eslintrc.json ]; then
    echo "🛠  Creating basic .eslintrc.json..."
    cat > .eslintrc.json << EOL
{
    "env": {
        "browser": true,
        "es2021": true,
        "webextensions": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
EOL
fi

echo "✅ Setup complete!"
echo "---------------------------------------------------"
echo "👉 Next Steps:"
echo "1. Follow the instructions in SETUP.md to configure Google OAuth."
echo "2. Update manifest.json with your Client ID."
echo "3. Load the extension in Chrome/Edge via 'Load unpacked'."
echo "---------------------------------------------------"
