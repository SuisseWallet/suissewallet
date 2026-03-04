import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/30">
          <Shield className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2">Suisse Wallet</h1>
      <p className="text-neutral-400 text-lg mb-12">
        Your Money. Your Rules. Swiss Protection.
      </p>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl">
        <FeatureCard
          icon="🔐"
          title="Non-Custodial"
          description="Your keys, your crypto"
        />
        <FeatureCard
          icon="👻"
          title="Ghost Mode"
          description="Disappear from blockchain"
        />
        <FeatureCard
          icon="💱"
          title="Atomic Swaps"
          description="Trustless exchange"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/create')}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all"
        >
          <Key className="w-5 h-5" />
          Create New Wallet
          <ArrowRight className="w-5 h-5 ml-auto" />
        </button>

        <button
          onClick={() => navigate('/import')}
          className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-all border border-neutral-700"
        >
          Import Existing Wallet
          <ArrowRight className="w-5 h-5 ml-auto" />
        </button>
      </div>

      {/* Footer */}
      <p className="text-neutral-500 text-sm mt-12">
        Version 2.4.0 • Built with 🔒 in Switzerland
      </p>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
    <span className="text-3xl mb-2 block">{icon}</span>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-neutral-500 text-sm">{description}</p>
  </div>
);

export default Welcome;
