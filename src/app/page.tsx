'use client';

import { useState } from 'react';
import axios from 'axios';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/gemini', { message: input });

      // Cast response role explicitly to 'bot'
      const botMessage: Message = { role: 'bot', text: res.data.response as string };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'bot',
        text: 'Error: Could not get response from Gemini.',
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🤖 Gemini Code Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 15,
          minHeight: 300,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 15 }}>
            <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong> <br />
            {msg.text}
          </div>
        ))}
        {loading && <p>Typing...</p>}
      </div>
      <textarea
        rows={3}
        style={{ width: '100%', marginTop: 10, padding: 8, fontSize: 16 }}
        placeholder="Ask me to generate some code..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ marginTop: 10, padding: '10px 15px', fontSize: 16, cursor: 'pointer' }}
      >
        Send
      </button>
    </main>
  );
}
