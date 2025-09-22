'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/gemini', { message: input });

      const botMessage: Message = { role: 'bot', text: res.data.response as string };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Error: Could not get response from Gemini.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="chat-container">
      <h1 className="chat-title">🤖 B.Voc Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.role === 'user' ? 'user' : 'bot'}`}
          >
            <div className="bubble">
              <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="input-area">
        <textarea
          rows={2}
          className="chat-input"
          placeholder="Ask me to generate some code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </main>
  );
}
