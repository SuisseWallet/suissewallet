# Test Scenario: Ghost Mode (Monero Conversion)

## Overview
Test the Ghost Mode feature which converts all visible assets to Monero (XMR) for maximum privacy.

---

## TC-301: View Ghost Mode Information

**Priority:** Medium  
**Estimated Time:** 3 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Ghost" in navigation | Ghost Mode screen |
| 2 | Read information text | Privacy explanation displayed |
| 3 | View "What is Ghost Mode?" | Explains XMR conversion |
| 4 | View privacy benefits | Lists: untraceable, no history |

---

## TC-302: Estimate Ghost Mode Conversion

**Priority:** High  
**Estimated Time:** 5 minutes

### Preconditions
- Testnet balances:
  - BTC: 0.001
  - ETH: 0.01
  - USDT: 10

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Ghost Mode | Current balances shown |
| 2 | View "VISIBLE BALANCE" | Total USD value displayed |
| 3 | View each asset listed | BTC, ETH, USDT amounts |
| 4 | Click "Estimate Conversion" | XMR amount calculated |
| 5 | View conversion rates | Shows BTC→XMR, ETH→XMR rates |
| 6 | View total XMR output | Estimated XMR amount |
| 7 | View fees breakdown | Swap fees shown |

### Expected Output Example
```
VISIBLE BALANCE: $150.00

Assets to convert:
├── 0.001 BTC → 0.045 XMR
├── 0.01 ETH  → 0.082 XMR
└── 10 USDT   → 0.055 XMR

Total: ~0.182 XMR
Fee: ~0.3% (0.00055 XMR)
You receive: ~0.181 XMR
```

---

## TC-303: Activate Ghost Mode (Full Conversion)

**Priority:** Critical  
**Estimated Time:** 15 minutes

### Preconditions
- Testnet mode enabled
- Balances in multiple currencies

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Ghost Mode | Conversion screen |
| 2 | Select all assets | All checkboxes checked |
| 3 | Click "Go Ghost" | Confirmation modal |
| 4 | Read warning message | Warns about irreversibility |
| 5 | Enter password to confirm | Password accepted |
| 6 | Click "Activate Ghost Mode" | Conversion starts |
| 7 | Watch progress indicator | Shows each swap progress |
| 8 | Wait for completion | All swaps complete |
| 9 | View final XMR balance | XMR amount shown |
| 10 | Check other balances | All converted to 0 |

### Expected Final State
- All previous balances = 0
- XMR balance = sum of conversions
- No trace on public blockchains

---

## TC-304: Partial Ghost Mode

**Priority:** High  
**Estimated Time:** 10 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Ghost Mode | Asset list shown |
| 2 | Uncheck BTC | BTC excluded |
| 3 | Keep ETH and USDT checked | Partial conversion |
| 4 | Click "Go Ghost" | Only selected assets convert |
| 5 | After completion | BTC remains, others → XMR |

---

## TC-305: Ghost Mode with Insufficient Balance

**Priority:** Medium  
**Estimated Time:** 3 minutes

### Preconditions
- Very low balance (e.g., 0.00001 BTC)

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Ghost Mode | Conversion estimate |
| 2 | View warning | "Balance too low for swap" |
| 3 | Try to activate | Error: Minimum amount required |

---

## TC-306: Cancel Ghost Mode Mid-Process

**Priority:** Medium  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Start Ghost Mode | Conversion begins |
| 2 | Click "Cancel" during first swap | Warning: Some swaps may complete |
| 3 | Confirm cancel | Process stops |
| 4 | Check balances | Partial conversion (some XMR, some original) |

---

## TC-307: Verify Privacy After Ghost Mode

**Priority:** Critical  
**Estimated Time:** 10 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete Ghost Mode conversion | All assets now XMR |
| 2 | Note XMR address | Address saved |
| 3 | Go to Monero block explorer | Search page |
| 4 | Search for address | No balance/history visible |
| 5 | Try to track incoming TX | TX details hidden |
| 6 | Verify ring signatures | Cannot identify sender |

### Privacy Verification
- [ ] Address doesn't reveal balance
- [ ] Transaction amounts hidden
- [ ] Sender addresses hidden
- [ ] No link to original BTC/ETH addresses

---

## TC-308: XMR Subaddress Generation

**Priority:** Medium  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | After Ghost Mode, go to Receive | XMR receive screen |
| 2 | Note current address | Primary address |
| 3 | Click "Generate New Address" | New subaddress created |
| 4 | Verify different from primary | Unique subaddress |
| 5 | Both addresses receive to same wallet | Confirmed |

---

## Security & Privacy Notes

### What Ghost Mode Does:
1. Executes atomic swaps for each asset → XMR
2. Uses decentralized exchanges (no KYC)
3. Breaks blockchain trail at swap point
4. XMR provides forward privacy (ring signatures)

### What Ghost Mode Does NOT Do:
- Erase historical transactions (already on blockchain)
- Hide the fact you made swaps (visible on BTC/ETH side)
- Protect against already-compromised keys

### Best Practices After Ghost Mode:
1. Use new XMR subaddress for each transaction
2. Wait for confirmations before spending
3. Don't convert back to BTC/ETH from same wallet

---

## Results Template

```markdown
## Ghost Mode Test Results

**Tester:** [Name]
**Date:** [YYYY-MM-DD]
**Initial Balances:**
- BTC: [amount]
- ETH: [amount]
- USDT: [amount]

**Final XMR Balance:** [amount]

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-301 | PASS/FAIL | |
| TC-302 | PASS/FAIL | |
| TC-303 | PASS/FAIL | |
| TC-304 | PASS/FAIL | |
| TC-305 | PASS/FAIL | |
| TC-306 | PASS/FAIL | |
| TC-307 | PASS/FAIL | |
| TC-308 | PASS/FAIL | |

### Privacy Verification Checklist
- [ ] No balance visible on block explorer
- [ ] Transaction amounts hidden
- [ ] Ring signatures working
- [ ] Subaddresses generated correctly
```
