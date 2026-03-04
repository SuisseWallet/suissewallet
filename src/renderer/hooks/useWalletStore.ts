import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Balance {
  available: string;
  pending: string;
  usdValue: string;
}

interface WalletState {
  // State
  walletExists: boolean;
  isUnlocked: boolean;
  balances: Record<string, Balance>;
  addresses: Record<string, string>;
  currentNetwork: 'mainnet' | 'testnet';
  selectedCurrency: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setWalletExists: (exists: boolean) => void;
  setUnlocked: (unlocked: boolean) => void;
  setBalances: (balances: Record<string, Balance>) => void;
  setAddresses: (addresses: Record<string, string>) => void;
  setNetwork: (network: 'mainnet' | 'testnet') => void;
  setSelectedCurrency: (currency: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  checkWalletExists: () => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  createWallet: (password: string) => Promise<{ success: boolean; seedPhrase?: string }>;
  importWallet: (seedPhrase: string, password: string) => Promise<boolean>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletExists: false,
      isUnlocked: false,
      balances: {},
      addresses: {},
      currentNetwork: 'mainnet',
      selectedCurrency: 'BTC',
      isLoading: false,
      error: null,

      // Setters
      setWalletExists: (exists) => set({ walletExists: exists }),
      setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
      setBalances: (balances) => set({ balances }),
      setAddresses: (addresses) => set({ addresses }),
      setNetwork: (network) => set({ currentNetwork: network }),
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Check if wallet exists
      checkWalletExists: async () => {
        try {
          const exists = await window.electronAPI.wallet.exists();
          set({ walletExists: exists });
        } catch (error) {
          console.error('Failed to check wallet:', error);
        }
      },

      // Unlock wallet
      unlock: async (password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await window.electronAPI.wallet.unlock(password);
          if (result.success) {
            set({ isUnlocked: true });
            // Fetch balances after unlock
            get().refreshBalances();
            return true;
          } else {
            set({ error: 'Invalid password' });
            return false;
          }
        } catch (error) {
          set({ error: 'Failed to unlock wallet' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Lock wallet
      lock: async () => {
        try {
          await window.electronAPI.wallet.lock();
          set({ 
            isUnlocked: false, 
            balances: {}, 
            addresses: {} 
          });
        } catch (error) {
          console.error('Failed to lock wallet:', error);
        }
      },

      // Refresh balances
      refreshBalances: async () => {
        if (!get().isUnlocked) return;
        
        set({ isLoading: true });
        try {
          const balances = await window.electronAPI.wallet.getBalances();
          set({ balances });

          // Also fetch addresses
          const currencies = ['BTC', 'ETH', 'USDT', 'XMR', 'SOL', 'BNB', 'ADA', 'XRP', 'LTC', 'AVAX', 'MATIC', 'TRX'];
          const addresses: Record<string, string> = {};
          
          for (const currency of currencies) {
            try {
              addresses[currency] = await window.electronAPI.wallet.getAddress(currency);
            } catch {
              // Skip unsupported currencies
            }
          }
          
          set({ addresses });
        } catch (error) {
          console.error('Failed to refresh balances:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Create new wallet
      createWallet: async (password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await window.electronAPI.wallet.create(password);
          if (result.success) {
            set({ walletExists: true, isUnlocked: true });
            get().refreshBalances();
          }
          return result;
        } catch (error) {
          set({ error: 'Failed to create wallet' });
          return { success: false };
        } finally {
          set({ isLoading: false });
        }
      },

      // Import wallet from seed
      importWallet: async (seedPhrase: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await window.electronAPI.wallet.import(seedPhrase, password);
          if (result.success) {
            set({ walletExists: true, isUnlocked: true });
            get().refreshBalances();
            return true;
          } else {
            set({ error: 'Invalid seed phrase' });
            return false;
          }
        } catch (error) {
          set({ error: 'Failed to import wallet' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'suisse-wallet-store',
      partialize: (state) => ({
        currentNetwork: state.currentNetwork,
        selectedCurrency: state.selectedCurrency,
      }),
    }
  )
);
