# Freelexity - AI Search Assistant

A modern web application that combines the power of Ollama's local AI models with real-time web search capabilities, providing an intelligent assistant that can answer questions using both its knowledge base and current web information.

## 🌟 Features

- 🤖 **Local AI**: Uses Ollama to run AI models locally (qwen2.5:1.5b or qwen3:1.7b)
- 🔍 **Web Search**: Integrated DuckDuckGo search for real-time information
- 💬 **Modern Chat UI**: Beautiful, responsive interface built with React and TailwindCSS
- ⚡ **Fast**: Efficient FastAPI backend with async processing
- 🎯 **Smart Search**: Automatically determines when web search is needed
- 📱 **Responsive**: Works seamlessly on desktop and mobile
- 🔒 **Privacy-Friendly**: All AI processing happens locally on your machine

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
2. **Node.js 18+**: [Download Node.js](https://nodejs.org/)
3. **Ollama**: [Download Ollama](https://ollama.ai/)

### Installing Ollama

1. Visit [https://ollama.ai/](https://ollama.ai/) and download Ollama for your platform
2. Install Ollama
3. Pull the qwen2.5:1.5b model:
   ```bash
   ollama pull qwen2.5:1.5b
   ```
   
   Or if you prefer the qwen3:1.7b model:
   ```bash
   ollama pull qwen3:1.7b
   ```

4. Verify Ollama is running:
   ```bash
   ollama list
   ```

## 🚀 Getting Started - Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/adityasaxena-crypto/Freelexity.git
cd Freelexity
```

### 2. Set up the Backend

Navigate to the project directory and install Python dependencies:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or use a virtual environment (recommended)
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Then install dependencies
pip install -r requirements.txt
```

### 3. Set up the Frontend

```bash
cd freelexity/frontend
npm install
cd ../..
```

### 4. Start the Application

You'll need to run both the backend and frontend servers.

#### Option A: Using the Start Script (macOS/Linux)

```bash
cd freelexity
chmod +x start.sh
./start.sh
```

#### Option B: Manual Start (All Platforms)

**Terminal 1 - Start the Backend:**
```bash
cd freelexity/backend
python main.py
```

The backend will start on `http://localhost:8000`

**Terminal 2 - Start the Frontend:**
```bash
cd freelexity/frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to: **http://localhost:3000**

## 💡 Usage

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

## 📁 Project Structure

```
Freelexity/
├── freelexity/
│   ├── backend/
│   │   └── main.py              # FastAPI backend with Ollama & search integration
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.jsx          # Main React component
│   │   │   ├── main.jsx         # React entry point
│   │   │   └── index.css        # Tailwind styles
│   │   ├── index.html           # HTML template
│   │   ├── package.json         # Node dependencies
│   │   ├── vite.config.js       # Vite configuration
│   │   ├── tailwind.config.js   # Tailwind configuration
│   │   └── postcss.config.js    # PostCSS configuration
│   ├── requirements.txt         # Python dependencies
│   ├── start.sh                 # Startup script
│   ├── DESIGN_SYSTEM.md         # Design documentation
│   └── README.md                # Detailed documentation
└── README.md                    # This file
```

## ⚙️ Configuration

### Backend Configuration

Edit `freelexity/backend/main.py` to change settings:

```python
OLLAMA_BASE_URL = "http://localhost:11434"  # Ollama API endpoint
MODEL_NAME = "qwen2.5:1.5b"  # Model to use
```

### Frontend Configuration

Edit `freelexity/frontend/vite.config.js` to change the API proxy:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // Backend URL
    changeOrigin: true,
  }
}
```

## 🔧 Troubleshooting

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

- The qwen2.5:1.5b model is optimized for speed
- If too slow, ensure your system has sufficient RAM
- Consider using a smaller model or adjusting context size

## 🛠️ Technologies Used

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

## 📡 API Endpoints

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

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🔐 Privacy & Security

- The AI model runs locally on your machine - no data is sent to external servers (except for web searches)
- Web searches are performed through DuckDuckGo and don't require an API key
- The application is designed to be privacy-friendly and cost-effective
- No user data is stored or tracked

## 🎯 Future Enhancements

- [ ] Add conversation history persistence
- [ ] Support for multiple AI models
- [ ] File upload and analysis
- [ ] Image generation capabilities
- [ ] Custom search engine integration
- [ ] Export chat history
- [ ] Voice input/output
- [ ] Dark mode toggle
- [ ] Multi-language support

## 👨‍💻 Author

**Aditya Saxena**
- GitHub: [@adityasaxena-crypto](https://github.com/adityasaxena-crypto)

## 🙏 Acknowledgments

- Built with inspiration from Perplexity's clean, search-first interface
- Powered by Ollama for local AI inference
- Uses DuckDuckGo for privacy-friendly web search

---

Built with ❤️ using Ollama, React, and FastAPI

**⭐ If you find this project useful, please consider giving it a star!**
