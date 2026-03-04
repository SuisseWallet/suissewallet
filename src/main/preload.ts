import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Wallet operations
  wallet: {
    create: (password: string) => ipcRenderer.invoke('wallet:create', password),
    import: (seedPhrase: string, password: string) => 
      ipcRenderer.invoke('wallet:import', seedPhrase, password),
    unlock: (password: string) => ipcRenderer.invoke('wallet:unlock', password),
    lock: () => ipcRenderer.invoke('wallet:lock'),
    getBalance: (currency: string) => ipcRenderer.invoke('wallet:getBalance', currency),
    getBalances: () => ipcRenderer.invoke('wallet:getBalances'),
    getAddress: (currency: string) => ipcRenderer.invoke('wallet:getAddress', currency),
    getSeedPhrase: (password: string) => ipcRenderer.invoke('wallet:getSeedPhrase', password),
    isLocked: () => ipcRenderer.invoke('wallet:isLocked'),
    exists: () => ipcRenderer.invoke('wallet:exists'),
  },

  // Transaction operations
  transaction: {
    send: (params: { currency: string; to: string; amount: string; fee?: string }) =>
      ipcRenderer.invoke('transaction:send', params),
    getHistory: (currency: string) => ipcRenderer.invoke('transaction:getHistory', currency),
    estimateFee: (params: { currency: string; to: string; amount: string }) =>
      ipcRenderer.invoke('transaction:estimateFee', params),
  },

  // Swap operations
  swap: {
    getQuote: (params: { from: string; to: string; amount: string }) =>
      ipcRenderer.invoke('swap:getQuote', params),
    execute: (params: { from: string; to: string; amount: string; quote: object }) =>
      ipcRenderer.invoke('swap:execute', params),
    getHistory: () => ipcRenderer.invoke('swap:getHistory'),
  },

  // Ghost Mode (Monero conversion)
  ghost: {
    activate: (currencies: string[]) => ipcRenderer.invoke('ghost:activate', currencies),
    getStatus: () => ipcRenderer.invoke('ghost:getStatus'),
    estimateConversion: (currencies: string[]) =>
      ipcRenderer.invoke('ghost:estimateConversion', currencies),
  },

  // P2P Trade
  trade: {
    getOffers: (params: { type: 'buy' | 'sell'; currency: string; fiat: string }) =>
      ipcRenderer.invoke('trade:getOffers', params),
    createOffer: (params: object) => ipcRenderer.invoke('trade:createOffer', params),
    acceptOffer: (offerId: string) => ipcRenderer.invoke('trade:acceptOffer', offerId),
    cancelOffer: (offerId: string) => ipcRenderer.invoke('trade:cancelOffer', offerId),
    getMyOffers: () => ipcRenderer.invoke('trade:getMyOffers'),
    getTradeHistory: () => ipcRenderer.invoke('trade:getTradeHistory'),
  },

  // Invoice
  invoice: {
    create: (params: {
      amount: number;
      fiatCurrency: string;
      acceptedCurrencies: string[];
      recipient?: string;
      description?: string;
    }) => ipcRenderer.invoke('invoice:create', params),
    get: (invoiceId: string) => ipcRenderer.invoke('invoice:get', invoiceId),
    getAll: () => ipcRenderer.invoke('invoice:getAll'),
    cancel: (invoiceId: string) => ipcRenderer.invoke('invoice:cancel', invoiceId),
    pay: (invoiceId: string, currency: string) =>
      ipcRenderer.invoke('invoice:pay', invoiceId, currency),
  },

  // QR Pay
  qrPay: {
    generate: (params: { currency: string; amount: string; label?: string }) =>
      ipcRenderer.invoke('qrPay:generate', params),
    scan: (qrData: string) => ipcRenderer.invoke('qrPay:scan', qrData),
    pay: (qrData: string) => ipcRenderer.invoke('qrPay:pay', qrData),
  },

  // Settings
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    setNetwork: (network: 'mainnet' | 'testnet') =>
      ipcRenderer.invoke('settings:setNetwork', network),
    setSelfDestructPin: (pin: string, decoyBalance: object) =>
      ipcRenderer.invoke('settings:setSelfDestructPin', pin, decoyBalance),
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  // Events
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      'wallet:locked',
      'wallet:unlocked',
      'transaction:received',
      'transaction:confirmed',
      'swap:completed',
      'ghost:completed',
      'trade:updated',
      'invoice:paid',
      'price:updated',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },

  removeListener: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Type definitions for renderer
export interface ElectronAPI {
  wallet: {
    create: (password: string) => Promise<{ success: boolean; seedPhrase?: string }>;
    import: (seedPhrase: string, password: string) => Promise<{ success: boolean }>;
    unlock: (password: string) => Promise<{ success: boolean }>;
    lock: () => Promise<void>;
    getBalance: (currency: string) => Promise<string>;
    getBalances: () => Promise<Record<string, string>>;
    getAddress: (currency: string) => Promise<string>;
    getSeedPhrase: (password: string) => Promise<string>;
    isLocked: () => Promise<boolean>;
    exists: () => Promise<boolean>;
  };
  // ... other interfaces
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
