import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Send: React.FC = () => {
  const { currency: paramCurrency } = useParams();
  const navigate = useNavigate();
  const { balances } = useWalletStore();

  const [currency, setCurrency] = useState(paramCurrency || 'BTC');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentBalance = balances[currency]?.available || '0';

  const handleSend = async () => {
    if (!recipient || !amount) {
      setError('Please fill all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await window.electronAPI.transaction.send({
        currency,
        to: recipient,
        amount,
      });

      toast.success(`Transaction sent! TX: ${result.txHash.slice(0, 16)}...`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMax = () => {
    // Leave some for fee
    const maxAmount = parseFloat(currentBalance) * 0.99;
    setAmount(maxAmount.toFixed(8));
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">Send {currency}</h1>

      <div className="max-w-lg space-y-6">
        {/* Currency selector */}
        <div>
          <label className="text-neutral-400 text-sm mb-2 block">Asset</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input"
          >
            {Object.keys(balances).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Recipient */}
        <div>
          <label className="text-neutral-400 text-sm mb-2 block">Recipient Address</label>
          <input
            type="text"
            placeholder={`Enter ${currency} address`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input font-mono text-sm"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-neutral-400 text-sm">Amount</label>
            <span className="text-neutral-500 text-sm">
              Balance: {currentBalance} {currency}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input pr-20"
            />
            <button
              onClick={handleMax}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-sm font-semibold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Fee selector */}
        <div>
          <label className="text-neutral-400 text-sm mb-2 block">Network Fee</label>
          <div className="grid grid-cols-3 gap-2">
            {['slow', 'normal', 'fast'].map((f) => (
              <button
                key={f}
                onClick={() => setFee(f)}
                className={`py-3 rounded-lg capitalize ${
                  fee === f
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isLoading || !recipient || !amount}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : `Send ${currency}`}
        </button>
      </div>
    </div>
  );
};

export default Send;
