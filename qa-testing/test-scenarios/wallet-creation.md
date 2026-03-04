# Test Scenario: Wallet Creation & Import

## Overview
Test the wallet creation, seed phrase backup, and wallet import functionality.

---

## TC-001: Create New Wallet

**Priority:** Critical  
**Estimated Time:** 5 minutes

### Preconditions
- Fresh installation of Suisse Wallet
- No existing wallet

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Launch Suisse Wallet | Welcome screen displayed |
| 2 | Click "Create New Wallet" | Password creation screen |
| 3 | Enter password "TestPass123!" | Password accepted |
| 4 | Confirm password | Passwords match |
| 5 | Click "Create" | 24-word seed phrase displayed |
| 6 | Verify all 24 words are visible | All words numbered 1-24 |
| 7 | Click "I've saved my seed phrase" | Verification screen |
| 8 | Enter requested words correctly | Dashboard loads |

### Expected Final State
- Wallet created successfully
- Dashboard shows $0.00 balance
- All asset addresses generated

### Notes
- Seed phrase should be unique each time
- Password must meet complexity requirements

---

## TC-002: Weak Password Rejection

**Priority:** High  
**Estimated Time:** 2 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Create New Wallet | Password screen |
| 2 | Enter "123456" | Error: Password too weak |
| 3 | Enter "password" | Error: Password too common |
| 4 | Enter "Test1" | Error: Minimum 8 characters |
| 5 | Enter "TestPassword123!" | Password accepted |

---

## TC-003: Import Wallet from Seed Phrase

**Priority:** Critical  
**Estimated Time:** 5 minutes

### Preconditions
- Known 24-word seed phrase (use test seed)

### Test Seed Phrase (DO NOT USE FOR REAL FUNDS)
```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
```

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Launch Suisse Wallet | Welcome screen |
| 2 | Click "Import Existing Wallet" | Seed phrase input screen |
| 3 | Enter all 24 words | Words accepted |
| 4 | Enter new password | Password field active |
| 5 | Confirm password | Match confirmed |
| 6 | Click "Import" | Wallet importing... |
| 7 | Wait for sync | Dashboard loads |

### Expected Final State
- Wallet imported successfully
- Same addresses as original wallet
- Balances sync from blockchain

---

## TC-004: Invalid Seed Phrase Rejection

**Priority:** High  
**Estimated Time:** 2 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Import Wallet | Seed phrase input |
| 2 | Enter 12 words only | Error: 24 words required |
| 3 | Enter invalid word "xyz123" | Error: Invalid word |
| 4 | Enter valid seed with typo | Error: Invalid checksum |

---

## TC-005: Seed Phrase Backup Verification

**Priority:** Critical  
**Estimated Time:** 3 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create new wallet | Seed phrase displayed |
| 2 | Screenshot NOT allowed | Screenshot blocked or warning |
| 3 | Copy to clipboard blocked | Cannot copy text |
| 4 | Write down words manually | Only manual backup possible |
| 5 | Verification asks random words | Must know word #3, #12, #18 |
| 6 | Enter wrong word | Error: Incorrect word |
| 7 | Enter correct words | Wallet created |

---

## TC-006: Self-Destruct PIN Setup

**Priority:** High  
**Estimated Time:** 5 minutes

### Preconditions
- Wallet already created

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Settings → Security | Security settings |
| 2 | Enable Self-Destruct PIN | PIN setup screen |
| 3 | Enter PIN "000000" | PIN accepted |
| 4 | Set decoy balance | Balance input shown |
| 5 | Set decoy as 0.001 BTC | Saved |
| 6 | Lock wallet | Lock screen |
| 7 | Enter self-destruct PIN | Decoy wallet opens |
| 8 | Check balance | Shows 0.001 BTC only |
| 9 | Lock and enter real password | Real wallet opens |
| 10 | Check balance | Shows real balances |

### Notes
- Self-destruct PIN should show convincing decoy wallet
- Real assets should remain safe
- No indication that it's a decoy

---

## Results Template

```markdown
## Test Execution Results

**Tester:** [Name]
**Date:** [YYYY-MM-DD]
**App Version:** 2.4.0
**OS:** [Windows 11 / macOS 14]

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-001 | PASS/FAIL | |
| TC-002 | PASS/FAIL | |
| TC-003 | PASS/FAIL | |
| TC-004 | PASS/FAIL | |
| TC-005 | PASS/FAIL | |
| TC-006 | PASS/FAIL | |

### Bugs Found
[List any bugs with IDs]

### Screenshots
[Attach evidence]
```
