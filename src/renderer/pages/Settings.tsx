import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Globe, Moon, Lock, Key, Trash2 } from 'lucide-react';
import { useWalletStore } from '../hooks/useWalletStore';

const Settings: React.FC = () => {
  const { currentNetwork, setNetwork, lock } = useWalletStore();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-neutral-800 rounded-xl">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-neutral-400">Manage your wallet preferences</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Security */}
        <SettingsSection title="Security" icon={<Shield className="w-5 h-5" />}>
          <SettingsItem
            title="Auto-Lock"
            description="Lock wallet after inactivity"
            action={
              <select className="bg-neutral-800 text-white px-3 py-2 rounded-lg">
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="0">Never</option>
              </select>
            }
          />
          <SettingsItem
            title="Self-Destruct PIN"
            description="Show decoy wallet under duress"
            action={
              <button className="btn-secondary text-sm">Configure</button>
            }
          />
          <SettingsItem
            title="Change Password"
            description="Update your wallet password"
            action={
              <button className="btn-secondary text-sm">Change</button>
            }
          />
          <SettingsItem
            title="Backup Seed Phrase"
            description="View your recovery phrase"
            action={
              <button className="btn-secondary text-sm">View</button>
            }
          />
        </SettingsSection>

        {/* Network */}
        <SettingsSection title="Network" icon={<Globe className="w-5 h-5" />}>
          <SettingsItem
            title="Network Mode"
            description="Switch between mainnet and testnet"
            action={
              <select
                value={currentNetwork}
                onChange={(e) => setNetwork(e.target.value as 'mainnet' | 'testnet')}
                className="bg-neutral-800 text-white px-3 py-2 rounded-lg"
              >
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
              </select>
            }
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5" />}>
          <SettingsItem
            title="Transaction Alerts"
            description="Notify on incoming transactions"
            action={<ToggleSwitch defaultChecked />}
          />
          <SettingsItem
            title="Price Alerts"
            description="Notify on significant price changes"
            action={<ToggleSwitch />}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" icon={<Moon className="w-5 h-5" />}>
          <SettingsItem
            title="Theme"
            description="Dark mode is always on for privacy"
            action={
              <span className="text-neutral-500 text-sm">Dark Only</span>
            }
          />
          <SettingsItem
            title="Currency Display"
            description="Preferred fiat currency"
            action={
              <select className="bg-neutral-800 text-white px-3 py-2 rounded-lg">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CHF">CHF</option>
                <option value="GBP">GBP</option>
              </select>
            }
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone" icon={<Trash2 className="w-5 h-5 text-red-500" />} danger>
          <SettingsItem
            title="Lock Wallet"
            description="Lock now and require password"
            action={
              <button onClick={lock} className="btn-secondary text-sm">
                Lock Now
              </button>
            }
          />
          <SettingsItem
            title="Delete Wallet"
            description="Remove wallet from this device"
            action={
              <button className="bg-red-900 hover:bg-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">
                Delete
              </button>
            }
          />
        </SettingsSection>

        {/* App Info */}
        <div className="text-center text-neutral-500 text-sm pt-6">
          <p>Suisse Wallet v2.4.0</p>
          <p className="mt-1">Built with 🔒 in Switzerland</p>
        </div>
      </div>
    </div>
  );
};

const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}> = ({ title, icon, children, danger }) => (
  <div className={`bg-neutral-900 border rounded-xl overflow-hidden ${
    danger ? 'border-red-900/50' : 'border-neutral-800'
  }`}>
    <div className={`flex items-center gap-2 px-4 py-3 border-b ${
      danger ? 'border-red-900/50 text-red-400' : 'border-neutral-800 text-neutral-400'
    }`}>
      {icon}
      <span className="font-medium">{title}</span>
    </div>
    <div className="divide-y divide-neutral-800">{children}</div>
  </div>
);

const SettingsItem: React.FC<{
  title: string;
  description: string;
  action: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div>
      <p className="text-white">{title}</p>
      <p className="text-neutral-500 text-sm">{description}</p>
    </div>
    {action}
  </div>
);

const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
  </label>
);

export default Settings;
