import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Coins, Send, TrendingUp, TrendingDown, Clock, User, Check, AlertCircle } from 'lucide-react';

export default function Credits() {
  const { user, profile, refreshProfile } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select(`
          *,
          sender:sender_id(full_name, email),
          recipient:recipient_id(full_name, email)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const transferAmount = parseInt(amount);

      if (!transferAmount || transferAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (transferAmount > profile.credits) {
        throw new Error('Insufficient credits');
      }

      if (recipientEmail.toLowerCase() === user.email.toLowerCase()) {
        throw new Error('You cannot send credits to yourself');
      }

      const { data: lookupResult, error: lookupError } = await supabase
        .rpc('lookup_profile_by_email', { email_address: recipientEmail.toLowerCase() });

      if (lookupError) throw lookupError;

      if (!lookupResult) {
        throw new Error('Recipient email not found. Please check the email address.');
      }

      const recipientData = {
        id: lookupResult.profile_id,
        credits: lookupResult.profile_credits,
      };

      const { error: senderError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - transferAmount })
        .eq('id', user.id);

      if (senderError) throw senderError;

      const { error: recipientUpdateError } = await supabase
        .from('profiles')
        .update({ credits: recipientData.credits + transferAmount })
        .eq('id', recipientData.id);

      if (recipientUpdateError) throw recipientUpdateError;

      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          sender_id: user.id,
          recipient_id: recipientData.id,
          amount: transferAmount,
          transaction_type: 'transfer',
        });

      if (transactionError) throw transactionError;

      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          type: 'credit_sent',
          title: 'Credits Sent',
          message: `You sent ${transferAmount} credits to ${recipientEmail}`,
          related_user_id: recipientData.id,
        },
        {
          user_id: recipientData.id,
          type: 'credit_received',
          title: 'Credits Received',
          message: `You received ${transferAmount} credits from ${profile.full_name}`,
          related_user_id: user.id,
        },
      ]);

      await refreshProfile();
      await fetchTransactions();

      setMessage({
        type: 'success',
        text: `Successfully sent ${transferAmount} credits to ${recipientEmail}`,
      });
      setRecipientEmail('');
      setAmount('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Your Balance</p>
            <div className="flex items-center gap-3">
              <Coins size={40} />
              <p className="text-5xl font-bold">{profile?.credits || 0}</p>
            </div>
            <p className="text-blue-100 text-sm mt-2">Credits available to spend or transfer</p>
          </div>
          <div className="hidden md:block">
            <div className="p-4 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp size={48} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Send size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Credits</h2>
            <p className="text-sm text-gray-600">Transfer credits to another user</p>
          </div>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recipient@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the email address of a registered user
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="1"
              max={profile?.credits || 0}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Available balance: {profile?.credits || 0} credits
            </p>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <Check size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !recipientEmail || !amount}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <Send size={20} />
                Send Credits
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-600">Your credit history</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Coins size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isSender = transaction.sender_id === user.id;
              const otherUser = isSender ? transaction.recipient : transaction.sender;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        isSender ? 'bg-red-100' : 'bg-green-100'
                      }`}
                    >
                      {isSender ? (
                        <TrendingDown size={20} className="text-red-600" />
                      ) : (
                        <TrendingUp size={20} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isSender ? 'Sent to' : 'Received from'} {otherUser?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{otherUser?.email}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        isSender ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {isSender ? '-' : '+'}
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">credits</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How Credits Work</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Earn 1 credit for every minute of active platform usage</li>
              <li>• Use credits to book sessions with skilled community members</li>
              <li>• Transfer credits to help others in your community</li>
              <li>• Credits are non-refundable once transferred</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
