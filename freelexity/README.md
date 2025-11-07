# Freelexity - AI Search Assistant

A modern web application that combines the power of Ollama's Mistral model with real-time web search capabilities, providing an intelligent assistant that can answer questions using both its knowledge base and current web information.

## Features

- 🤖 **Local AI**: Uses Ollama to run the Mistral model locally
- 🔍 **Web Search**: Integrated DuckDuckGo search for real-time information
- 💬 **Modern Chat UI**: Beautiful, responsive interface built with React and TailwindCSS
- ⚡ **Fast**: Efficient FastAPI backend with async processing
- 🎯 **Smart Search**: Automatically determines when web search is needed
- 📱 **Responsive**: Works seamlessly on desktop and mobile

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
2. **Node.js 18+**: [Download Node.js](https://nodejs.org/)
3. **Ollama**: [Download Ollama](https://ollama.ai/)

### Installing Ollama

1. Visit [https://ollama.ai/](https://ollama.ai/) and download Ollama for your platform
2. Install Ollama
3. Pull the Mistral model:
   ```bash
   ollama pull mistral
   ```

4. Verify Ollama is running:
   ```bash
   ollama list
   ```
   
   You should see `mistral` in the list of available models.

## Installation

### 1. Clone or navigate to the project directory

```bash
cd "/Users/adityasaxena/Personal Projects/freelexity"
```

### 2. Set up the Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or use a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

## Running the Application

You'll need to run both the backend and frontend servers.

### Terminal 1: Start the Backend

```bash
# From the project root
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

### Terminal 2: Start the Frontend

```bash
# From the project root
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Access the Application

Open your browser and navigate to: **http://localhost:3000**

## Configuration

### Backend Configuration

Edit `backend/main.py` to change settings:

```python
OLLAMA_BASE_URL = "http://localhost:11434"  # Ollama API endpoint
MODEL_NAME = "mistral"  # Model to use (you can change to other Ollama models)
```

### Frontend Configuration

Edit `frontend/vite.config.js` to change the API proxy:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // Backend URL
    changeOrigin: true,
  }
}
```

## Usage

1. **Ask Questions**: Type your question in the input box and press Send
2. **Web Search**: Toggle the "Enable web search" checkbox to control when to search the web
3. **View Sources**: When web search is used, sources are displayed below the AI's response
4. **Conversation History**: The chat maintains context across multiple messages

### Example Queries

Try these to test different features:

- "What is quantum computing?" (General knowledge)
- "What's the latest news about AI?" (Web search triggered)
- "How to build a REST API with Python?" (Tutorial/guide search)
- "What's the weather like today?" (Current information)

## Project Structure

```
freelexity/
├── backend/
│   └── main.py           # FastAPI backend with Ollama & search integration
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Tailwind styles
│   ├── index.html        # HTML template
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js # PostCSS configuration
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Troubleshooting

### "Ollama Disconnected" Error

- Ensure Ollama is running: `ollama list`
- Check if the model is downloaded: `ollama list`
- Verify Ollama is accessible at `http://localhost:11434`

### Search Not Working

- The app uses DuckDuckGo which doesn't require an API key
- Check your internet connection
- Verify the `duckduckgo-search` package is installed

### Frontend Can't Connect to Backend

- Ensure the backend is running on port 8000
- Check the proxy configuration in `vite.config.js`
- Look for CORS errors in the browser console

### Model Takes Too Long to Respond

- Mistral is a powerful model that requires decent hardware
- If too slow, ensure your system has sufficient RAM (8GB+ recommended)
- Consider using a smaller model like `llama2` or `phi` for faster responses
- You can change the model in `backend/main.py` by updating `MODEL_NAME`

## API Endpoints

### Backend API

- `GET /` - API status
- `GET /health` - Check Ollama connection
- `POST /chat` - Send chat message
  ```json
  {
    "message": "Your question",
    "history": [],
    "use_search": true
  }
  ```
- `GET /models` - List available Ollama models

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **Ollama**: Local LLM inference
- **DuckDuckGo Search**: Web search API
- **httpx**: Async HTTP client
- **Pydantic**: Data validation

### Frontend
- **React**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS
- **Lucide React**: Icon library
- **Axios**: HTTP client

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Notes

- The model runs locally on your machine - no data is sent to external servers (except for web searches)
- Web searches are performed through DuckDuckGo and don't require an API key
- The application is designed to be privacy-friendly and cost-effective

## Future Enhancements

- [ ] Add conversation history persistence
- [ ] Support for multiple AI models
- [ ] File upload and analysis
- [ ] Image generation capabilities
- [ ] Custom search engine integration
- [ ] Export chat history
- [ ] Voice input/output
- [ ] Dark mode toggle

---

Built with ❤️ using Ollama, React, and FastAPI
