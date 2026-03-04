import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';

interface Balance {
  available: string;
  pending: string;
  usdValue: string;
}

const SOLANA_ENDPOINTS: Record<string, string> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.devnet.solana.com',
};

export class SolanaWallet {
  private connection: Connection;
  private keypair: Keypair;
  private networkType: 'mainnet' | 'testnet';

  constructor(seed: Buffer, networkType: 'mainnet' | 'testnet') {
    this.networkType = networkType;
    
    // Setup connection
    const endpoint = SOLANA_ENDPOINTS[networkType];
    this.connection = new Connection(endpoint, 'confirmed');

    // Derive Solana keypair from seed
    // Solana uses ed25519 curve with BIP44 derivation
    const path = "m/44'/501'/0'/0'"; // Standard Solana path
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    this.keypair = Keypair.fromSeed(derivedSeed);
  }

  getAddress(): string {
    return this.keypair.publicKey.toBase58();
  }

  async getBalance(): Promise<Balance> {
    try {
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      const available = (balance / LAMPORTS_PER_SOL).toFixed(9);
      
      const usdPrice = await this.getSolPrice();
      const usdValue = (parseFloat(available) * usdPrice).toFixed(2);

      return {
        available,
        pending: '0',
        usdValue,
      };
    } catch (error) {
      console.error('Failed to get SOL balance:', error);
      return { available: '0', pending: '0', usdValue: '0' };
    }
  }

  async send(to: string, amount: string, fee?: string): Promise<{ txHash: string }> {
    try {
      // Validate address
      const toPublicKey = new PublicKey(to);
      
      // Convert amount to lamports
      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

      // Create transfer instruction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.keypair.publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.keypair]
      );

      return { txHash: signature };
    } catch (error) {
      console.error('Failed to send SOL:', error);
      throw error;
    }
  }

  async estimateFee(to: string, amount: string): Promise<string> {
    try {
      const toPublicKey = new PublicKey(to);
      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.keypair.publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      // Get recent blockhash for fee calculation
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.keypair.publicKey;

      // Get fee for transaction
      const fee = await transaction.getEstimatedFee(this.connection);
      
      return fee ? (fee / LAMPORTS_PER_SOL).toFixed(9) : '0.000005';
    } catch (error) {
      console.error('Failed to estimate SOL fee:', error);
      return '0.000005'; // Default ~5000 lamports
    }
  }

  async getTransactionHistory(): Promise<any[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        this.keypair.publicKey,
        { limit: 50 }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });
          return {
            signature: sig.signature,
            slot: sig.slot,
            timestamp: sig.blockTime,
            status: sig.err ? 'failed' : 'confirmed',
            fee: tx?.meta?.fee ? (tx.meta.fee / LAMPORTS_PER_SOL).toFixed(9) : '0',
          };
        })
      );

      return transactions;
    } catch (error) {
      console.error('Failed to get SOL transaction history:', error);
      return [];
    }
  }

  /**
   * Request airdrop (testnet only)
   */
  async requestAirdrop(amount: number = 1): Promise<string> {
    if (this.networkType !== 'testnet') {
      throw new Error('Airdrop only available on testnet');
    }

    const signature = await this.connection.requestAirdrop(
      this.keypair.publicKey,
      amount * LAMPORTS_PER_SOL
    );

    await this.connection.confirmTransaction(signature);
    return signature;
  }

  private async getSolPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      const data = await response.json();
      return data.solana.usd;
    } catch {
      return 0;
    }
  }
}
