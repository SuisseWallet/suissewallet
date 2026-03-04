import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Receive: React.FC = () => {
  const { currency: paramCurrency } = useParams();
  const navigate = useNavigate();
  const { addresses, balances } = useWalletStore();

  const [currency, setCurrency] = useState(paramCurrency || 'BTC');
  const [copied, setCopied] = useState(false);

  const address = addresses[currency] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <h1 className="text-2xl font-bold text-white mb-6">Receive {currency}</h1>

      <div className="max-w-lg space-y-6">
        {/* Currency selector */}
        <div>
          <label className="text-neutral-400 text-sm mb-2 block">Asset</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input"
          >
            {Object.keys(addresses).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG
              value={address}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-neutral-400 text-sm mb-2 block">Your {currency} Address</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              readOnly
              className="input font-mono text-sm pr-12"
            />
            <button
              onClick={handleCopy}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Copied!' : 'Copy Address'}
        </button>

        {/* Warning */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">
            ⚠️ Only send <strong>{currency}</strong> to this address. Sending other assets may result in permanent loss.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;
