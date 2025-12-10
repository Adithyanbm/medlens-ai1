import { useState, useRef, useEffect } from 'react';
import { healthAssistantChat, ChatMessage } from '../../services/ollamaApi';
import {
    MessageSquare,
    X,
    Send,
    Loader2,
    Bot,
    User,
    Sparkles,
    Minimize2,
    Maximize2
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm MedLens AI, your health assistant. I can help you with:\n\n• Understanding your medications\n• Side effects information\n• Dosage guidance\n• Drug interaction questions\n\nHow can I assist you today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Convert messages to API format
            const conversationHistory: ChatMessage[] = messages.map(m => ({
                role: m.role,
                content: m.content,
            }));

            const response = await healthAssistantChat(userMessage.content, conversationHistory);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again later.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white group z-50"
            >
                <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 rounded-full flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75" />
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'
            }`}>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">MedLens AI</h3>
                            <p className="text-xs text-white/70 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Powered by Qwen3-VL
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isMinimized ? (
                                <Maximize2 className="w-4 h-4 text-white" />
                            ) : (
                                <Minimize2 className="w-4 h-4 text-white" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                        ? 'bg-primary-100 text-primary-600'
                                        : 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                                        }`}>
                                        {message.role === 'user' ? (
                                            <User className="w-4 h-4" />
                                        ) : (
                                            <Bot className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-sm'
                                        : 'bg-white shadow-sm border border-gray-100 rounded-tl-sm'
                                        }`}>
                                        <p className={`text-sm whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-gray-700'
                                            }`}>
                                            {message.content}
                                        </p>
                                        <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                                            <span className="text-sm text-gray-500">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about your medications..."
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                AI can make mistakes. Always consult a healthcare professional.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIChatbot;
