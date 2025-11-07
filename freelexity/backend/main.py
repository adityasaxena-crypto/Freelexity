from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
from typing import List, Optional
from PIL import Image
import io
import numpy as np
try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging
from datetime import datetime
import pytz

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Thread pool for blocking operations
executor = ThreadPoolExecutor(max_workers=2)

app = FastAPI(title="Freelexity - AI Search Assistant")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama configuration
OLLAMA_BASE_URL = "http://localhost:11434"
MODEL_NAME = "mistral"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    use_search: bool = True

class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str

class ChatResponse(BaseModel):
    response: str
    search_results: Optional[List[SearchResult]] = None
    used_search: bool = False

class AIImageDetectionResponse(BaseModel):
    is_ai_generated: bool
    confidence: float
    image_size: List[int]
    image_format: Optional[str]
    analysis: dict
    details: dict
    error: Optional[str] = None

def search_web(query: str, max_results: int = 5) -> List[dict]:
    """Search the web using DuckDuckGo"""
    try:
        logger.info(f"Searching for: {query}")
        with DDGS(timeout=10) as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            logger.info(f"Found {len(results)} results")
            return results
    except Exception as e:
        logger.error(f"Search error: {e}")
        return []

def format_search_results(results: List[dict]) -> str:
    """Format search results for the LLM"""
    if not results:
        return "No search results found."
    
    formatted = "Here are the relevant search results:\n\n"
    for i, result in enumerate(results, 1):
        formatted += f"{i}. **{result.get('title', 'No title')}**\n"
        formatted += f"   URL: {result.get('href', 'No URL')}\n"
        formatted += f"   {result.get('body', 'No description')}\n\n"
    return formatted

