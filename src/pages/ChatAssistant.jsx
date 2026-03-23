import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles, Loader2, Trash2, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTranslation, getLangForAI } from '../utils/i18n';

export default function ChatAssistant() {
  const t = getTranslation;
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('farmbuddy_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Save messages
  useEffect(() => {
    localStorage.setItem('farmbuddy_chat', JSON.stringify(messages.slice(-50)));
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const langMap = {
        'English': 'en-IN',
        'हिन्दी (Hindi)': 'hi-IN',
        'বাংলা (Bengali)': 'bn-IN',
        'తెలుగు (Telugu)': 'te-IN',
        'मराठी (Marathi)': 'mr-IN',
        'தமிழ் (Tamil)': 'ta-IN',
        'ગુજરાતી (Gujarati)': 'gu-IN',
        'ಕನ್ನಡ (Kannada)': 'kn-IN',
        'ଓଡ଼ିଆ (Odia)': 'or-IN',
        'മലയാളം (Malayalam)': 'ml-IN',
        'ਪੰਜਾਬੀ (Punjabi)': 'pa-IN',
        'অসমীয়া (Assamese)': 'as-IN',
        'اردو (Urdu)': 'ur-IN',
        'नेपाली (Nepali)': 'ne-NP',
      };
      recognition.lang = langMap[localStorage.getItem('SMART_AG_LANG') || 'English'] || 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) { alert('Voice input not supported in this browser.'); return; }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const buildSystemContext = () => {
    const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    const milkLog = JSON.parse(localStorage.getItem('farmbuddy_milk_yield') || '[]');
    const weightLog = JSON.parse(localStorage.getItem('farmbuddy_weight_log') || '[]');
    const cropYieldLog = JSON.parse(localStorage.getItem('farmbuddy_crop_yield') || '[]');
    const growthLog = JSON.parse(localStorage.getItem('farmbuddy_growth_log') || '[]');
    const username = localStorage.getItem('SMART_AG_USER') || 'Farmer';
    const userLang = getLangForAI(localStorage.getItem('SMART_AG_LANG') || 'English');

    const recentScans = scans.slice(0, 10).map(s =>
      `- ${s.identity} (${s.type}): ${s.diagnosis}, Severity: ${s.severity}, Health: ${s.healthPercentage}%`
    ).join('\n');
    const recentMilk = milkLog.slice(0, 5).map(m => `${m.date}: ${m.value}L (${m.animal})`).join(', ');
    const recentWeight = weightLog.slice(0, 5).map(w => `${w.date}: ${w.value}kg (${w.animal})`).join(', ');
    const recentCropYield = cropYieldLog.slice(0, 5).map(c => `${c.date}: ${c.value}kg (${c.crop})`).join(', ');
    const recentGrowth = growthLog.slice(0, 5).map(g => `${g.date}: ${g.value}cm (${g.crop})`).join(', ');

    return `You are FarmBuddy AI Assistant, an expert agricultural and veterinary advisor. You help farmers with crop diseases, livestock health, farming practices, market insights, and general agriculture queries.

FARMER PROFILE:
- Name: ${username}
- Language: ${userLang}

FARMER'S RECENT SCAN DATA:
${recentScans || 'No scans yet'}

FARM DATA LOGS:
- Milk yield: ${recentMilk || 'No data'}
- Weight log: ${recentWeight || 'No data'}
- Crop yield: ${recentCropYield || 'No data'}
- Growth log: ${recentGrowth || 'No data'}

INSTRUCTIONS:
- Always respond in ${userLang}
- Be concise but thorough (max 200 words per response)
- Reference the farmer's actual data when relevant
- Provide practical, actionable advice
- Use emojis occasionally for friendliness
- If asked about something outside farming/agriculture, politely redirect to farming topics`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }

    const userMsg = { role: 'user', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemContext = buildSystemContext();

      // Build conversation history for context
      const chatHistory = messages.slice(-8).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');

      const prompt = `${systemContext}

CONVERSATION HISTORY:
${chatHistory}

User: ${userMsg.text}

Respond helpfully:`;

      const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      let responseText = '';
      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          responseText = res.response.text();
          break;
        } catch (e) { console.warn(`${modelName} failed`, e); }
      }

      const aiMsg = { role: 'ai', text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg = { role: 'ai', text: 'Sorry, I encountered an error. Please check your API key and try again.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('farmbuddy_chat');
  };

  const quickQuestions = [
    "What crops should I plant this season?",
    "My cow's milk yield is dropping. Why?",
    "How to prevent leaf curl in tomatoes?",
    "Best organic fertilizers for rice?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <header className="mb-4 mt-2 flex justify-between items-start">
        <div>
          <h2 className="text-charcoal dark:text-white font-black text-2xl tracking-tighter">{t("Ask FarmBuddy")}</h2>
          <p className="text-sage font-semibold text-xs mt-1">{t("AI-powered farming assistant")}</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-coralRed p-2 rounded-xl hover:bg-coralRed/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll space-y-3 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-teal/10 rounded-3xl flex items-center justify-center mb-6 border border-teal/20">
              <Bot className="w-10 h-10 text-teal" />
            </div>
            <h3 className="text-charcoal dark:text-white font-black text-lg mb-2">Hi! I'm FarmBuddy AI 🌱</h3>
            <p className="text-sage text-xs font-semibold mb-8">Ask me anything about farming, crops, livestock, or your scanned data!</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }} className="bg-white dark:bg-charcoal/60 border border-sage/20 dark:border-white/10 rounded-xl px-4 py-3 text-left text-xs font-bold text-charcoal dark:text-white/80 active:scale-[0.98] transition-all shadow-sm">
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 bg-teal/10 rounded-xl flex items-center justify-center shrink-0 border border-teal/20 mt-1">
                  <Sparkles className="w-4 h-4 text-teal" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-charcoal text-white rounded-br-md'
                  : 'bg-white dark:bg-charcoal/60 text-charcoal dark:text-white/90 border border-sage/10 dark:border-white/10 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-[13px] font-semibold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[9px] mt-1 font-bold ${msg.role === 'user' ? 'text-white/40' : 'text-sage'}`}>{msg.time}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-charcoal rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 bg-teal/10 rounded-xl flex items-center justify-center shrink-0 border border-teal/20">
              <Sparkles className="w-4 h-4 text-teal" />
            </div>
            <div className="bg-white dark:bg-charcoal/60 rounded-2xl rounded-bl-md px-4 py-3 border border-sage/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-teal animate-spin" />
                <p className="text-sage text-xs font-bold">Thinking...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-charcoal/80 rounded-2xl border border-sage/20 dark:border-white/10 shadow-lg p-2 flex items-center gap-2 mb-2">
        <button 
          onClick={toggleVoice} 
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isListening ? 'bg-coralRed text-white animate-pulse' : 'bg-offWhite dark:bg-white/10 text-sage'}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("Ask me anything about farming...")}
          className="flex-1 bg-transparent text-sm font-semibold text-charcoal dark:text-white placeholder-sage/50 outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform disabled:opacity-40"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
