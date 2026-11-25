import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Trash2,
  Loader2,
  MessageCircleQuestion,
} from 'lucide-react';
import { StudyMedium, UserAccount } from '../types/education';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface StudentAiChatbotProps {
  user: UserAccount | null;
  medium: StudyMedium;
  purchasedSubjects: string[];
}

export const StudentAiChatbot: React.FC<StudentAiChatbotProps> = ({
  user,
  medium,
  purchasedSubjects,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text:
        medium === 'hi'
          ? `Namaste ${user?.name || 'Student'}! Main Setu hoon — aapka fast AI Doubt Solver. Class 9–12, UPSC/SSC ya kisi bhi subject ka sawal poochein, turant jawab milega!`
          : `Hello ${user?.name || 'Student'}! I am Setu — your fast AI Doubt Solver. Ask me any question from Class 9–12, UPSC/SSC, or Python/AI!`,
      timestamp: 'Now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts =
    medium === 'hi'
      ? [
          'Raoult’s Law kya hai? Samjhao',
          'd/dx sin(3x + 5) solve karo',
          'Gauss’s Law in Hindi',
          'Board Exam 95% Study Plan',
        ]
      : [
          'Explain Raoult’s Law simply',
          'Solve d/dx sin(3x + 5)',
          'Explain Gauss’s Law',
          'Class 12 Board Exam Tips',
        ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: nowTime,
    };

    const botMsgId = `m-${Date.now() + 1}`;
    const nextMessages = [...messages, userMsg];
    setMessages([
      ...nextMessages,
      {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: nowTime,
      },
    ]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/student-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          medium,
          studentContext: {
            name: user?.name,
            targetExam: user?.targetExam,
            purchasedSubjects,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not get response from Setu');
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.chunk) {
                accumulated += parsed.chunk;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId ? { ...m, text: accumulated } : m
                  )
                );
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
                throw parseErr;
              }
            }
          }
        }

        if (!accumulated) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text:
                      medium === 'hi'
                        ? 'Maaf kijiye, kripya apna sawal dobara poochein.'
                        : 'Sorry, please ask your question again.',
                  }
                : m
            )
          );
        }
      } else {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: data.reply || '' } : m
          )
        );
      }
    } catch (err: unknown) {
      const errText =
        err instanceof Error
          ? err.message
          : medium === 'hi'
          ? 'Network error. Kripya dobara koshish karein.'
          : 'Network error. Please try again.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, text: `⚠️ ${errText}` } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text:
          medium === 'hi'
            ? 'Nayi chat shuru ho gayi hai! Main Setu hoon — apna agla doubt poochein.'
            : 'Chat cleared! I am Setu — ask your next study doubt.',
        timestamp: 'Now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Setu AI Chatbot Icon Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Setu AI Doubt Solver"
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white shadow-xl border border-emerald-400/40 transition-all cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-bold tracking-wide pr-0.5">
            Setu AI
          </span>
        </button>
      )}

      {/* Setu AI Chatbot Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 md:bottom-6 z-50 sm:w-[400px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[78vh]"
          role="dialog"
          aria-label="Setu AI Student Doubt Chatbot"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold">Setu</h3>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded">
                    AI Tutor
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-300">
                  {medium === 'hi'
                    ? 'Fast Doubt Solver • Hindi & English'
                    : 'Fast 24x7 Doubt Solver'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Setu AI Chatbot"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Doubt Prompts */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                onClick={() => handleSend(qp)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-[11px] font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text || (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
                        <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span>
                          {medium === 'hi' ? 'Setu likh raha hai...' : 'Setu is typing...'}
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                medium === 'hi'
                  ? 'Setu se apna sawal ya doubt poochein...'
                  : 'Ask Setu your question or doubt...'
              }
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message to Setu"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
