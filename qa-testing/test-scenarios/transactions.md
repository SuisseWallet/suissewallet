# Test Scenario: Send & Receive Transactions

## Overview
Test sending and receiving cryptocurrency across different networks.

---

## TC-101: Receive Cryptocurrency

**Priority:** Critical  
**Estimated Time:** 5 minutes

### Preconditions
- Wallet created and unlocked
- Testnet mode enabled

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Receive" on Dashboard | Receive screen opens |
| 2 | Select BTC | Bitcoin address & QR displayed |
| 3 | Verify address starts with "tb1" | Testnet address format |
| 4 | Click copy button | Address copied to clipboard |
| 5 | Switch to ETH | Ethereum address displayed |
| 6 | Verify address starts with "0x" | Valid ETH format |
| 7 | Generate QR code | QR contains address |
| 8 | Scan QR with another wallet | Address matches |

### Expected Final State
- Different address for each blockchain
- QR codes scannable and valid
- Copy function works correctly

---

## TC-102: Send Bitcoin (Testnet)

**Priority:** Critical  
**Estimated Time:** 10 minutes

### Preconditions
- Testnet BTC balance > 0.001 BTC
- Get testnet BTC from faucet first

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Send" on Dashboard | Send screen opens |
| 2 | Select BTC | BTC send form |
| 3 | Enter recipient: `tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx` | Address validated ✓ |
| 4 | Enter amount: 0.0001 | Amount accepted |
| 5 | View fee estimate | Fee shown (e.g., 0.00001 BTC) |
| 6 | Click "Review" | Transaction summary |
| 7 | Verify recipient, amount, fee | All correct |
| 8 | Click "Confirm" | Transaction broadcasting... |
| 9 | Wait for confirmation | Success with TX hash |
| 10 | Check transaction history | TX appears in history |

### Expected Final State
- Balance reduced by amount + fee
- Transaction visible in history
- TX hash can be verified on explorer

---

## TC-103: Send Ethereum (Sepolia Testnet)

**Priority:** Critical  
**Estimated Time:** 10 minutes

### Preconditions
- Sepolia ETH balance > 0.01 ETH

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Send" → Select ETH | ETH send form |
| 2 | Enter recipient: `0x742d35Cc6634C0532925a3b844Bc9e7595f6E123` | Address validated |
| 3 | Enter amount: 0.001 | Amount accepted |
| 4 | View gas estimate | Gas fee shown |
| 5 | Click "Review" | Summary screen |
| 6 | Click "Confirm" | Processing... |
| 7 | Wait for confirmation | Success + TX hash |
| 8 | Verify on Sepolia explorer | TX confirmed |

---

## TC-104: Send USDT (ERC-20)

**Priority:** High  
**Estimated Time:** 10 minutes

### Preconditions
- Testnet USDT balance > 10
- Sepolia ETH for gas > 0.01

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select USDT in Send | USDT send form |
| 2 | Enter recipient address | Address validated |
| 3 | Enter amount: 5 | Amount accepted |
| 4 | Note: requires ETH for gas | Gas fee shown in ETH |
| 5 | Confirm transaction | Token transfer success |

---

## TC-105: Invalid Address Rejection

**Priority:** High  
**Estimated Time:** 3 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Send BTC | BTC form |
| 2 | Enter ETH address "0x..." | Error: Invalid BTC address |
| 3 | Enter "invalid123" | Error: Invalid address |
| 4 | Enter empty address | Send button disabled |
| 5 | Enter own address | Warning: Sending to self |

---

## TC-106: Insufficient Balance Handling

**Priority:** High  
**Estimated Time:** 3 minutes

### Preconditions
- Balance: 0.001 BTC

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try to send 1 BTC | Error: Insufficient balance |
| 2 | Try to send 0.001 BTC (exact balance) | Error: Not enough for fee |
| 3 | Click "Max" button | Amount = balance - fee |

---

## TC-107: Transaction History

**Priority:** Medium  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Dashboard | TX history visible |
| 2 | Check incoming TX | Shows: amount, from, time |
| 3 | Check outgoing TX | Shows: amount, to, fee, time |
| 4 | Click on transaction | TX detail modal |
| 5 | Click "View on Explorer" | Opens block explorer |
| 6 | Verify TX hash matches | Same TX on explorer |

---

## TC-108: Fee Customization

**Priority:** Medium  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create BTC transaction | Fee options shown |
| 2 | Select "Slow" | Lower fee displayed |
| 3 | Select "Fast" | Higher fee displayed |
| 4 | Enter custom fee | Custom fee accepted |
| 5 | Set fee too low | Warning: May be slow |
| 6 | Set fee to 0 | Error: Fee required |

---

## TC-109: QR Code Payment

**Priority:** High  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "QR Pay" in Dashboard | QR scanner opens |
| 2 | Scan payment QR code | Payment details parsed |
| 3 | Verify: recipient, amount, currency | All correct |
| 4 | Click "Pay" | Transaction sent |

### QR Format Tested
```
bitcoin:tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx?amount=0.001&label=Test
```

---

## Results Template

```markdown
## Transaction Test Results

**Tester:** [Name]
**Date:** [YYYY-MM-DD]
**Network:** Testnet

| Test Case | Status | TX Hash | Notes |
|-----------|--------|---------|-------|
| TC-101 | PASS/FAIL | N/A | |
| TC-102 | PASS/FAIL | | |
| TC-103 | PASS/FAIL | | |
| TC-104 | PASS/FAIL | | |
| TC-105 | PASS/FAIL | N/A | |
| TC-106 | PASS/FAIL | N/A | |
| TC-107 | PASS/FAIL | | |
| TC-108 | PASS/FAIL | | |
| TC-109 | PASS/FAIL | | |

### Transaction Hashes for Verification
- TC-102: `[hash]`
- TC-103: `[hash]`
- TC-104: `[hash]`
```
