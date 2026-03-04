import { ethers, HDNodeWallet } from 'ethers';

interface Balance {
  available: string;
  pending: string;
  usdValue: string;
}

// ERC-20 token addresses
const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  mainnet: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6B175474E89094C44Da98b954EesidaFCd1F62',
  },
  testnet: {
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // Sepolia USDT
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  },
};

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export class EthereumWallet {
  private wallet: HDNodeWallet;
  private provider: ethers.JsonRpcProvider;
  private networkType: 'mainnet' | 'testnet';
  private tokenSymbol?: string;
  private tokenContract?: ethers.Contract;

  constructor(
    seed: Buffer,
    networkType: 'mainnet' | 'testnet',
    tokenSymbol?: string
  ) {
    this.networkType = networkType;
    this.tokenSymbol = tokenSymbol;

    // Setup provider
    const rpcUrl = networkType === 'mainnet'
      ? process.env.ETH_MAINNET_RPC || 'https://eth.llamarpc.com'
      : process.env.ETH_TESTNET_RPC || 'https://rpc.sepolia.org';
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Derive wallet from seed
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const path = "m/44'/60'/0'/0/0"; // Standard Ethereum derivation path
    this.wallet = hdNode.derivePath(path).connect(this.provider);

    // Initialize token contract if needed
    if (tokenSymbol && tokenSymbol !== 'ETH') {
      const tokenAddress = TOKEN_ADDRESSES[networkType]?.[tokenSymbol];
      if (tokenAddress) {
        this.tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20_ABI,
          this.wallet
        );
      }
    }
  }

  getAddress(): string {
    return this.wallet.address;
  }

  async getBalance(): Promise<Balance> {
    try {
      let available: string;
      let usdPrice: number;

      if (this.tokenContract && this.tokenSymbol) {
        // Get ERC-20 token balance
        const decimals = await this.tokenContract.decimals();
        const balance = await this.tokenContract.balanceOf(this.wallet.address);
        available = ethers.formatUnits(balance, decimals);
        
        // Get token price
        usdPrice = await this.getTokenPrice(this.tokenSymbol);
      } else {
        // Get ETH balance
        const balance = await this.provider.getBalance(this.wallet.address);
        available = ethers.formatEther(balance);
        usdPrice = await this.getTokenPrice('ETH');
      }

      const usdValue = (parseFloat(available) * usdPrice).toFixed(2);

      return {
        available,
        pending: '0', // Ethereum doesn't have pending balance concept
        usdValue,
      };
    } catch (error) {
      console.error('Failed to get ETH/token balance:', error);
      return { available: '0', pending: '0', usdValue: '0' };
    }
  }

  async send(to: string, amount: string, fee?: string): Promise<{ txHash: string }> {
    try {
      // Validate address
      if (!ethers.isAddress(to)) {
        throw new Error('Invalid Ethereum address');
      }

      let tx: ethers.TransactionResponse;

      if (this.tokenContract && this.tokenSymbol) {
        // Send ERC-20 token
        const decimals = await this.tokenContract.decimals();
        const amountWei = ethers.parseUnits(amount, decimals);
        
        tx = await this.tokenContract.transfer(to, amountWei, {
          gasLimit: 100000,
        });
      } else {
        // Send ETH
        const amountWei = ethers.parseEther(amount);
        
        tx = await this.wallet.sendTransaction({
          to,
          value: amountWei,
          gasLimit: 21000,
        });
      }

      // Wait for confirmation
      const receipt = await tx.wait();
      
      return { txHash: receipt!.hash };
    } catch (error) {
      console.error('Failed to send ETH/token:', error);
      throw error;
    }
  }

  async estimateFee(to: string, amount: string): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      
      let gasLimit: bigint;
      
      if (this.tokenContract) {
        // ERC-20 transfer typically uses ~65000 gas
        gasLimit = BigInt(65000);
      } else {
        // ETH transfer uses 21000 gas
        gasLimit = BigInt(21000);
      }

      const fee = gasPrice * gasLimit;
      return ethers.formatEther(fee);
    } catch (error) {
      console.error('Failed to estimate fee:', error);
      return '0.001'; // Fallback
    }
  }

  async getTransactionHistory(): Promise<any[]> {
    // In production, use Etherscan API or similar
    try {
      const apiKey = process.env.ETHERSCAN_API_KEY || '';
      const baseUrl = this.networkType === 'mainnet'
        ? 'https://api.etherscan.io/api'
        : 'https://api-sepolia.etherscan.io/api';

      const url = `${baseUrl}?module=account&action=txlist&address=${this.wallet.address}&sort=desc&apikey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.result || [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  private async getTokenPrice(symbol: string): Promise<number> {
    try {
      const ids: Record<string, string> = {
        ETH: 'ethereum',
        USDT: 'tether',
        USDC: 'usd-coin',
        DAI: 'dai',
      };

      const id = ids[symbol] || symbol.toLowerCase();
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
      );
      const data = await response.json();
      return data[id]?.usd || 0;
    } catch {
      // Stablecoins default to $1
      if (['USDT', 'USDC', 'DAI'].includes(symbol)) {
        return 1;
      }
      return 0;
    }
  }

  // Get connected wallet for signing
  getWallet(): HDNodeWallet {
    return this.wallet;
  }
}
