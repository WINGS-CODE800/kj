#!/bin/bash
# ==============================================================================
#  KIKI AI — macOS Standalone Application Launcher
#  Launches KIKI AI in its own independent desktop window on your MacBook
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "🤖 Starting KIKI AI Standalone Desktop Environment..."

# 1. Start local macOS Automation Companion Bridge in background
python3 companion/kiki_macos.py > /dev/null 2>&1 &
COMPANION_PID=$!
echo "✅ macOS Automation Bridge running (PID $COMPANION_PID)"

# 2. Check if Electron is available for native frameless window
if command -v npx &> /dev/null; then
    echo "🚀 Launching KIKI AI Desktop Window..."
    # Start server in background
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server ready
    sleep 2
    
    # Launch Electron native window
    npx electron electron/main.cjs
    
    # Cleanup on window close
    kill $SERVER_PID 2>/dev/null
    kill $COMPANION_PID 2>/dev/null
else
    echo "⚠️ Node.js / npx not found. Opening standalone web app..."
    open "http://localhost:3000"
fi
