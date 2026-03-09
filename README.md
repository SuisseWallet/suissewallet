# Suisse Wallet

<p align="center">
  <img src="logo.png" alt="Suisse Wallet Logo" width="120"/>
</p>

<p align="center">
  <strong>Your Money. Your Rules. Swiss Protection.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#development">Development</a> •
  <a href="#testing">Testing</a> •
  <a href="#security">Security</a>
</p>

---

## Overview

Suisse Wallet is a non-custodial cryptocurrency wallet with Swiss-grade security. Built for privacy, speed, and simplicity.

**Current Version:** 2.4

### What's New in v2.4
- Multi-currency invoice support
- Clients can pay in BTC, ETH, XMR, or SOL
- Automatic conversion via atomic swap at invoice confirmation

---

## Features

| Feature | Description |
|---------|-------------|
| **/Pay** | QR payments at retail stores. Scan and pay instantly. |
| **/Trade** | Built-in P2P marketplace. No middlemen, no KYC, no limits. |
| **/Ghost** | One-click conversion to Monero (XMR). Disappear from public blockchain. |
| **/Swap** | Atomic swaps for trustless crypto-to-crypto exchange. |
| **/Invoice** | Professional crypto invoices with multi-currency support. |

### Supported Cryptocurrencies

| Currency | Symbol | Network |
|----------|--------|---------|
| Bitcoin | BTC | Bitcoin Mainnet |
| Ethereum | ETH | Ethereum |
| Monero | XMR | Monero |
| Solana | SOL | Solana |

---

## Installation

### Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/SuisseWallet/suissewallet.git
cd suissewallet

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package:win    # Windows
npm run package:mac    # macOS
```

### Download Pre-built

Download the latest release from [suissewallet.io](https://suissewallet.io):
- **Windows:** SuisseWallet-2.4.0-Setup.exe
- **macOS:** SuisseWallet-2.4.0.dmg

---

## Development

### Project Structure

```
suissewallet/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts          # Main entry point
│   │   ├── ipc/              # IPC handlers
│   │   ├── wallet/           # Wallet core logic
│   │   ├── crypto/           # Cryptographic functions
│   │   └── services/         # Background services
│   │
│   └── renderer/             # React frontend
│       ├── components/       # Reusable UI components
│       ├── pages/            # Application pages
│       ├── hooks/            # Custom React hooks
│       ├── utils/            # Utility functions
│       ├── styles/           # Global styles
│       └── assets/           # Images, fonts, icons
│
├── public/                   # Static assets
├── scripts/                  # Build scripts
├── qa-testing/               # QA testing documentation
└── package.json
```

### Tech Stack

- **Framework:** Electron 28.x
- **Frontend:** React 18 + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Crypto Libraries:** 
  - bitcoinjs-lib
  - ethers.js
  - @solana/web3.js
  - monero-javascript
- **Security:** AES-256-GCM encryption, Argon2 key derivation

### Environment Variables

Create `.env` file in root:

```env
# Network Mode
VITE_NETWORK_MODE=mainnet  # mainnet | testnet

# Testnet RPCs (for development)
VITE_ETH_TESTNET_RPC=https://sepolia.infura.io/v3/YOUR_KEY
VITE_BTC_TESTNET=true
```

---

## Testing

### Testnet Configuration

For development and QA testing, use these testnet networks:

| Currency | Testnet | Faucet |
|----------|---------|--------|
| BTC | Testnet3 | [coinfaucet.eu](https://coinfaucet.eu/en/btc-testnet/) |
| ETH | Sepolia | [sepoliafaucet.com](https://sepoliafaucet.com/) |
| SOL | Devnet | [solfaucet.com](https://solfaucet.com/) |

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### QA Testing

See [qa-testing/](qa-testing/) folder for:
- Test scenarios and checklists
- Bug report templates
- Testing guidelines

---

## Security

### Non-Custodial Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S DEVICE                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  SUISSE WALLET                        │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │     PRIVATE KEYS (AES-256 encrypted)           │  │  │
│  │  │     Never leave this device                     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │   BLOCKCHAIN NETWORKS        │
              │   (Direct connection)        │
              └──────────────────────────────┘

         ⚠️  NO CENTRAL SERVER HAS ACCESS TO YOUR KEYS
```

### Security Features

| Feature | Description |
|---------|-------------|
| **AES-256 Encryption** | All sensitive data encrypted at rest |
| **Local Key Storage** | Private keys never leave your device |
| **Auto-Lock** | Configurable timeout |
| **Secure Memory** | Keys cleared from RAM after use |

### Backup & Recovery

- **24-word seed phrase** (BIP-39)

---

## Fees

| Action | Fee |
|--------|-----|
| Send/Receive | Network fee only |
| Swap | 0.3% |
| P2P Trade (seller) | 0.5% |
| Ghost Mode | 0.5% |
| Invoice | Free |

*Network fees (gas) are separate and paid to miners/validators.*

---

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## Support

- **Website:** [suissewallet.io](https://suissewallet.io)
- **Twitter:** [@suissewallet](https://x.com/suissewallet)
- **Telegram:** [t.me/Suisse_Wallet](https://t.me/Suisse_Wallet)
- **Docs:** [GitBook](https://suisse-wallet.gitbook.io/docs)

---

<p align="center">
  <sub>Built with 🔒 in Switzerland</sub>
</p>
