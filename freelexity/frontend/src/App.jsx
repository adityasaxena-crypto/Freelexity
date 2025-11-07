import { useState, useRef, useEffect } from 'react'
import { Search, Loader2, Sparkles, ExternalLink, Clock } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = '/api'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useSearch, setUseSearch] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    checkHealth()
    inputRef.current?.focus()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      if (response.data.ollama === 'connected') {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      setConnectionStatus('error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMessage,
        history: messages.slice(-10),
        use_search: useSearch
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        searchResults: response.data.search_results,
        usedSearch: response.data.used_search
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'error',
        content: `Error: ${error.response?.data?.detail || error.message || 'Failed to get response'}`,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const newChat = () => {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimal Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-md) var(--space-lg)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-bg-primary)',
        backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '880px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Sparkles size={20} style={{ color: 'var(--color-accent-primary)' }} />
            <h1 className="text-gradient" style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              margin: 0
            }}>
              Freelexity
            </h1>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={newChat}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-hover)'
                e.target.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-tertiary)'
                e.target.style.color = 'var(--color-text-secondary)'
              }}
            >
              New Chat
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        maxWidth: '880px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-lg)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Empty State - Hero Search */}
        {messages.length === 0 && !isLoading && (
          <div className="animate-fade-in" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-3xl) 0',
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
              <h2 className="text-gradient" style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                marginBottom: 'var(--space-md)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                What can I help you discover?
              </h2>
              <p style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                Search powered by AI with real-time web results
              </p>
            </div>

            <div style={{ width: '100%' }}>
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-base)'
              }}>
                <Search size={20} style={{
                  color: 'var(--color-text-tertiary)',
                  flexShrink: 0
                }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 'var(--line-height-normal)'
                  }}
                  disabled={isLoading}
                />
                {input.trim() && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      padding: 'var(--space-sm) var(--space-lg)',
                      backgroundColor: 'var(--color-accent-primary)',
                      color: 'var(--color-bg-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-accent-secondary)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-accent-primary)'}
                  >
                    Search
                  </button>
                )}
              </form>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginTop: 'var(--space-md)',
                padding: '0 var(--space-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-tertiary)'
              }}>
                <input
                  type="checkbox"
                  id="searchToggle"
                  checked={useSearch}
                  onChange={(e) => setUseSearch(e.target.checked)}
                  style={{
                    accentColor: 'var(--color-accent-primary)'
                  }}
                />
                <label htmlFor="searchToggle" style={{ cursor: 'pointer' }}>
                  Web search enabled
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Messages Thread */}
        {messages.length > 0 && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-xl) 0'
          }}>
            {messages.map((message, index) => (
              <div key={index} className="animate-fade-in" style={{
                marginBottom: 'var(--space-3xl)'
              }}>
                {/* User Query */}
                {message.role === 'user' && (
                  <div style={{
                    padding: 'var(--space-lg) 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}>
                    <div style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}>
                      {message.content}
                    </div>
                  </div>
                )}

                {/* AI Answer */}
                {message.role === 'assistant' && (
                  <div style={{ paddingTop: 'var(--space-lg)' }}>
                    {message.usedSearch && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        padding: 'var(--space-xs) var(--space-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-accent-primary)',
                        marginBottom: 'var(--space-lg)',
                        fontWeight: 500
                      }}>
                        <Search size={12} />
                        Searched the web
                      </div>
                    )}

                    {/* Answer Text */}
                    <div style={{
                      fontSize: 'var(--text-base)',
                      lineHeight: 'var(--line-height-relaxed)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-lg)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.content}
                    </div>

                    {/* Source Cards */}
                    {message.searchResults && message.searchResults.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                          marginBottom: 'var(--space-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)'
                        }}>
                          <ExternalLink size={14} />
                          Sources
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: 'var(--space-md)'
                        }}>
                          {message.searchResults.slice(0, 3).map((result, idx) => (
                            <a
                              key={idx}
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'block',
                                padding: 'var(--space-md)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                transition: 'all var(--transition-fast)',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'
                                e.currentTarget.style.borderColor = 'var(--color-border-hover)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                              }}
                            >
                              <div style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--space-xs)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {result.title}
                              </div>
                              <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-tertiary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {new URL(result.url).hostname}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      marginTop: 'var(--space-lg)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-tertiary)'
                    }}>
                      <Clock size={12} />
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {message.role === 'error' && (
                  <div style={{
                    padding: 'var(--space-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-error)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-error)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    {message.content}
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="animate-fade-in" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-lg)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-base)'
              }}>
                <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-accent-primary)' }} />
                Searching and analyzing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Search Input - When there are messages */}
        {messages.length > 0 && (
          <div style={{
            position: 'sticky',
            bottom: 0,
            paddingTop: 'var(--space-lg)',
            paddingBottom: 'var(--space-xl)',
            backgroundColor: 'var(--color-bg-primary)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--transition-base)'
            }}>
              <Search size={20} style={{
                color: 'var(--color-text-tertiary)',
                flexShrink: 0
              }} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--line-height-normal)'
                }}
                disabled={isLoading}
              />
              {input.trim() && (
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: 'var(--space-sm) var(--space-lg)',
                    backgroundColor: 'var(--color-accent-primary)',
                    color: 'var(--color-bg-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-accent-secondary)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-accent-primary)'}
                >
                  Search
                </button>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
