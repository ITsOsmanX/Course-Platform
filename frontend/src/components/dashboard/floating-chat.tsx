'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import type { ChatMessage, ChatRecommendedCourse } from '@/types';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Waypoint's AI assistant. Ask me about courses or what you'd like to learn, and I'll point you in the right direction.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: text });
      const { reply, recommendedCourses } = res.data;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, recommendedCourses },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 shadow-lg shadow-blue-900/40 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <MessageSquare size={22} className="text-white" />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Waypoint AI</p>
                  <p className="text-[10px] text-slate-400">Course Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      msg.role === 'user'
                        ? 'max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-sm text-white'
                        : 'max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-2.5 text-sm text-slate-200'
                    }
                  >
                    <p className="leading-relaxed">{msg.content}</p>

                    {/* Recommended courses */}
                    {msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-slate-400">Recommended courses:</p>
                        {msg.recommendedCourses.map((course) => (
                          <RecommendedCourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-slate-400" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/8 p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about courses..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-40"
                >
                  <Send size={13} />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-slate-600">
                Powered by Groq · Waypoint AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RecommendedCourseCard({ course }: { course: ChatRecommendedCourse }) {
  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="flex items-center gap-3 rounded-xl border border-white/8 bg-slate-700/60 p-2.5 transition hover:bg-slate-700"
    >
      <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-white">{course.title}</p>
        <p className="text-xs text-blue-400">${course.price}</p>
      </div>
    </Link>
  );
}
