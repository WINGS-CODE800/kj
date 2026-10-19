#!/bin/bash
# ================================================================
#  KIKI AI — MacBook Setup Script (Beginner-Friendly)
#  This script configures your Mac for KIKI AI voice automation
# ================================================================

echo "🌟 Welcome to KIKI AI Setup for macOS!"
echo "Checking Python 3 and system requirements..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python from python.org or run: xcode-select --install"
    exit 1
fi

echo "✅ Python 3 is detected: $(python3 --version)"

echo ""
echo "🔐 macOS Accessibility Permission Check:"
echo "To let KIKI type into your active apps and control Excel:"
echo "1. Open 'System Settings' on your Mac"
echo "2. Go to 'Privacy & Security' -> 'Accessibility'"
echo "3. Turn ON the toggle for 'Terminal' or 'iTerm'"
echo ""

echo "🚀 Starting KIKI macOS Companion..."
python3 "$(dirname "$0")/kiki_macos.py"
