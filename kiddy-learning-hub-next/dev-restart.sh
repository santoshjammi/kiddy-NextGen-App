#!/bin/bash

# Script to stop any running Next.js dev server and restart it
# Usage: ./dev-restart.sh

echo "🔍 Checking for running Next.js development server..."

# Find and kill any running Next.js dev processes
NEXT_PID=$(ps aux | grep "next dev" | grep -v grep | awk '{print $2}')

if [ ! -z "$NEXT_PID" ]; then
    echo "🛑 Found running Next.js process (PID: $NEXT_PID), stopping it..."
    kill $NEXT_PID

    # Wait a moment for the process to stop
    sleep 2

    # Check if it's still running
    if ps -p $NEXT_PID > /dev/null 2>&1; then
        echo "⚠️  Process still running, force killing..."
        kill -9 $NEXT_PID
        sleep 1
    fi

    echo "✅ Next.js server stopped successfully"
else
    echo "ℹ️  No running Next.js server found"
fi

echo "🚀 Starting Next.js development server..."
npm run dev