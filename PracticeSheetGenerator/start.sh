#!/bin/bash

# Default to running 'all' if no argument is provided
COMMAND=${1:-all}

# Function to clear out any running instances holding our ports
stop_backend() {
    echo "Checking for existing backend to restart..."
    # Kills whatever is taking port 8005 without failing if empty
    lsof -ti:8005 | xargs kill -9 2>/dev/null || true
}

stop_frontend() {
    echo "Checking for existing frontend to restart..."
    # Kills whatever is taking port 3005 without failing if empty
    lsof -ti:3005 | xargs kill -9 2>/dev/null || true
}

start_backend() {
    stop_backend
    echo "🚀 Starting Backend API on http://localhost:8005..."
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "Error: Virtual environment 'venv' not found."
        exit 1
    fi
    
    source venv/bin/activate
    python api.py
}

start_frontend() {
    stop_frontend
    echo "🎨 Starting Frontend UI on http://localhost:3005..."
    cd frontend
    npm run dev
}

# The routing logic
if [ "$COMMAND" = "backend" ]; then
    start_backend
elif [ "$COMMAND" = "frontend" ]; then
    start_frontend
elif [ "$COMMAND" = "all" ]; then
    
    # Setup graceful cleanup on exit (Ctrl + C)
    cleanup() {
        echo ""
        echo "🛑 Shutting down backend and frontend services..."
        stop_backend
        stop_frontend
        exit 0
    }
    trap cleanup SIGINT SIGTERM
    
    # Ensure fresh start
    stop_backend
    stop_frontend

    # Start Backend in the background
    source venv/bin/activate
    python api.py &
    
    # Start Frontend in the background
    cd frontend
    npm run dev &
    
    echo ""
    echo "=================================================="
    echo "🔥 Practice Sheet Generator is LIVE! 🔥"
    echo "Frontend UI  -> http://localhost:3005"
    echo "Backend API  -> http://localhost:8005"
    echo "=================================================="
    echo "Press Ctrl+C to safely shut down both servers."
    echo ""
    
    # Keep the script running to catch the Ctrl+C
    wait
else
    echo "Usage: ./start.sh [all|frontend|backend]"
    echo "  all      - Starts both servers (Default)"
    echo "  frontend - Starts only the React UI"
    echo "  backend  - Starts only the FastAPI Python server"
fi
