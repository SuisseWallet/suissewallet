import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';

const ProtectedRoute: React.FC = () => {
  const { isUnlocked, walletExists } = useWalletStore();

  if (!walletExists) {
    return <Navigate to="/" replace />;
  }

  if (!isUnlocked) {
    return <Navigate to="/unlock" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
