import { IpcMain, BrowserWindow } from 'electron';
import { WalletManager } from '../wallet/WalletManager';
import { CryptoService } from '../crypto/CryptoService';

export function setupIpcHandlers(
  ipcMain: IpcMain,
  walletManager: WalletManager,
  cryptoService: CryptoService
): void {
  // Wallet handlers
  ipcMain.handle('wallet:create', async (_, password: string) => {
    return walletManager.createWallet(password);
  });

  ipcMain.handle('wallet:import', async (_, seedPhrase: string, password: string) => {
    return walletManager.importWallet(seedPhrase, password);
  });

  ipcMain.handle('wallet:unlock', async (_, password: string) => {
    return walletManager.unlock(password);
  });

  ipcMain.handle('wallet:lock', async () => {
    walletManager.lock();
  });

  ipcMain.handle('wallet:getBalance', async (_, currency: string) => {
    return walletManager.getBalance(currency);
  });

  ipcMain.handle('wallet:getBalances', async () => {
    return walletManager.getBalances();
  });

  ipcMain.handle('wallet:getAddress', async (_, currency: string) => {
    return walletManager.getAddress(currency);
  });

  ipcMain.handle('wallet:isLocked', async () => {
    return walletManager.getIsLocked();
  });

  ipcMain.handle('wallet:exists', async () => {
    return walletManager.walletExists();
  });

  // Transaction handlers
  ipcMain.handle('transaction:send', async (_, params) => {
    return walletManager.send(params);
  });

  ipcMain.handle('transaction:estimateFee', async (_, params) => {
    // Implementation would call the appropriate wallet's estimateFee method
    return { fee: '0.0001' };
  });

  // Swap handlers
  ipcMain.handle('swap:getQuote', async (_, params) => {
    // Mock implementation
    const rates: Record<string, number> = {
      'BTC-ETH': 16.5,
      'ETH-BTC': 0.06,
      'BTC-USDT': 68000,
      'USDT-BTC': 0.000015,
    };
    const rate = rates[`${params.from}-${params.to}`] || 1;
    return {
      rate,
      outputAmount: (parseFloat(params.amount) * rate).toFixed(8),
      fee: '0.3%',
    };
  });

  ipcMain.handle('swap:execute', async (_, params) => {
    // Mock implementation - in production, this would execute atomic swap
    return { success: true, txHash: '0x' + cryptoService.randomBytes(32) };
  });

  // Ghost mode handlers
  ipcMain.handle('ghost:activate', async (_, currencies: string[]) => {
    // Mock implementation - would convert all to XMR
    return { success: true, xmrAmount: '1.234' };
  });

  ipcMain.handle('ghost:estimateConversion', async (_, currencies: string[]) => {
    return { estimatedXmr: '1.234', fee: '0.003' };
  });

  // P2P Trade handlers
  ipcMain.handle('trade:getOffers', async (_, params) => {
    // Mock data
    return [];
  });

  ipcMain.handle('trade:createOffer', async (_, params) => {
    return { offerId: 'offer_' + Date.now() };
  });

  // Invoice handlers
  ipcMain.handle('invoice:create', async (_, params) => {
    const invoiceId = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    return { invoiceId, ...params };
  });

  ipcMain.handle('invoice:get', async (_, invoiceId: string) => {
    return { id: invoiceId, status: 'pending' };
  });

  ipcMain.handle('invoice:getAll', async () => {
    return [];
  });

  // QR Pay handlers
  ipcMain.handle('qrPay:generate', async (_, params) => {
    const address = await walletManager.getAddress(params.currency);
    return {
      qrData: `${params.currency.toLowerCase()}:${address}?amount=${params.amount}`,
      address,
    };
  });

  ipcMain.handle('qrPay:scan', async (_, qrData: string) => {
    // Parse QR data
    const [protocol, rest] = qrData.split(':');
    const [address, query] = rest.split('?');
    const params = new URLSearchParams(query);
    return {
      currency: protocol.toUpperCase(),
      address,
      amount: params.get('amount'),
      label: params.get('label'),
    };
  });

  // Settings handlers
  ipcMain.handle('settings:get', async (_, key: string) => {
    // Implementation would read from store
    return null;
  });

  ipcMain.handle('settings:set', async (_, key: string, value: any) => {
    // Implementation would write to store
    return true;
  });

  ipcMain.handle('settings:setNetwork', async (_, network: 'mainnet' | 'testnet') => {
    // Implementation would update network setting
    return true;
  });

  // Window handlers
  ipcMain.handle('window:minimize', async () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  ipcMain.handle('window:maximize', async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.handle('window:close', async () => {
    BrowserWindow.getFocusedWindow()?.close();
  });
}
