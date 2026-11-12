import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Badge, Bubble, Button, Card, Input, InputGroup, Message, MessageScroller } from './ui';

const starters = {
  public: 'Hi! I can help with submitting, tracking, grievance status, and attachments. What would you like to know?',
  staff: 'I can check cases in your authorized queue. Ask about new assignments, active work, reports awaiting review, overdue cases, or a CMK reference.',
};

const suggestions = {
  public: ['How do I track a grievance?', 'What files can I attach?'],
  staff: ['How many new assignments?', 'Which reports await review?'],
};

function TypingText({ text, animate, onComplete }) {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (!animate) {
      setVisibleLength(text.length);
      return undefined;
    }
    if (!text.length) {
      onCompleteRef.current?.();
      return undefined;
    }
    let visible = 0;
    const timer = window.setInterval(() => {
      visible = Math.min(visible + 2, text.length);
      setVisibleLength(visible);
      if (visible >= text.length) {
        window.clearInterval(timer);
        onCompleteRef.current?.();
      }
    }, 22);
    return () => window.clearInterval(timer);
  }, [animate, text]);

  return <>{text.slice(0, visibleLength)}{animate && visibleLength < text.length && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-1 animate-pulse rounded-sm bg-primary/70 align-middle" />}</>;
}

function AssistantReply({ message, onComplete }) {
  const [finished, setFinished] = useState(!message.animate);
  return (
    <>
      <p><TypingText text={message.answer || ''} animate={Boolean(message.animate)} onComplete={() => { setFinished(true); onComplete?.(); }} /></p>
      {finished && message.items?.length > 0 && (
        <div className="mt-2 space-y-2">
          {message.items.map((item) => (
            <Link key={item._id} to={`/grievances/${item._id}`} className="block rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 hover:border-primary/40 hover:bg-primary/5">
              <span className="flex items-center justify-between gap-2"><span className="font-mono text-[11px] font-semibold text-primary">{item.referenceId}</span><Badge tone={item.status === 'Resolved' ? 'green' : item.status === 'Pending Review' ? 'blue' : 'amber'}>{item.status}</Badge></span>
              <span className="mt-1 block truncate text-xs font-medium">{item.subject}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">{[item.district, item.department, item.priority].filter(Boolean).join(' · ')}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border bg-background px-3.5 py-3 text-xs text-muted-foreground" role="status" aria-label="Assistant is typing">
      <span>Thinking</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 motion-reduce:animate-none" style={{ animationDelay: `${dot * 120}ms` }} />)}
      </span>
    </div>
  );
}

export default function AssistantWidget({ mode = 'public' }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', answer: starters[mode] }]);
  const scrollerRef = useRef(null);
  const apiPath = mode === 'staff' ? '/assistant/staff' : '/assistant/public';

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  async function ask(text = question) {
    const value = text.trim();
    if (!value || value.length > 200 || loading) return;
    setMessages((current) => [...current, { role: 'user', question: value }]);
    setQuestion('');
    setLoading(true);
    try {
      const response = await api.post(apiPath, { question: value });
      setMessages((current) => [...current, { role: 'assistant', ...response.data.data, animate: true }]);
    } catch (error) {
      const message = error.response?.data?.data?.[0]?.msg || error.response?.data?.message || 'I could not reach the assistant. Please try again.';
      setMessages((current) => [...current, { role: 'assistant', answer: message, animate: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-28 sm:right-6">
      {open && (
        <Card className="flex max-h-[min(620px,calc(100svh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden border-slate-200 p-0 shadow-2xl">
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Bot className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1"><p className="font-semibold">{mode === 'staff' ? 'Case assistant' : 'Portal help'}</p><p className="text-xs text-white/80">{mode === 'staff' ? 'Private to your work queue' : 'Grievance services only'}</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/15 hover:text-white" aria-label="Close assistant" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </div>

          <MessageScroller ref={scrollerRef} aria-label="Assistant conversation" className="bg-slate-50 p-3">
            {messages.map((message, index) => (
              <Message key={`${message.role}-${index}`} from={message.role}>
                <Bubble from={message.role}>
                  {message.role === 'user' ? <p>{message.question}</p> : <AssistantReply message={message} onComplete={() => scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })} />}
                </Bubble>
              </Message>
            ))}
            {loading && <Message from="assistant"><TypingIndicator /></Message>}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2">{suggestions[mode].map((item) => <Button key={item} type="button" variant="outline" size="sm" className="h-auto rounded-full px-3 py-1.5 text-left text-xs text-primary" onClick={() => ask(item)}>{item}</Button>)}</div>
            )}
          </MessageScroller>

          <form className="border-t bg-white p-3" onSubmit={(event) => { event.preventDefault(); ask(); }}>
            <InputGroup>
              <Input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={200} aria-label="Ask the assistant" placeholder={mode === 'staff' ? 'Ask about your cases…' : 'Ask a portal question…'} disabled={loading} />
              <Button type="submit" size="icon" aria-label="Send question" disabled={!question.trim() || question.length > 200 || loading}><Send className="h-4 w-4" /></Button>
            </InputGroup>
            <div className="mt-1.5 flex items-center justify-between gap-3"><p className="text-[10px] text-muted-foreground">{mode === 'staff' ? 'Answers use your authorized work queue only.' : 'I answer questions about grievance services only.'}</p><span className={`shrink-0 text-[10px] ${question.length >= 190 ? 'text-amber-700' : 'text-muted-foreground'}`}>{question.length}/200</span></div>
          </form>
        </Card>
      )}

      {!open && (
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => setOpen(true)} className="max-w-[210px] rounded-2xl rounded-br-sm border border-blue-100 bg-white px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl" aria-label="Open portal assistant">
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0 text-primary" />{mode === 'staff' ? 'Need a case update?' : 'Questions about the grievance portal?'}</span>
          </button>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-xl" aria-label="Open assistant" onClick={() => setOpen(true)}><Bot className="h-6 w-6" /></Button>
        </div>
      )}
    </div>
  );
}
