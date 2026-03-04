import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ImportWallet: React.FC = () => {
  const navigate = useNavigate();
  const { importWallet, isLoading } = useWalletStore();
  
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    const words = seedPhrase.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      setError('Seed phrase must be 12 or 24 words');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const success = await importWallet(seedPhrase.trim(), password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid seed phrase');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 p-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Import Wallet</h1>
          <p className="text-neutral-400">Enter your 12 or 24-word seed phrase</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Seed Phrase</label>
            <textarea
              placeholder="Enter your seed phrase..."
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              rows={4}
              className="input resize-none"
            />
            <p className="text-neutral-500 text-xs mt-1">
              Words: {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}
            </p>
          </div>

          <div className="relative">
            <label className="text-neutral-400 text-sm mb-2 block">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-neutral-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleImport}
            disabled={isLoading || !seedPhrase || !password || !confirmPassword}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import Wallet'}
          </button>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">
            💡 Your seed phrase is encrypted locally and never sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet;
