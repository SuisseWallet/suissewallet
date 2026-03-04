import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Ghost,
  Users,
  Receipt,
  Settings,
  Lock,
  Minus,
  Square,
  X,
} from 'lucide-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { lock } = useWalletStore();

  const handleLock = () => {
    lock();
    navigate('/unlock');
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Title bar */}
      <div className="drag-region h-10 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 no-drag">
          <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-white text-sm font-medium">Suisse Wallet</span>
        </div>
        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => window.electronAPI?.window.minimize()}
            className="p-2 hover:bg-neutral-800 rounded"
          >
            <Minus className="w-4 h-4 text-neutral-400" />
          </button>
          <button
            onClick={() => window.electronAPI?.window.maximize()}
            className="p-2 hover:bg-neutral-800 rounded"
          >
            <Square className="w-3 h-3 text-neutral-400" />
          </button>
          <button
            onClick={() => window.electronAPI?.window.close()}
            className="p-2 hover:bg-red-900 rounded"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col">
          <div className="flex-1 py-4">
            <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem to="/swap" icon={<ArrowLeftRight />} label="Swap" />
            <NavItem to="/ghost" icon={<Ghost />} label="Ghost Mode" highlight />
            <NavItem to="/trade" icon={<Users />} label="P2P Trade" />
            <NavItem to="/invoice" icon={<Receipt />} label="Invoice" />
            
            <div className="mx-4 my-4 border-t border-neutral-800" />
            
            <NavItem to="/settings" icon={<Settings />} label="Settings" />
          </div>

          {/* Lock button */}
          <div className="p-4 border-t border-neutral-900">
            <button
              onClick={handleLock}
              className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded-xl transition-colors"
            >
              <Lock className="w-4 h-4" />
              Lock Wallet
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}> = ({ to, icon, label, highlight }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 mx-3 px-4 py-3 rounded-xl transition-colors ${
        isActive
          ? highlight
            ? 'bg-red-950/50 text-red-500'
            : 'bg-neutral-900 text-white'
          : highlight
          ? 'text-red-500/70 hover:bg-red-950/30'
          : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
      }`
    }
  >
    <span className="w-5 h-5">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default Layout;
