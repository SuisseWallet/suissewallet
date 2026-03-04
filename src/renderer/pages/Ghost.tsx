import React, { useState } from 'react';
import { Ghost as GhostIcon, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { useWalletStore } from '../hooks/useWalletStore';
import toast from 'react-hot-toast';

const Ghost: React.FC = () => {
  const { balances } = useWalletStore();
  
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');

  const totalUsdValue = Object.entries(balances)
    .filter(([currency]) => currency !== 'XMR')
    .reduce((sum, [, balance]) => sum + parseFloat(balance.usdValue || '0'), 0);

  const toggleAsset = (currency: string) => {
    setSelectedAssets((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  };

  const selectAll = () => {
    const nonXmrAssets = Object.keys(balances).filter((c) => c !== 'XMR');
    setSelectedAssets(nonXmrAssets);
  };

  const handleActivateGhost = async () => {
    if (selectedAssets.length === 0) {
      toast.error('Select at least one asset');
      return;
    }
    setShowConfirm(true);
  };

  const confirmGhostMode = async () => {
    setIsConverting(true);
    try {
      await window.electronAPI.ghost.activate(selectedAssets);
      toast.success('Ghost Mode activated! All assets converted to XMR.');
      setShowConfirm(false);
      setSelectedAssets([]);
    } catch (err: any) {
      toast.error(err.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-950/50 rounded-xl">
          <GhostIcon className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ghost Mode</h1>
          <p className="text-neutral-400">Disappear from the public blockchain</p>
        </div>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Info card */}
        <div className="bg-gradient-to-br from-red-950/30 to-neutral-900 border border-red-900/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">What is Ghost Mode?</h3>
              <p className="text-neutral-400 text-sm">
                Ghost Mode converts your visible assets (BTC, ETH, USDT) into Monero (XMR), 
                making them completely untraceable on public blockchains. Ring signatures 
                and stealth addresses ensure maximum privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Visible balance */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-400">VISIBLE BALANCE</span>
            </div>
            <span className="text-2xl font-bold text-white">${totalUsdValue.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            {Object.entries(balances)
              .filter(([currency]) => currency !== 'XMR' && parseFloat(balances[currency].available) > 0)
              .map(([currency, balance]) => (
                <label
                  key={currency}
                  className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(currency)}
                      onChange={() => toggleAsset(currency)}
                      className="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-white">{currency}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{balance.available}</p>
                    <p className="text-neutral-500 text-sm">${balance.usdValue}</p>
                  </div>
                </label>
              ))}
          </div>

          <button
            onClick={selectAll}
            className="text-red-500 text-sm mt-3 hover:underline"
          >
            Select All
          </button>
        </div>

        {/* After conversion preview */}
        {selectedAssets.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <EyeOff className="w-5 h-5 text-green-500" />
              <span className="text-neutral-400">AFTER CONVERSION</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Estimated XMR</span>
              <span className="text-2xl font-bold text-green-500">
                ~{(totalUsdValue / 170).toFixed(4)} XMR
              </span>
            </div>
            <p className="text-neutral-500 text-sm mt-2">
              Fee: ~0.3% • Conversion via atomic swap
            </p>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-950/30 border border-yellow-900/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-500 font-semibold mb-1">Important</p>
              <p className="text-neutral-400">
                This action converts selected assets to Monero. The conversion is irreversible 
                through this wallet. You can later convert XMR back to other currencies if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Activate button */}
        <button
          onClick={handleActivateGhost}
          disabled={selectedAssets.length === 0 || isConverting}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <GhostIcon className="w-5 h-5" />
          {isConverting ? 'Converting...' : 'Activate Ghost Mode'}
        </button>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <GhostIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Confirm Ghost Mode</h2>
              <p className="text-neutral-400">
                You are about to convert {selectedAssets.length} asset(s) to Monero.
              </p>
            </div>

            <input
              type="password"
              placeholder="Enter password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmGhostMode}
                disabled={!password || isConverting}
                className="btn-primary flex-1"
              >
                {isConverting ? 'Converting...' : 'Go Ghost'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ghost;
