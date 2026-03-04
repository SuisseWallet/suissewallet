import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import {
  Send,
  Download,
  RefreshCw,
  Ghost,
  ArrowLeftRight,
  Receipt,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// Crypto icons mapping
const CRYPTO_ICONS: Record<string, string> = {
  BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
  XMR: 'https://cryptologos.cc/logos/monero-xmr-logo.svg',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.svg',
  BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
  ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.svg',
  XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  LTC: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
  TRX: 'https://cryptologos.cc/logos/tron-trx-logo.svg',
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { balances, isLoading, refreshBalances } = useWalletStore();
  const [totalBalance, setTotalBalance] = useState('0.00');
  const [dailyChange, setDailyChange] = useState({ amount: '0.00', percent: '0.00', positive: true });

  useEffect(() => {
    refreshBalances();
  }, []);

  useEffect(() => {
    // Calculate total balance
    const total = Object.values(balances).reduce((sum, balance) => {
      return sum + parseFloat(balance.usdValue || '0');
    }, 0);
    setTotalBalance(total.toFixed(2));

    // Mock daily change (in production, track historical values)
    const change = total * 0.0273;
    setDailyChange({
      amount: change.toFixed(2),
      percent: '2.73',
      positive: true,
    });
  }, [balances]);

  return (
    <div className="p-6 space-y-6">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <p className="text-neutral-400 text-sm mb-1">Total Balance</p>
        <h1 className="text-4xl font-bold text-white mb-2">
          ${totalBalance}
        </h1>
        <div className={`flex items-center gap-1 text-sm ${dailyChange.positive ? 'text-green-500' : 'text-red-500'}`}>
          {dailyChange.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>${dailyChange.amount} ({dailyChange.percent}%) today</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-5 gap-3">
        <QuickAction icon={<Download />} label="Receive" onClick={() => navigate('/receive')} />
        <QuickAction icon={<Send />} label="Send" onClick={() => navigate('/send')} />
        <QuickAction icon={<ArrowLeftRight />} label="Swap" onClick={() => navigate('/swap')} />
        <QuickAction icon={<Ghost />} label="Ghost" onClick={() => navigate('/ghost')} color="red" />
        <QuickAction icon={<Receipt />} label="Invoice" onClick={() => navigate('/invoice')} />
      </div>

      {/* Assets List */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-white font-semibold">Your Assets</h2>
          <button
            onClick={refreshBalances}
            disabled={isLoading}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="divide-y divide-neutral-800">
          {Object.entries(balances).map(([currency, balance]) => (
            <AssetRow
              key={currency}
              currency={currency}
              icon={CRYPTO_ICONS[currency]}
              balance={balance.available}
              usdValue={balance.usdValue}
              change={Math.random() > 0.5 ? '+2.4%' : '-1.2%'} // Mock change
              onClick={() => navigate(`/send/${currency}`)}
            />
          ))}

          {Object.keys(balances).length === 0 && !isLoading && (
            <div className="p-8 text-center text-neutral-500">
              No assets yet. Receive crypto to get started.
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="P2P Trade"
          description="Buy and sell crypto with verified traders"
          onClick={() => navigate('/trade')}
        />
        <FeatureCard
          icon={<Ghost className="w-6 h-6" />}
          title="Ghost Mode"
          description="Convert all assets to Monero instantly"
          onClick={() => navigate('/ghost')}
          highlight
        />
      </div>
    </div>
  );
};

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'default' | 'red';
}> = ({ icon, label, onClick, color = 'default' }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
      color === 'red'
        ? 'bg-red-950/30 hover:bg-red-900/40 text-red-500'
        : 'bg-neutral-800/50 hover:bg-neutral-700/50 text-white'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const AssetRow: React.FC<{
  currency: string;
  icon: string;
  balance: string;
  usdValue: string;
  change: string;
  onClick: () => void;
}> = ({ currency, icon, balance, usdValue, change, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-colors"
  >
    <img src={icon} alt={currency} className="w-10 h-10" />
    <div className="flex-1 text-left">
      <p className="text-white font-medium">{currency}</p>
      <p className="text-neutral-500 text-sm">{balance} {currency}</p>
    </div>
    <div className="text-right">
      <p className="text-white">${usdValue}</p>
      <p className={change.startsWith('+') ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
        {change}
      </p>
    </div>
  </button>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
}> = ({ icon, title, description, onClick, highlight }) => (
  <button
    onClick={onClick}
    className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all ${
      highlight
        ? 'bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-900/50 hover:border-red-700'
        : 'bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700'
    }`}
  >
    <div className={highlight ? 'text-red-500' : 'text-neutral-400'}>{icon}</div>
    <div>
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-neutral-500 text-sm">{description}</p>
    </div>
  </button>
);

export default Dashboard;