async def chat_with_ollama(messages: List[dict], model: str = MODEL_NAME) -> str:
    """Send chat request to Ollama"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": False
                }
            )
            response.raise_for_status()
            result = response.json()
            return result["message"]["content"]
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with Ollama: {str(e)}")

def is_datetime_query(query: str) -> bool:
    """Check if query is asking for current date or time"""
    datetime_keywords = [
        "what is the date", "what's the date", "date today", "today's date",
        "what is today", "what's today", "current date", "todays date",
        "what day is it", "what day is today", "what is the time",
        "what's the time", "current time", "time now", "what time is it"
    ]
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in datetime_keywords)

def get_current_datetime_info() -> str:
    """Get current date and time information"""
    try:
        # Get current UTC time
        utc_now = datetime.now(pytz.UTC)
        
        # Common timezones
        timezones = {
            'UTC': pytz.UTC,
            'US/Eastern': pytz.timezone('US/Eastern'),
            'US/Pacific': pytz.timezone('US/Pacific'),
            'Europe/London': pytz.timezone('Europe/London'),
            'Asia/Tokyo': pytz.timezone('Asia/Tokyo'),
            'Asia/Kolkata': pytz.timezone('Asia/Kolkata'),
        }
        
        info = f"**Current Date and Time Information:**\n\n"
        info += f"📅 **Date**: {utc_now.strftime('%A, %B %d, %Y')}\n"
        info += f"🕐 **UTC Time**: {utc_now.strftime('%I:%M:%S %p')}\n\n"
        info += "**Times in Major Timezones:**\n"
        
        for tz_name, tz in timezones.items():
            local_time = utc_now.astimezone(tz)
            info += f"- **{tz_name}**: {local_time.strftime('%I:%M %p, %B %d, %Y')}\n"
        
        return info
    except Exception as e:
        logger.error(f"Error getting datetime: {e}")
        return f"Current date: {datetime.now().strftime('%A, %B %d, %Y')}"

def should_search(query: str) -> bool:
    """Determine if the query requires web search"""
    # Don't search for date/time queries - use system date instead
    if is_datetime_query(query):
        return False
    
    # Keywords that typically require current information from web
    search_keywords = [
        "news", "latest", "recent", "breaking", "update",
        "weather", "forecast", "temperature",
        "price", "cost", "how much", "worth",
        "who is", "who won", "who played", "who are",
        "how to", "tutorial", "guide", "instructions", "learn",
        "what happened", "events", "where can", "where to",
        "best", "top", "recommended", "review"
    ]
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in search_keywords)

def analyze_image_artifacts(image_array: np.ndarray) -> dict:
    """Analyze image for AI generation artifacts using statistical methods"""
    try:
        features = {}
        
        # Color distribution analysis
        features['color_std'] = float(np.std(image_array))
        features['color_mean'] = float(np.mean(image_array))
        
        # Convert to grayscale for edge analysis
        if len(image_array.shape) == 3:
            gray = np.mean(image_array, axis=2)
        else:
            gray = image_array
        
        # Edge detection using simple gradient
        edges_x = np.abs(np.diff(gray, axis=1))
        edges_y = np.abs(np.diff(gray, axis=0))
        features['edge_variance'] = float(np.var(edges_x) + np.var(edges_y))
        
        # Texture smoothness
        features['texture_smoothness'] = float(np.std(gray))
        
        return features
    except Exception as e:
        logger.error(f"Error analyzing artifacts: {e}")
        return {}

def detect_ai_image_sync(image_bytes: bytes) -> dict:
    """Detect if an image is AI-generated using statistical analysis"""
    try:
        # Load and process image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Analyze artifacts
        features = analyze_image_artifacts(img_array)
        
        # Calculate AI likelihood score based on improved heuristics
        confidence = 0.0
        reasons = []
        
        if features:
            edge_var = features.get('edge_variance', 0)
            texture_smooth = features.get('texture_smoothness', 0)
            color_std = features.get('color_std', 0)
            color_mean = features.get('color_mean', 0)
            
            # AI images tend to have specific edge characteristics
            if edge_var < 100:
                ai_score = 0.35 * (1 - edge_var / 100)
                confidence += ai_score
                reasons.append(f"Smooth edge patterns (variance: {edge_var:.2f})")
            
            # AI images have very consistent texture
            if 25 < texture_smooth < 50:
                confidence += 0.25
                reasons.append(f"Uniform texture distribution (smoothness: {texture_smooth:.2f})")
            elif texture_smooth < 25:
                confidence += 0.35
                reasons.append(f"Overly smooth texture (smoothness: {texture_smooth:.2f})")
            
            # Check color distribution - AI often has "too perfect" colors
            if 30 < color_std < 55:
                confidence += 0.20
                reasons.append(f"Artificial color balance (std: {color_std:.2f})")
            
            # Very high color saturation can indicate AI
            if color_mean > 130:
                confidence += 0.15
                reasons.append(f"High color saturation (mean: {color_mean:.2f})")
            
            # Perfect symmetry indicator (simplified check)
            if edge_var < 80 and texture_smooth < 35:
                confidence += 0.15
                reasons.append("High symmetry and uniformity")
        
        is_ai = confidence > 0.45
        
        return {
            "is_ai_generated": is_ai,
            "confidence": min(confidence, 0.85),
            "image_size": list(image.size),
            "image_format": str(image.format) if image.format else "Unknown",
            "analysis": features,
            "details": {
                "method": "Statistical artifact analysis",
                "reasons": reasons if reasons else ["No AI artifacts detected"],
                "note": "This is a heuristic-based analysis. Results may vary."
            }
        }
        
    except Exception as e:
        logger.error(f"Error detecting AI image: {e}")
        return {
            "is_ai_generated": False,
            "confidence": 0.0,
            "image_size": [0, 0],
            "image_format": None,
            "analysis": {},
            "details": {"error": str(e)},
            "error": str(e)
        }

async def detect_ai_image(image_bytes: bytes) -> dict:
    """Async wrapper for AI image detection"""
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(executor, detect_ai_image_sync, image_bytes)
    return result

@app.get("/")
async def root():
    return {"message": "Freelexity AI Search Assistant API", "status": "running"}

@app.get("/health")
async def health_check():
    """Check if Ollama is running"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            response.raise_for_status()
            return {"status": "healthy", "ollama": "connected"}
    except:
        return {"status": "unhealthy", "ollama": "disconnected"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat requests with optional web search"""
    try:
        search_results = None
        used_search = False
        enhanced_message = request.message
        
        # Check if this is a date/time query
        if is_datetime_query(request.message):
            logger.info(f"Date/time query detected: {request.message}")
            datetime_info = get_current_datetime_info()
            enhanced_message = f"""User question: {request.message}

{datetime_info}

Please provide a clear answer using the date and time information above."""
            # Mark as "searched" for UI purposes
            used_search = True
        # Determine if we should search the web
        elif request.use_search and should_search(request.message):
            logger.info(f"Web search triggered for: {request.message}")
            # Perform web search in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            raw_results = await loop.run_in_executor(
                executor, 
                search_web, 
                request.message, 
                5
            )
            
            if raw_results:
                used_search = True
                logger.info(f"Search returned {len(raw_results)} results")
                search_results = [
                    SearchResult(
                        title=r.get('title', 'No title'),
                        url=r.get('href', ''),
                        snippet=r.get('body', '')
                    )
                    for r in raw_results
                ]
                
                # Create enhanced prompt with search results
                search_context = format_search_results(raw_results)
                enhanced_message = f"""User question: {request.message}

{search_context}

Please provide a comprehensive answer based on the search results above. Cite sources when relevant."""
            else:
                logger.warning("No search results found")
                enhanced_message = request.message
        else:
            logger.info(f"No search needed for: {request.message}")
            enhanced_message = request.message
        
        # Prepare messages for Ollama
        messages = []
        
        # Add system message
        system_message = {
            "role": "system",
            "content": "You are Freelexity, a helpful AI assistant with web search capabilities. When search results are provided, use them to give accurate, up-to-date answers. Always be concise and helpful."
        }
        messages.append(system_message)
        
        # Add conversation history
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current message
        messages.append({"role": "user", "content": enhanced_message})
        
        # Get response from Ollama
        response = await chat_with_ollama(messages)
        
        return ChatResponse(
            response=response,
            search_results=search_results,
            used_search=used_search
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")

@app.post("/detect-ai-image", response_model=AIImageDetectionResponse)
async def detect_ai_image_endpoint(file: UploadFile = File(...)):
    """Detect if an uploaded image is AI-generated"""
    try:
        logger.info(f"Received image upload: {file.filename}, type: {file.content_type}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        logger.info(f"Image size: {len(image_bytes)} bytes")
        
        # Check file size (max 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
        
        # Perform AI detection
        logger.info("Starting AI detection...")
        result = await detect_ai_image(image_bytes)
        logger.info(f"Detection result: {result}")
        
        return AIImageDetectionResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in AI image detection endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
