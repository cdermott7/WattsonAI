import React, { useState, useEffect, useRef } from 'react';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { MessageSquare, Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { useData } from '../context/DataContext';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Elementary, my dear colleague! I'm Wattson, your AI operations assistant. How may I assist with your mining operations today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState({
    prices: [],
    inventory: null,
    profitability: null
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const { apiKey, siteName } = useData();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, inventory] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        const profitability = calculateProfitability(inventory, prices);
        setData({ prices, inventory, profitability });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputText('');

    // Prepare messages for Claude API
    const messagesForAPI = [...messages, userMessage].map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForAPI, apiKey, siteName })
      });
      const result = await response.json();
      const aiContent = result.success ? result.completion : `Error: ${result.error}`;
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-orange-400" />
          <span className="font-semibold text-white">Wattson AI</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-100'
            }`}>
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && (
                  <Bot className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-orange-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Wattson about your operations..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleVoiceInput}
            className={`px-3 py-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-orange-400 mt-2 animate-pulse">
            Listening... Speak now
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;