'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Send, MessageSquare, User, Loader2 } from 'lucide-react';

function ChatContent() {
  const { api, user } = useAuth();
  const searchParams = useSearchParams();
  const targetTutorId = searchParams.get('tutorId');
  const targetRecipientId = searchParams.get('recipientId');

  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadContacts = async () => {
    try {
      const res = await api.get('/chat/contacts');
      setContacts(res.data);
      
      const directTarget = targetTutorId || targetRecipientId;
      if (directTarget) {
        const targetRes = await api.get(`/users/${directTarget}`);
        const found = res.data.find((c: any) => c._id === directTarget);
        if (!found) {
          setContacts((prev) => [targetRes.data, ...prev]);
        }
        setActiveContact(targetRes.data);
      } else if (res.data.length > 0 && !activeContact) {
        setActiveContact(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load chat contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user, targetTutorId, targetRecipientId]);

  useEffect(() => {
    async function loadHistory() {
      if (!activeContact) return;
      setLoadingMessages(true);
      try {
        const res = await api.get(`/chat/history/${activeContact._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadHistory();
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContact) return;
    const optimisticMessage = {
      _id: `temp_${Date.now()}`,
      sender: user,
      recipient: activeContact,
      message: typedMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setTypedMessage('');

    try {
      const res = await api.post('/chat/send', {
        recipientId: activeContact._id,
        message: optimisticMessage.message,
      });
      setMessages(prev => prev.map(m => m._id === optimisticMessage._id ? res.data : m));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 w-full flex flex-col">
        <div className="flex-1 bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col md:flex-row min-h-[560px]">
          {/* Contacts Rail (Left) */}
          <div className="w-full md:w-72 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50 dark:bg-neutral-900/40">
            <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Direct Messaging
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
              {loadingContacts ? (
                <div className="p-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  ))}
                </div>
              ) : contacts.length === 0 ? (
                <div className="p-6 text-center text-neutral-400">
                  <p>No chat history.</p>
                </div>
              ) : (
                contacts.map(c => {
                  const isCurrent = activeContact?._id === c._id;
                  return (
                    <button
                      key={c._id}
                      onClick={() => setActiveContact(c)}
                      className={`w-full text-left p-3 flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-neutral-200/70 dark:bg-neutral-800 font-semibold'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-neutral-300 dark:bg-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-neutral-900 dark:text-neutral-100">{c.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{c.role}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window (Right) */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#121215]">
            {activeContact ? (
              <>
                <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{activeContact.name}</span>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">({activeContact.role})</span>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {loadingMessages ? (
                    <div className="flex justify-center p-8 text-neutral-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
                      <MessageSquare className="w-6 h-6 mb-2 opacity-50" />
                      <p>Start a conversation with {activeContact.name}</p>
                    </div>
                  ) : (
                    messages.map(m => {
                      const isMe = (m.sender?._id || m.sender) === (user as any)?._id || (m.sender?._id || m.sender) === (user as any)?.id;
                      return (
                        <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-md p-2.5 rounded text-xs ${
                              isMe
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                            }`}
                          >
                            <p>{m.message}</p>
                            <span className="block text-[9px] opacity-70 mt-1 text-right font-mono tabular-nums">
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={typedMessage}
                    onChange={e => setTypedMessage(e.target.value)}
                    className="input flex-1"
                  />
                  <button type="submit" className="btn-primary text-xs px-3">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-400 text-xs">
                Select a contact to begin messaging.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
