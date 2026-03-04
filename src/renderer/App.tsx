import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWalletStore } from './hooks/useWalletStore';

// Pages
import Welcome from './pages/Welcome';
import CreateWallet from './pages/CreateWallet';
import ImportWallet from './pages/ImportWallet';
import Unlock from './pages/Unlock';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Swap from './pages/Swap';
import Trade from './pages/Trade';
import Ghost from './pages/Ghost';
import Invoice from './pages/Invoice';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { walletExists, isUnlocked } = useWalletStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          !walletExists ? (
            <Welcome />
          ) : !isUnlocked ? (
            <Navigate to="/unlock" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/create" element={<CreateWallet />} />
      <Route path="/import" element={<ImportWallet />} />
      <Route path="/unlock" element={<Unlock />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Send />} />
          <Route path="/send/:currency" element={<Send />} />
          <Route path="/receive" element={<Receive />} />
          <Route path="/receive/:currency" element={<Receive />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/ghost" element={<Ghost />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice/new" element={<Invoice />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
