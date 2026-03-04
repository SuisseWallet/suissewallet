import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { Eye, EyeOff, Copy, Check, ArrowLeft } from 'lucide-react';

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet, isLoading } = useWalletStore();
  
  const [step, setStep] = useState<'password' | 'seed' | 'verify'>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [verifyWords, setVerifyWords] = useState<{ index: number; value: string }[]>([]);
  const [error, setError] = useState('');

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const result = await createWallet(password);
    if (result.success && result.seedPhrase) {
      setSeedPhrase(result.seedPhrase.split(' '));
      setStep('seed');
      
      // Generate random indexes for verification
      const indexes = [3, 7, 12, 18].map(i => ({
        index: i,
        value: '',
      }));
      setVerifyWords(indexes);
    } else {
      setError('Failed to create wallet');
    }
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    const isValid = verifyWords.every(
      (word) => seedPhrase[word.index - 1]?.toLowerCase() === word.value.toLowerCase()
    );

    if (isValid) {
      navigate('/dashboard');
    } else {
      setError('Incorrect words. Please check your seed phrase.');
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

      <div className="max-w-md mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['password', 'seed', 'verify'].map((s, i) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                step === s ? 'bg-red-600' : i < ['password', 'seed', 'verify'].indexOf(step) ? 'bg-red-600/50' : 'bg-neutral-700'
              }`}
            />
          ))}
        </div>

        {step === 'password' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Create Password</h1>
              <p className="text-neutral-400">This password encrypts your wallet on this device</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleCreateWallet}
                disabled={isLoading || !password || !confirmPassword}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Wallet'}
              </button>
            </div>
          </div>
        )}

        {step === 'seed' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Backup Seed Phrase</h1>
              <p className="text-neutral-400">Write down these 24 words in order. Never share them.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-2">
                {seedPhrase.map((word, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-500 w-6">{i + 1}.</span>
                    <span className="text-white">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopySeed}
              className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>

            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
              <p className="text-red-400 text-sm">
                ⚠️ Never share your seed phrase. Anyone with these words can steal your funds.
              </p>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="btn-primary w-full"
            >
              I've Saved My Seed Phrase
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Verify Seed Phrase</h1>
              <p className="text-neutral-400">Enter the requested words to confirm your backup</p>
            </div>

            <div className="space-y-4">
              {verifyWords.map((word, i) => (
                <div key={i}>
                  <label className="text-neutral-400 text-sm mb-1 block">
                    Word #{word.index}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter word #${word.index}`}
                    value={word.value}
                    onChange={(e) => {
                      const updated = [...verifyWords];
                      updated[i].value = e.target.value;
                      setVerifyWords(updated);
                    }}
                    className="input"
                  />
                </div>
              ))}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleVerify}
                className="btn-primary w-full"
              >
                Verify & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWallet;
