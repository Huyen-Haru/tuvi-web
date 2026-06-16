'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { TOPIC_PROMPTS, buildPalacePrompt } from '@/lib/ziwei/prompts';

interface Msg { role: 'user' | 'assistant'; content: string; hidden?: boolean; }

interface Props {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
}

const TABS = [
  { key: 'overview', label: 'Tổng Quan' },
  { key: 'daxian',   label: 'Đại Hạn' },
  { key: 'luunien',  label: 'Lưu Niên' },
  { key: 'love',     label: 'Tình Duyên' },
  { key: 'career',   label: 'Sự Nghiệp' },
  { key: 'wealth',   label: 'Tài Lộc' },
  { key: 'health',   label: 'Sức Khỏe' },
] as const;

function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        const section = line.match(/^\*\*【(.+?)】\*\*$/);
        if (section) {
          return (
            <div key={i} style={{ paddingTop: i === 0 ? 0 : 16, paddingBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em' }}>
                【{section[1]}】
              </span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
            {parts.map((p, j) =>
              j % 2 === 0
                ? p
                : <strong key={j} style={{ color: 'var(--text)', fontWeight: 600 }}>{p}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span style={{ display: 'inline-block', width: 6, height: 14, background: 'var(--gold)', opacity: 0.6, borderRadius: 2, marginLeft: 2, animation: 'ldot 1s infinite' }} />
      )}
    </div>
  );
}

export default function AnalysisPanel({ chart, selectedPalace }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const messagesRef = useRef<Msg[]>([]);
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const streamResponse = useCallback(async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (!res.ok || !res.body) throw new Error('API error');

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const d = line.slice(6);
          if (d === '[DONE]') break;
          try {
            text += JSON.parse(d).text ?? '';
            setMessages(prev => {
              const u = [...prev];
              u[u.length - 1] = { role: 'assistant', content: text };
              return u;
            });
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lỗi kết nối, vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [chart]);

  const sendMessage = useCallback((text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const userMsg: Msg = { role: 'user', content: text, hidden };
    const apiMsgs = [...messagesRef.current, userMsg].map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMsgs);
  }, [streamResponse]);

  // Auto-load overview on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, [sendMessage]);

  // Auto-analyze selected palace
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;
    sendMessage(buildPalacePrompt(selectedPalace), true);
  }, [selectedPalace, sendMessage]);

  const handleTabClick = (key: string) => {
    if (loadingRef.current) return;
    setActiveTab(key);
    sendMessage(TOPIC_PROMPTS[key as keyof typeof TOPIC_PROMPTS], true);
  };

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: '6px 10px',
    fontSize: 10,
    fontWeight: activeTab === key ? 600 : 400,
    borderRadius: 6,
    cursor: loading ? 'not-allowed' : 'pointer',
    border: `1px solid ${activeTab === key ? 'rgba(212,168,67,0.35)' : 'var(--border)'}`,
    background: activeTab === key ? 'rgba(212,168,67,0.1)' : 'transparent',
    color: activeTab === key ? 'var(--gold)' : 'var(--faint)',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Tabs */}
      <div style={{
        padding: '10px 12px 8px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => handleTabClick(t.key)} disabled={loading} style={tabStyle(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ fontSize: 28, color: 'var(--gold)', opacity: 0.1, marginBottom: 8 }}>✦</div>
            <p style={{ fontSize: 11, color: 'var(--faint)', animation: 'ldot 1.5s infinite' }}>
              Đang luận giải mệnh cách…
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user' && msg.hidden) return null;
          if (msg.role === 'user') {
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '85%',
                  background: 'rgba(212,168,67,0.07)',
                  border: '1px solid rgba(212,168,67,0.15)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: 'var(--gold)',
                }}>
                  {msg.content}
                </div>
              </div>
            );
          }
          const isLast = i === messages.length - 1;
          return (
            <div key={i}>
              <div style={{ fontSize: 9, color: 'var(--faint)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--gold)', opacity: 0.3 }}>✦</span>
                Luận giải mệnh lý
              </div>
              <AiContent text={msg.content} streaming={loading && isLast} />
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Hỏi thêm, ví dụ: Năm nay có nên đầu tư không?"
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              padding: '8px 12px',
              fontSize: 12,
              outline: 'none',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'rgba(212,168,67,0.12)',
              border: '1px solid var(--border2)',
              color: 'var(--gold)',
            }}
          >
            {loading ? '…' : 'Hỏi'}
          </button>
        </div>
      </div>

    </div>
  );
}
