#!/bin/bash

echo "🚀 Starting Freelexity - AI Search Assistant"
echo ""

# Check if Ollama is running
echo "Checking Ollama status..."
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama is not running!"
    echo "Please start Ollama first and ensure you have the model downloaded:"
    echo "  ollama pull qwen2.5:1.5b"
    exit 1
fi

echo "✅ Ollama is running"
echo ""

# Start backend in background
echo "Starting backend server..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Application started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
