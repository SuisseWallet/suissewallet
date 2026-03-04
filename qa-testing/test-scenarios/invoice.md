# Test Scenario: Multi-Currency Invoice (v2.4)

## Overview
Test the invoice feature introduced in version 2.4 that allows creating invoices accepting multiple cryptocurrencies simultaneously.

---

## TC-501: Create Basic Invoice

**Priority:** Critical  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Invoice" in navigation | Invoice list screen |
| 2 | Click "+ New Invoice" | Invoice creation form |
| 3 | Enter amount: 5000 | Amount field accepts number |
| 4 | Select currency: CHF | Fiat currency selected |
| 5 | Enter description: "Q1 Consulting" | Description saved |
| 6 | Enter client: "Acme Corp" | Client name saved |
| 7 | Click "Create Invoice" | Invoice created |

### Expected Output
- Invoice ID generated (e.g., INV-2024-0893)
- Status: Pending
- Invoice detail page shown

---

## TC-502: Multi-Currency Payment Options

**Priority:** Critical  
**Estimated Time:** 5 minutes

### Preconditions
- Invoice created for CHF 5,000

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View created invoice | Invoice detail page |
| 2 | Check "Payment Options" section | Multiple currencies shown |
| 3 | Verify BTC amount | e.g., 0.058 BTC (real-time rate) |
| 4 | Verify ETH amount | e.g., 1.54 ETH |
| 5 | Verify USDT amount | 5,000 USDT (1:1 with CHF) |
| 6 | Verify XMR amount | e.g., 18.2 XMR |
| 7 | Refresh page | Amounts update with new rates |

### Expected Display
```
PAYMENT OPTIONS

Client can pay with any of these:
🔶 0.058 BTC  ($4,980 at current rate)
🔶 1.54 ETH   ($5,012 at current rate)
🔶 5,000 USDT ($5,000)
🔶 18.2 XMR   ($4,995 at current rate)

Rate locked for: 15:00 minutes
```

---

## TC-503: Select Receiving Currency

**Priority:** High  
**Estimated Time:** 3 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create invoice | Invoice form |
| 2 | Set "I want to receive": USDT | USDT selected |
| 3 | Client pays with BTC | BTC converted to USDT |
| 4 | Check received amount | USDT in wallet |

### Conversion Flow
```
Client pays: 0.058 BTC
     ↓ (Atomic Swap)
You receive: ~4,980 USDT
```

---

## TC-504: Share Invoice

**Priority:** High  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View invoice detail | Share options shown |
| 2 | Click "Copy Link" | Link copied to clipboard |
| 3 | Open link in browser | Invoice payment page |
| 4 | Click "Download PDF" | PDF generated |
| 5 | Check PDF contents | Invoice details correct |
| 6 | Click "Send via Email" | Email compose opens |

### Invoice Link Format
```
https://pay.suissewallet.io/inv/INV-2024-0893
```

---

## TC-505: Pay Invoice (Client Perspective)

**Priority:** Critical  
**Estimated Time:** 10 minutes

### Preconditions
- Invoice link received
- Client has testnet crypto

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open invoice link | Payment page loads |
| 2 | View invoice details | Amount, description shown |
| 3 | Select payment currency: BTC | BTC amount displayed |
| 4 | View BTC address | Address + QR shown |
| 5 | Send BTC from another wallet | Transaction sent |
| 6 | Wait for confirmation | "Payment Received" status |
| 7 | View conversion | BTC → Seller's preferred currency |

### Payment Page UI
```
┌─────────────────────────────────────┐
│       INVOICE #INV-2024-0893        │
├─────────────────────────────────────┤
│  Amount: CHF 5,000                  │
│  Client: Acme Corp                  │
│  Description: Q1 Consulting         │
├─────────────────────────────────────┤
│  PAY WITH:                          │
│  [BTC] [ETH] [USDT] [XMR]          │
├─────────────────────────────────────┤
│  Send exactly: 0.058 BTC            │
│  To: tb1q...xyz                     │
│  [QR CODE]                          │
│                                     │
│  Rate valid for: 14:32              │
└─────────────────────────────────────┘
```

