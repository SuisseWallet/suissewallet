import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';

interface Balance {
  available: string;
  pending: string;
  usdValue: string;
}

export class BitcoinWallet {
  private seed: Buffer;
  private network: bitcoin.Network;
  private derivationPath: string;
  private keyPair: any;
  private address: string;

  constructor(seed: Buffer, networkType: 'mainnet' | 'testnet') {
    this.seed = seed;
    this.network = networkType === 'mainnet' 
      ? bitcoin.networks.bitcoin 
      : bitcoin.networks.testnet;
    this.derivationPath = networkType === 'mainnet'
      ? "m/84'/0'/0'/0/0"  // BIP84 for native segwit
      : "m/84'/1'/0'/0/0";
    
    this.initializeKeyPair();
  }

  private initializeKeyPair(): void {
    const root = bip32.BIP32Factory(require('tiny-secp256k1')).fromSeed(
      this.seed,
      this.network
    );
    const child = root.derivePath(this.derivationPath);
    this.keyPair = child;
    
    // Generate native segwit address (bc1...)
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: this.network,
    });
    
    this.address = address!;
  }

  getAddress(): string {
    return this.address;
  }

  async getBalance(): Promise<Balance> {
    try {
      // In production, query blockchain API (Blockstream, Mempool, etc.)
      const apiUrl = this.network === bitcoin.networks.bitcoin
        ? `https://blockstream.info/api/address/${this.address}`
        : `https://blockstream.info/testnet/api/address/${this.address}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;

      // Convert satoshis to BTC
      const availableBtc = (confirmed / 100000000).toFixed(8);
      const pendingBtc = (unconfirmed / 100000000).toFixed(8);

      // Get USD value (in production, use price API)
      const usdPrice = await this.getBtcPrice();
      const usdValue = (parseFloat(availableBtc) * usdPrice).toFixed(2);

      return {
        available: availableBtc,
        pending: pendingBtc,
        usdValue,
      };
    } catch (error) {
      console.error('Failed to get BTC balance:', error);
      return { available: '0', pending: '0', usdValue: '0' };
    }
  }

  async send(to: string, amount: string, fee?: string): Promise<{ txHash: string }> {
    try {
      // Validate address
      bitcoin.address.toOutputScript(to, this.network);

      // Build transaction
      const psbt = new bitcoin.Psbt({ network: this.network });
      
      // Get UTXOs (in production, query blockchain API)
      const utxos = await this.getUtxos();
      
      const amountSats = Math.floor(parseFloat(amount) * 100000000);
      const feeSats = fee ? Math.floor(parseFloat(fee) * 100000000) : 1000; // Default fee

      let inputSum = 0;
      for (const utxo of utxos) {
        if (inputSum >= amountSats + feeSats) break;
        
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          witnessUtxo: {
            script: bitcoin.address.toOutputScript(this.address, this.network),
            value: utxo.value,
          },
        });
        inputSum += utxo.value;
      }

      if (inputSum < amountSats + feeSats) {
        throw new Error('Insufficient balance');
      }

      // Add output to recipient
      psbt.addOutput({
        address: to,
        value: amountSats,
      });

      // Add change output if needed
      const change = inputSum - amountSats - feeSats;
      if (change > 546) { // Dust threshold
        psbt.addOutput({
          address: this.address,
          value: change,
        });
      }

      // Sign all inputs
      psbt.signAllInputs(this.keyPair);
      psbt.finalizeAllInputs();

      // Get raw transaction
      const tx = psbt.extractTransaction();
      const txHex = tx.toHex();

      // Broadcast (in production, use blockchain API)
      const txHash = await this.broadcastTransaction(txHex);

      return { txHash };
    } catch (error) {
      console.error('Failed to send BTC:', error);
      throw error;
    }
  }

  private async getUtxos(): Promise<Array<{ txid: string; vout: number; value: number }>> {
    const apiUrl = this.network === bitcoin.networks.bitcoin
      ? `https://blockstream.info/api/address/${this.address}/utxo`
      : `https://blockstream.info/testnet/api/address/${this.address}/utxo`;

    const response = await fetch(apiUrl);
    return response.json();
  }

  private async broadcastTransaction(txHex: string): Promise<string> {
    const apiUrl = this.network === bitcoin.networks.bitcoin
      ? 'https://blockstream.info/api/tx'
      : 'https://blockstream.info/testnet/api/tx';

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: txHex,
    });

    if (!response.ok) {
      throw new Error('Failed to broadcast transaction');
    }

    return response.text(); // Returns txid
  }

  private async getBtcPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const data = await response.json();
      return data.bitcoin.usd;
    } catch {
      return 0;
    }
  }

  // Estimate transaction fee
  async estimateFee(to: string, amount: string): Promise<string> {
    try {
      // Get fee rate (satoshis per vbyte)
      const response = await fetch('https://mempool.space/api/v1/fees/recommended');
      const fees = await response.json();
      
      // Estimate transaction size (1 input, 2 outputs = ~140 vbytes for segwit)
      const estimatedSize = 140;
      const feeSats = estimatedSize * fees.halfHourFee;
      
      return (feeSats / 100000000).toFixed(8);
    } catch {
      return '0.00001'; // Default fallback
    }
  }
}
