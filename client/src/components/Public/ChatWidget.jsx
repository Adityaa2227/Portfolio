import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import api from '../../api/axios';
import { getIds } from '../../lib/analytics';
import { renderMarkdown } from '../../lib/markdown';

const SUGGESTIONS = [
  'What did Aditya do at PayPal?',
  'Which project best shows his backend skills?',
  'Is he open to full-time roles?',
  'What is his tech stack?',
];

const WELCOME = {
  role: 'assistant',
  content: 'Hi! I can answer questions about Aditya’s experience, projects and skills. What would you like to know?',
};

/** "Ask my portfolio" chat: answers come from Aditya's resume and projects (backend /chat). */
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef(null);
  const field = useRef(null);
  const launcher = useRef(null);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); launcher.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (question) => {
    const q = question.trim();
    if (!q || busy) return;
    const history = messages.filter((m) => m !== WELCOME && !m.error).slice(-6).map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setInput('');
    setBusy(true);
    try {
      let ids = {};
      try { const { visitorId, sessionId } = getIds(); ids = { visitorId, sessionId }; } catch { /* ignore */ }
      const { data } = await api.post('/chat', { question: q, history, ...ids }, { timeout: 45000 });
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Sorry, I couldn’t answer right now. Please try again, or use the contact form.';
      setMessages((m) => [...m, { role: 'assistant', content: msg, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          ref={launcher}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-8px_rgb(var(--c-accent))] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
          aria-label="Ask about Aditya (AI chat)"
        >
          <MessageCircle size={18} aria-hidden /> <span className="hidden sm:inline">Ask about Aditya</span>
        </button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Ask about Aditya"
          className="fixed inset-x-3 bottom-3 z-[60] flex max-h-[min(640px,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_30px_90px_-20px_rgb(0_0_0/0.8)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
        >
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent-dark"><Sparkles size={17} aria-hidden /></span>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Ask about Aditya</h2>
              <p className="text-[11px] text-text-subtle">AI answers from his resume and projects</p>
            </div>
            <button type="button" onClick={() => { setOpen(false); launcher.current?.focus(); }} aria-label="Close chat" className="rounded-lg p-1.5 text-text-muted hover:bg-accent/15 hover:text-foreground">
              <X size={17} aria-hidden />
            </button>
          </header>

          <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#7C3AED] px-3.5 py-2 text-sm text-white">{m.content}</p>
                ) : (
                  <div
                    className={`chat-answer max-w-[90%] rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-relaxed ${m.error ? 'border border-red-400/40 bg-red-500/10 text-red-200' : 'bg-background/70 text-text-muted'}`}
                    // Answers can contain **bold** and lists; rendered and sanitised.
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                  />
                )}
              </div>
            ))}
            {busy && (
              <p className="flex items-center gap-2 text-xs text-text-subtle" role="status"><Loader2 size={14} className="animate-spin" aria-hidden /> Thinking…</p>
            )}
            {messages.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-text-muted transition-colors hover:border-accent hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-end gap-2 border-t border-border p-3">
            <label className="flex-1">
              <span className="sr-only">Your question</span>
              <textarea
                ref={field}
                rows={1}
                maxLength={500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
                placeholder="Ask about skills, projects, availability…"
                className="max-h-28 w-full resize-none rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-text-subtle"
              />
            </label>
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send question" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-white disabled:opacity-50">
              <Send size={16} aria-hidden />
            </button>
          </form>
          <p className="px-4 pb-2 text-center text-[10px] text-text-subtle">AI can make mistakes. For anything important, use the contact form.</p>
        </section>
      )}
    </>
  );
};

export default ChatWidget;