---

## TC-506: Invoice Expiration & Rate Lock

**Priority:** High  
**Estimated Time:** 20 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create invoice | Rate locked timestamp shown |
| 2 | Note BTC amount | e.g., 0.058 BTC |
| 3 | Wait 15 minutes | Rate expires |
| 4 | Refresh invoice | New rates calculated |
| 5 | New BTC amount different | Rate changed |
| 6 | Client refreshes payment page | Updated amounts shown |

---

## TC-507: Partial Payment Handling

**Priority:** Medium  
**Estimated Time:** 10 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Invoice requires 0.058 BTC | Full amount shown |
| 2 | Client sends 0.030 BTC | Partial payment received |
| 3 | Invoice status | "Partially Paid" |
| 4 | View remaining amount | 0.028 BTC remaining |
| 5 | Client sends remaining | Invoice complete |

---

## TC-508: Overpayment Handling

**Priority:** Medium  
**Estimated Time:** 5 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Invoice requires 0.058 BTC | Amount shown |
| 2 | Client sends 0.060 BTC | Overpayment |
| 3 | Invoice status | "Paid" |
| 4 | Overpayment amount | Credited to balance |

---

## TC-509: Cancel Invoice

**Priority:** Medium  
**Estimated Time:** 3 minutes

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View pending invoice | Invoice detail |
| 2 | Click "Cancel Invoice" | Confirmation modal |
| 3 | Confirm cancellation | Invoice cancelled |
| 4 | Try to access payment link | "Invoice Cancelled" message |

---

## TC-510: Invoice History & Filtering

**Priority:** Low  
**Estimated Time:** 5 minutes

### Preconditions
- Multiple invoices created (paid, pending, cancelled)

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Invoice list | All invoices shown |
| 2 | Filter by "Paid" | Only paid invoices |
| 3 | Filter by "Pending" | Only pending invoices |
| 4 | Sort by date | Newest first |
| 5 | Sort by amount | Highest first |
| 6 | Search by client name | Matching invoices shown |

---

## TC-511: Automatic Currency Conversion

**Priority:** Critical  
**Estimated Time:** 15 minutes

### Preconditions
- Invoice set to receive USDT
- Client pays with BTC

### Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create invoice, receive: USDT | Invoice created |
| 2 | Client pays with BTC | Payment detected |
| 3 | Watch conversion process | "Converting BTC → USDT" |
| 4 | Atomic swap executes | Swap in progress |
| 5 | Conversion complete | USDT in wallet |
| 6 | Check conversion rate | Near market rate |
| 7 | Check fees deducted | ~0.5% fee |

### Conversion Log Example
```
Payment received: 0.058 BTC
Converting to: USDT
Swap route: BTC → USDT (atomic swap)
Rate: 1 BTC = 86,000 USDT
Gross: 4,988 USDT
Fee (0.5%): 24.94 USDT
Net received: 4,963.06 USDT
```

---

## Results Template

```markdown
## Invoice Feature Test Results (v2.4)

**Tester:** [Name]
**Date:** [YYYY-MM-DD]
**App Version:** 2.4.0

| Test Case | Status | Invoice ID | Notes |
|-----------|--------|------------|-------|
| TC-501 | PASS/FAIL | | |
| TC-502 | PASS/FAIL | | |
| TC-503 | PASS/FAIL | | |
| TC-504 | PASS/FAIL | | |
| TC-505 | PASS/FAIL | | |
| TC-506 | PASS/FAIL | | |
| TC-507 | PASS/FAIL | | |
| TC-508 | PASS/FAIL | | |
| TC-509 | PASS/FAIL | | |
| TC-510 | PASS/FAIL | | |
| TC-511 | PASS/FAIL | | |

### Test Invoices Created
| Invoice ID | Amount | Status | Payment Currency |
|------------|--------|--------|------------------|
| | | | |

### Conversion Tests
| From | To | Amount In | Amount Out | Fee |
|------|-----|-----------|------------|-----|
| BTC | USDT | | | |
```
