import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send, Search, Plus, X } from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.other_user_id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name), recipient:recipient_id(full_name)')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationMap = new Map();

      data?.forEach((msg) => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const otherUserName =
          msg.sender_id === user.id ? msg.recipient?.full_name : msg.sender?.full_name;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            other_user_name: otherUserName,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
          });
        }

        if (msg.recipient_id === user.id && !msg.is_read) {
          conversationMap.get(otherUserId).unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name), recipient:recipient_id(full_name)')
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      const unreadMessages = data?.filter(
        (msg) => msg.recipient_id === user.id && !msg.is_read
      );

      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in(
            'id',
            unreadMessages.map((m) => m.id)
          );
        fetchConversations();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: selectedConversation.other_user_id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation.other_user_id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewChat = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    try {
      const { data: lookupResult, error: lookupError } = await supabase
        .rpc('lookup_profile_by_email', { email_address: recipientEmail.toLowerCase() });

      if (lookupError) throw lookupError;

      if (!lookupResult) {
        alert('User not found. Please check the email address.');
        return;
      }

      if (lookupResult.profile_id === user.id) {
        alert('You cannot send messages to yourself.');
        return;
      }

      const existingConversation = conversations.find(
        (c) => c.other_user_id === lookupResult.profile_id
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation);
      } else {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', lookupResult.profile_id)
          .single();

        setSelectedConversation({
          other_user_id: lookupResult.profile_id,
          other_user_name: profileData?.full_name || 'Unknown',
          last_message: '',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
        });
      }

      setShowNewChat(false);
      setRecipientEmail('');
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Connections</h2>
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="New chat"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.other_user_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation?.other_user_id === conv.other_user_id
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {conv.other_user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 truncate">
                          {conv.other_user_name}
                        </p>
                        {conv.unread_count > 0 && (
                          <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.last_message_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {showNewChat ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Start New Chat</h3>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={startNewChat} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Chat
                </button>
              </form>
            </div>
          ) : selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConversation.other_user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedConversation.other_user_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          isSender
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isSender ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
