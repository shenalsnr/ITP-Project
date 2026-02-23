// Components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    let botResponse = '';
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      botResponse = 'Hello! How can I help you with your spice order today? 😊';
    } else if (lowerCaseInput.includes('help')) {
      botResponse =
        'I can help with common questions. Ask about order status, return policy, or submit a ticket!';
    } else if (lowerCaseInput.includes('status')) {
      botResponse = 'Please provide your order or ticket ID, and I will check the status for you.';
    } else if (lowerCaseInput.includes('order')) {
      botResponse =
        'For order issues, provide your order number. I can help with tracking, cancellations, or changes.';
    } else {
      botResponse =
        'Sorry, I didn’t understand. Try asking about "help", "status", or your "order".';
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-500 to-amber-500 p-4">
      <div className="flex flex-col w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-500 text-white p-5 text-2xl font-bold text-center">
          Chat with SpiceBot 🤖
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-xs ${
                msg.sender === 'user' ? 'bg-rose-200 self-end' : 'bg-amber-200 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 bg-gray-100 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
