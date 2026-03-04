import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Unlock: React.FC = () => {
  const navigate = useNavigate();
  const { unlock, isLoading, walletExists, checkWalletExists } = useWalletStore();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkWalletExists();
  }, []);

  useEffect(() => {
    if (!walletExists) {
      navigate('/');
    }
  }, [walletExists]);

  const handleUnlock = async () => {
    setError('');
    const success = await unlock(password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
      <p className="text-neutral-400 mb-8">Enter your password to unlock</p>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input pr-12"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleUnlock}
          disabled={isLoading || !password}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? 'Unlocking...' : 'Unlock'}
        </button>

        <button
          onClick={() => navigate('/import')}
          className="text-neutral-500 hover:text-white text-sm w-full text-center"
        >
          Forgot password? Import with seed phrase
        </button>
      </div>
    </div>
  );
};

export default Unlock;
