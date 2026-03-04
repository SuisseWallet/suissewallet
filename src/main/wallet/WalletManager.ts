import Store from 'electron-store';
import * as bip39 from 'bip39';
import { CryptoService } from '../crypto/CryptoService';
import { BitcoinWallet } from './chains/BitcoinWallet';
import { EthereumWallet } from './chains/EthereumWallet';
import { MoneroWallet } from './chains/MoneroWallet';
import { SolanaWallet } from './chains/SolanaWallet';

interface WalletData {
  encryptedSeed: string;
  salt: string;
  iv: string;
  createdAt: number;
}

interface Balance {
  available: string;
  pending: string;
  usdValue: string;
}

export class WalletManager {
  private store: Store;
  private cryptoService: CryptoService;
  private isUnlocked: boolean = false;
  private decryptedSeed: string | null = null;
  private wallets: Map<string, any> = new Map();
  private autoLockTimer: NodeJS.Timeout | null = null;

  // Supported chains
  private readonly supportedCurrencies = [
    'BTC', 'ETH', 'USDT', 'XMR', 'SOL', 
    'BNB', 'ADA', 'XRP', 'LTC', 'AVAX', 
    'MATIC', 'TRX'
  ];

  constructor(store: Store, cryptoService: CryptoService) {
    this.store = store;
    this.cryptoService = cryptoService;
  }

  async createWallet(password: string): Promise<{ success: boolean; seedPhrase?: string }> {
    try {
      // Generate 24-word seed phrase (256 bits of entropy)
      const seedPhrase = bip39.generateMnemonic(256);
      
      // Encrypt and store
      const { encrypted, salt, iv } = await this.cryptoService.encrypt(seedPhrase, password);
      
      const walletData: WalletData = {
        encryptedSeed: encrypted,
        salt,
        iv,
        createdAt: Date.now(),
      };

      this.store.set('wallet', walletData);
      
      // Auto-unlock after creation
      this.decryptedSeed = seedPhrase;
      this.isUnlocked = true;
      await this.initializeWallets();
      this.startAutoLockTimer();

      return { success: true, seedPhrase };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      return { success: false };
    }
  }

  async importWallet(seedPhrase: string, password: string): Promise<{ success: boolean }> {
    try {
      // Validate seed phrase
      if (!bip39.validateMnemonic(seedPhrase)) {
        throw new Error('Invalid seed phrase');
      }

      // Encrypt and store
      const { encrypted, salt, iv } = await this.cryptoService.encrypt(seedPhrase, password);
      
      const walletData: WalletData = {
        encryptedSeed: encrypted,
        salt,
        iv,
        createdAt: Date.now(),
      };

      this.store.set('wallet', walletData);
      
      // Auto-unlock after import
      this.decryptedSeed = seedPhrase;
      this.isUnlocked = true;
      await this.initializeWallets();
      this.startAutoLockTimer();

      return { success: true };
    } catch (error) {
      console.error('Failed to import wallet:', error);
      return { success: false };
    }
  }

  async unlock(password: string): Promise<{ success: boolean }> {
    try {
      const walletData = this.store.get('wallet') as WalletData;
      if (!walletData) {
        throw new Error('No wallet found');
      }

      // Check for self-destruct PIN
      const selfDestructPin = this.store.get('selfDestructPin') as string;
      if (selfDestructPin && password === selfDestructPin) {
        // Return decoy wallet
        this.isUnlocked = true;
        this.decryptedSeed = 'decoy';
        await this.initializeDecoyWallets();
        return { success: true };
      }

      // Normal unlock
      const seedPhrase = await this.cryptoService.decrypt(
        walletData.encryptedSeed,
        password,
        walletData.salt,
        walletData.iv
      );

      this.decryptedSeed = seedPhrase;
      this.isUnlocked = true;
      await this.initializeWallets();
      this.startAutoLockTimer();

      return { success: true };
    } catch (error) {
      console.error('Failed to unlock wallet:', error);
      return { success: false };
    }
  }

  lock(): void {
    this.isUnlocked = false;
    this.decryptedSeed = null;
    this.wallets.clear();
    this.stopAutoLockTimer();
    
    // Clear sensitive data from memory
    if (global.gc) {
      global.gc();
    }
  }

  async getBalance(currency: string): Promise<Balance> {
    if (!this.isUnlocked) {
      throw new Error('Wallet is locked');
    }

    const wallet = this.wallets.get(currency);
    if (!wallet) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return wallet.getBalance();
  }

  async getBalances(): Promise<Record<string, Balance>> {
    if (!this.isUnlocked) {
      throw new Error('Wallet is locked');
    }

    const balances: Record<string, Balance> = {};
    
    for (const [currency, wallet] of this.wallets) {
      try {
        balances[currency] = await wallet.getBalance();
      } catch (error) {
        console.error(`Failed to get balance for ${currency}:`, error);
        balances[currency] = { available: '0', pending: '0', usdValue: '0' };
      }
    }

    return balances;
  }

  async getAddress(currency: string): Promise<string> {
    if (!this.isUnlocked) {
      throw new Error('Wallet is locked');
    }

    const wallet = this.wallets.get(currency);
    if (!wallet) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return wallet.getAddress();
  }

  async send(params: {
    currency: string;
    to: string;
    amount: string;
    fee?: string;
  }): Promise<{ txHash: string }> {
    if (!this.isUnlocked) {
      throw new Error('Wallet is locked');
    }

    const wallet = this.wallets.get(params.currency);
    if (!wallet) {
      throw new Error(`Unsupported currency: ${params.currency}`);
    }

    return wallet.send(params.to, params.amount, params.fee);
  }

  walletExists(): boolean {
    return this.store.has('wallet');
  }

  getIsLocked(): boolean {
    return !this.isUnlocked;
  }

  clearSensitiveData(): void {
    this.lock();
    this.store.delete('wallet');
    this.store.delete('selfDestructPin');
  }

  private async initializeWallets(): Promise<void> {
    if (!this.decryptedSeed || this.decryptedSeed === 'decoy') {
      return;
    }

    const seed = await bip39.mnemonicToSeed(this.decryptedSeed);
    const network = this.store.get('network', 'mainnet') as 'mainnet' | 'testnet';

    // Initialize chain-specific wallets
    this.wallets.set('BTC', new BitcoinWallet(seed, network));
    this.wallets.set('ETH', new EthereumWallet(seed, network));
    this.wallets.set('USDT', new EthereumWallet(seed, network, 'USDT')); // ERC-20
    this.wallets.set('XMR', new MoneroWallet(seed, network));
    this.wallets.set('SOL', new SolanaWallet(seed, network));
    // Add more wallets as needed...
  }

  private async initializeDecoyWallets(): Promise<void> {
    // Initialize with fake/decoy balances
    const decoyBalances = this.store.get('decoyBalances', {}) as Record<string, string>;
    // Implementation for decoy wallets...
  }

  private startAutoLockTimer(): void {
    const timeout = this.store.get('autoLockTimeout', 5 * 60 * 1000) as number; // Default 5 min
    
    this.stopAutoLockTimer();
    this.autoLockTimer = setTimeout(() => {
      this.lock();
    }, timeout);
  }

  private stopAutoLockTimer(): void {
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
      this.autoLockTimer = null;
    }
  }

  resetAutoLockTimer(): void {
    if (this.isUnlocked) {
      this.startAutoLockTimer();
    }
  }
}
