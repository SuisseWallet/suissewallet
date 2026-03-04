import React, { useState } from 'react';
import { ArrowDownUp, ArrowRight } from 'lucide-react';
import { useWalletStore } from '../hooks/useWalletStore';
import toast from 'react-hot-toast';

const CURRENCIES = ['BTC', 'ETH', 'USDT', 'XMR', 'SOL', 'BNB'];

const Swap: React.FC = () => {
  const { balances } = useWalletStore();
  
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fromBalance = balances[fromCurrency]?.available || '0';

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Mock conversion rate
    const rate = getConversionRate(fromCurrency, toCurrency);
    setToAmount((parseFloat(value || '0') * rate).toFixed(6));
  };

  const getConversionRate = (from: string, to: string): number => {
    // Mock rates - in production, fetch from API
    const rates: Record<string, number> = {
      'BTC-ETH': 16.5,
      'BTC-USDT': 68000,
      'BTC-XMR': 400,
      'ETH-BTC': 0.06,
      'ETH-USDT': 4100,
      'ETH-XMR': 24,
      'USDT-BTC': 0.000015,
      'USDT-ETH': 0.00024,
      'USDT-XMR': 0.006,
      'XMR-BTC': 0.0025,
      'XMR-ETH': 0.042,
      'XMR-USDT': 170,
    };
    return rates[`${from}-${to}`] || 1;
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      await window.electronAPI.swap.execute({
        from: fromCurrency,
        to: toCurrency,
        amount: fromAmount,
        quote: { rate: getConversionRate(fromCurrency, toCurrency) },
      });
      toast.success('Swap completed!');
      setFromAmount('');
      setToAmount('');
    } catch (err: any) {
      toast.error(err.message || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Atomic Swap</h1>

      <div className="max-w-lg space-y-4">
        {/* From */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400 text-sm">From</span>
            <span className="text-neutral-500 text-sm">Balance: {fromBalance}</span>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-2xl text-white outline-none"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapCurrencies}
            className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-full"
          >
            <ArrowDownUp className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* To */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400 text-sm">To</span>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="0.00"
              value={toAmount}
              readOnly
              className="flex-1 bg-transparent text-2xl text-white outline-none"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg"
            >
              {CURRENCIES.filter((c) => c !== fromCurrency).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate info */}
        {fromAmount && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Rate</span>
              <span className="text-white">
                1 {fromCurrency} = {getConversionRate(fromCurrency, toCurrency)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-neutral-400">Fee</span>
              <span className="text-white">0.3%</span>
            </div>
          </div>
        )}

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={isLoading || !fromAmount}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Swapping...' : 'Swap'}
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Info */}
        <div className="text-neutral-500 text-sm text-center">
          Powered by atomic swaps. No intermediaries, no custody risk.
        </div>
      </div>
    </div>
  );
};

export default Swap;
