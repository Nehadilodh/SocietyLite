import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { MdSend, MdAutoAwesome } from 'react-icons/md';

const ChatBox = ({ complaintId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, darkMode } = useAuth();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/complaint/${complaintId}/chat`);
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    if (socket) {
      const handler = (msg) => {
        if (msg.complaintId === complaintId) {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        }
      };
      socket.on('new_chat_message', handler);
      return () => socket.off('new_chat_message', handler);
    }
  }, [complaintId, socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await api.post(`/complaint/${complaintId}/chat`, { message: input });
      setInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskAI = async () => {
    if (user.role !== 'admin') return;
    setLoading(true);
    try {
      await api.post(`/complaint/${complaintId}/ai-reply`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={`flex flex-col h-96 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === (user?.id || user?._id);
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {msg.sender?.name} {msg.isAI && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded text-[10px] ml-1 font-bold">AI</span>}
              </span>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.isAI ? (darkMode ? 'bg-indigo-900/40 text-indigo-100 border border-indigo-700/50' : 'bg-indigo-50 text-indigo-900 border border-indigo-100') :
                  isMe ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-800')
                }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300'}`}
          />
          <button type="submit" disabled={!input.trim()} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
            <MdSend />
          </button>
          {user.role === 'admin' && (
            <button type="button" onClick={handleAskAI} disabled={loading} className="bg-amber-500 text-white p-3 rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center" title="Ask AI to generate a reply">
              <MdAutoAwesome />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatBox;