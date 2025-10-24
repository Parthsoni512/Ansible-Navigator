
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { answerQuery } from '../services/geminiService';
import { BrainCircuitIcon, SendIcon, UserIcon, BotIcon } from './icons';

const ThinkingModeToggle: React.FC<{ isEnabled: boolean; onChange: (enabled: boolean) => void }> = ({ isEnabled, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <BrainCircuitIcon className={`w-6 h-6 transition-colors duration-300 ${isEnabled ? 'text-sky-400' : 'text-slate-500'}`} />
      <span className={`text-sm font-medium ${isEnabled ? 'text-slate-200' : 'text-slate-400'}`}>Thinking Mode</span>
      <button
        onClick={() => onChange(!isEnabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${isEnabled ? 'bg-sky-500' : 'bg-slate-600'}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex items-start space-x-3 my-4 ${isModel ? '' : 'justify-end'}`}>
            {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon className="w-5 h-5 text-sky-400" /></div>}
            <div className={`p-3 rounded-lg max-w-sm md:max-w-md ${isModel ? 'bg-slate-700' : 'bg-red-600 text-white'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }}></p>
            </div>
            {!isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-300" /></div>}
        </div>
    );
};


const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hello! Ask me anything about Ansible." }
  ]);
  const [input, setInput] = useState('');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelResponseText = await answerQuery(input, messages, thinkingMode);
    
    const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: modelResponseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="w-full md:w-96 bg-slate-900/70 backdrop-blur-sm border-l border-slate-700/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex justify-center">
        <ThinkingModeToggle isEnabled={thinkingMode} onChange={setThinkingMode} />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        {isLoading && (
            <div className="flex items-start space-x-3 my-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon className="w-5 h-5 text-sky-400" /></div>
                <div className="p-3 rounded-lg bg-slate-700 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-200"></span>
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-400"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700/50">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={thinkingMode ? "Ask a complex question..." : "Ask a question..."}
            className="w-full bg-slate-700/50 rounded-lg p-3 pr-12 text-sm text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-red-600 hover:bg-red-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SendIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatPanel;
