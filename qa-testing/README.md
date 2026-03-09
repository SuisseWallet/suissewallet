# QA Testing Documentation

Welcome to the Suisse Wallet QA Testing documentation. This folder contains all materials needed for quality assurance testing of the wallet application.

## 📁 Folder Structure

```
qa-testing/
├── README.md                    # This file
├── test-scenarios/              # Detailed test scenarios
│   ├── wallet-creation.md       # Wallet creation & import tests
│   ├── transactions.md          # Send/receive transaction tests
│   ├── swap.md                  # Atomic swap tests
│   ├── ghost-mode.md            # Ghost mode (Monero) tests
│   ├── p2p-trade.md             # P2P marketplace tests
│   ├── invoice.md               # Invoice feature tests
│   └── security.md              # Security feature tests
├── bug-reports/                 # Documented bugs
│   └── template.md              # Bug report template
├── templates/                   # Test documentation templates
│   ├── test-case-template.md    # Test case template
│   └── test-report-template.md  # Test report template
├── screenshots/                 # Evidence screenshots
└── logs/                        # Test execution logs
```

## 🚀 Getting Started

### Prerequisites

1. **Download Suisse Wallet** from [suissewallet.io](https://suissewallet.io)
2. **Install** on your machine (Windows or macOS)
3. **Switch to Testnet** in Settings → Network → Testnet

### Testnet Faucets

Get free test tokens for testing:

| Currency | Testnet | Faucet URL |
|----------|---------|------------|
| BTC | Testnet3 | [coinfaucet.eu](https://coinfaucet.eu/en/btc-testnet/) |
| ETH | Sepolia | [sepoliafaucet.com](https://sepoliafaucet.com/) |
| SOL | Devnet | [solfaucet.com](https://solfaucet.com/) |
| MATIC | Mumbai | [faucet.polygon.technology](https://faucet.polygon.technology/) |

## 📝 Test Scenarios Overview

### 1. Wallet Creation & Recovery
- Create new wallet
- Backup seed phrase
- Import existing wallet
- Password strength validation
- Self-destruct PIN setup

### 2. Transactions
- Send cryptocurrency
- Receive cryptocurrency
- Transaction history
- Fee estimation
- Address validation

### 3. Atomic Swap
- Get swap quote
- Execute swap
- Swap history
- Cross-chain swaps

### 4. Ghost Mode
- Activate Ghost Mode
- Convert assets to XMR
- Verify privacy

### 5. P2P Trade
- View offers
- Create offer
- Accept offer
- Complete trade
- Dispute handling

### 6. Invoice (v2.4)
- Create multi-currency invoice
- Share invoice
- Pay invoice
- Automatic conversion

### 7. Security
- Auto-lock
- Biometric auth
- Self-destruct PIN
- Encrypted storage

## 📊 Bug Report Format

When reporting bugs, use the following format:

```markdown
## Bug Title

**Severity:** Critical / High / Medium / Low
**Component:** [Wallet/Send/Swap/Ghost/Trade/Invoice]
**Environment:** 
- OS: Windows 11 / macOS 14
- App Version: 2.4.0
- Network: Testnet

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Result
What should happen

### Actual Result
What actually happened

### Screenshots
[Attach screenshots]

### Transaction Hash (if applicable)
`0x...`
```

## ✅ Checklist for QA Candidates

Before submitting your test report:

- [ ] Tested on correct network (testnet)
- [ ] Screenshots attached for all bugs
- [ ] Steps to reproduce are clear and numbered
- [ ] Expected vs actual results documented
- [ ] Environment details included
- [ ] Transaction hashes provided where applicable

## 📞 Support

Questions? Contact us via [Telegram](https://t.me/Suisse_Wallet).
