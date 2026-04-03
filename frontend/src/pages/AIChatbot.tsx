import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  Loader2,
  Trash2
} from 'lucide-react';

// ── Lightweight Markdown → HTML renderer ─────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    // Headers: ### text
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-sm mt-3 mb-1 text-gray-900">$1</h4>')
    .replace(/^## (.+)$/gm,  '<h3 class="font-bold text-base mt-3 mb-1 text-gray-900">$1</h3>')
    .replace(/^# (.+)$/gm,   '<h2 class="font-bold text-lg mt-3 mb-1 text-gray-900">$1</h2>')
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Italic: *text*
    .replace(/\*([^*\n]+?)\*/g, '<em class="italic">$1</em>')
    // Bullet points: * item or - item
    .replace(/^[\*\-] (.+)$/gm, '<li class="ml-4 flex gap-2 text-sm leading-relaxed"><span class="text-blue-500 mt-1 flex-shrink-0">•</span><span>$1</span></li>')
    // Wrap consecutive <li> in <ul>
    .replace(/((<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-2 space-y-1">$1</ul>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Double newline → paragraph break
    .replace(/\n\n/g, '</p><p class="mt-2">')
    // Single newline → br
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph
    .replace(/^/, '<p class="text-sm leading-relaxed">')
    .replace(/$/, '</p>');
}
// ─────────────────────────────────────────────────────────────────────────────


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Career Advisor. I can help you with career recommendations, college selection, scholarships, and job opportunities. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "I don't know what degree to choose — help me!",
    'Best career after 12th Science?',
    'Analyze my profile for career match',
    'Give me a career roadmap for Software Engineer',
    'Which careers have Low Risk in India?',
    'Best scholarships for low-income students',
    'What does a Data Scientist do daily?',
    'How to prepare for UPSC in 1 year?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load History from Local Storage AND Backend
  useEffect(() => {
    const loadHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // 1. Load Local Backup First (Instant)
      const localBackup = localStorage.getItem(`chat_history_${userId}`);
      let localMessages: Message[] = [];
      if (localBackup) {
        try {
          localMessages = JSON.parse(localBackup).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(prev => {
            // Combine initial bot message with local backup, avoiding duplicates
            const combined = [...prev, ...localMessages].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            return combined;
          });
        } catch (e) {
          console.error("Local backup parse error", e);
        }
      }

      // 2. Fetch from Backend (Sync)
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/history/${userId}`);
        if (res.ok) {
          const remoteHistory = await res.json();
          if (remoteHistory.length > 0) {
            const parsedRemote = remoteHistory.map((h: any) => ({
              id: h.id,
              text: h.text,
              sender: h.sender,
              timestamp: new Date(h.timestamp)
            }));

            setMessages(prev => {
              // Merge Local + Remote (Remote is source of truth, but Local might have unsent items)
              // Currently simple merge: unique by ID
              const combined = [...prev, ...parsedRemote].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
              // Update Local Backup with latest authenticated history
              localStorage.setItem(`chat_history_${userId}`, JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (e) {
        console.error("Failed to load backend history", e);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
    // Auto-backup to localStorage whenever messages change
    const userId = localStorage.getItem('userId');
    if (userId && messages.length > 1) { // Don't overwrite with just the welcome message
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userId = localStorage.getItem('userId');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    // Optimistic UI Update & Local Backup
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (userId) localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedMessages));

    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, userId })
      });

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't process that.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => {
        const newHistory = [...prev, botResponse];
        if (userId) localStorage.setItem(`chat_history_${userId}`, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the server. But don't worry, your chat is saved locally!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => {
        const newHistory = [...prev, errorResponse];
        if (userId) localStorage.setItem(`chat_history_${userId}`, JSON.stringify(newHistory));
        return newHistory;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    setInputText(question);
  };

  const handleClearChat = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (confirm("Are you sure you want to clear your chat history?")) {
      try {
        await fetch(`${API_BASE_URL}/api/chat/history/${userId}`, { method: 'DELETE' });
      } catch (e) {
        console.error("Failed to clear history on server", e);
      }
      // Always clear local
      localStorage.removeItem(`chat_history_${userId}`);
      setMessages([messages[0]]); // Keep welcome message
    }
  };

  /* Voice Input Logic */
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US'; // Default to English, can be changed
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Your browser doesn't support speech recognition. Try Chrome or Edge.");
    }
  };



  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">AI Career Advisor</h3>
              <p className="text-sm text-gray-600">
                Ask me anything about careers, colleges, scholarships, or jobs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleClearChat} title="Clear Chat History" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                AI Assistant
              </Badge>
            </div>
          </div>
        </Card>

        {/* Predefined Questions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedQuestion(question)}
              className="whitespace-nowrap"
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <Card className="h-[580px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'bot'
                  ? 'bg-gradient-to-r from-blue-500 to-green-500'
                  : 'bg-gray-200'
                  }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block rounded-2xl px-4 py-3 text-left ${
                    message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-900 max-w-full'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                  }`}>
                    {message.sender === 'bot' ? (
                      <div
                        className="prose prose-sm max-w-none text-gray-900 [&_strong]:text-gray-900 [&_h4]:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={`flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                onClick={startListening}
                title="Use Voice Input"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? "Listening..." : "Type your question here..."}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="gradient-primary text-white flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
