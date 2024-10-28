import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Bot, User, Book, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatContext {
  menteeId?: string;
  menteeName?: string;
  recentNotes?: string[];
  recentPrayerRequests?: string[];
}

export function AIChat() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState<ChatContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      const response = await axios.get('/api/chat/messages');
      return response.data as Message[];
    },
  });

  const { data: mentees = [] } = useQuery({
    queryKey: ['mentees'],
    queryFn: async () => {
      const response = await axios.get('/api/mentees');
      return response.data;
    },
  });

  const { mutate: sendMessage, isLoading: isSending } = useMutation({
    mutationFn: async () => {
      return axios.post('/api/chat/messages', {
        content: message,
        context,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setMessage('');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      sendMessage();
    }
  };

  const handleContextChange = async (menteeId: string) => {
    const response = await axios.get(`/api/mentees/${menteeId}`);
    const mentee = response.data;
    
    setContext({
      menteeId,
      menteeName: mentee.name,
      recentNotes: mentee.notes
        .filter(note => note.type === 'general')
        .map(note => note.content)
        .slice(-3),
      recentPrayerRequests: mentee.notes
        .filter(note => note.type === 'prayer')
        .map(note => note.content)
        .slice(-3),
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="bg-white p-4 shadow rounded-lg mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI Mentor Assistant</h2>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => handleContextChange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            defaultValue=""
          >
            <option value="" disabled>Select a mentee for context</option>
            {mentees.map((mentee) => (
              <option key={mentee.id} value={mentee.id}>
                {mentee.name}
              </option>
            ))}
          </select>
          {context.menteeName && (
            <span className="text-sm text-gray-500">
              Providing context for {context.menteeName}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <Bot className="h-8 w-8 rounded-full bg-indigo-100 p-1.5 text-indigo-600" />
                </div>
              )}
              <div
                className={`rounded-lg p-4 max-w-[80%] ${
                  msg.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    a: ({ children, href }) => (
                      <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === 'assistant' ? 'text-gray-500' : 'text-indigo-200'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 rounded-full bg-indigo-600 p-1.5 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask for mentoring advice..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSending ? (
                <RefreshCcw className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}