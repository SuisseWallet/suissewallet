# Suisse Wallet - Testnet Configuration

## Network Settings

To enable testnet mode:
1. Open Settings → Network
2. Toggle "Testnet Mode" ON
3. Restart the application

## Testnet Endpoints

| Currency | Network | RPC Endpoint |
|----------|---------|--------------|
| BTC | Testnet3 | Blockstream API |
| ETH | Sepolia | https://rpc.sepolia.org |
| SOL | Devnet | https://api.devnet.solana.com |
| MATIC | Mumbai | https://rpc-mumbai.maticvigil.com |
| XMR | Stagenet | https://stagenet.xmr.ditatompel.com |

## Getting Testnet Funds

### Bitcoin Testnet (tBTC)
1. Go to [coinfaucet.eu](https://coinfaucet.eu/en/btc-testnet/)
2. Enter your testnet address (starts with `tb1...`)
3. Receive 0.01 tBTC

### Ethereum Sepolia (sETH)
1. Go to [sepoliafaucet.com](https://sepoliafaucet.com/)
2. Login with Alchemy account
3. Enter your address (starts with `0x...`)
4. Receive 0.5 sETH

### Solana Devnet (SOL)
1. Go to [solfaucet.com](https://solfaucet.com/)
2. Enter your Solana address
3. Receive 1 SOL

### Polygon Mumbai (MATIC)
1. Go to [faucet.polygon.technology](https://faucet.polygon.technology/)
2. Select Mumbai testnet
3. Enter address and receive MATIC

## Testnet Block Explorers

| Currency | Explorer URL |
|----------|-------------|
| BTC | https://blockstream.info/testnet |
| ETH | https://sepolia.etherscan.io |
| SOL | https://explorer.solana.com/?cluster=devnet |
| MATIC | https://mumbai.polygonscan.com |

## Environment Variables

Create `.env.local` file:

```env
VITE_NETWORK_MODE=testnet
VITE_ETH_RPC=https://rpc.sepolia.org
VITE_BTC_TESTNET=true
VITE_SOL_CLUSTER=devnet
```

## Notes

- Testnet funds have NO real value
- Transactions may be slower than mainnet
- Faucets have daily limits
- Some features may behave differently on testnet
