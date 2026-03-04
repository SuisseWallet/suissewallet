# Bug Report Template

Use this template to document any bugs found during testing.

---

## Bug ID: BUG-[XXX]

### Summary
[One-line description of the bug]

---

### Severity
- [ ] **Critical** - App crashes, data loss, security vulnerability
- [ ] **High** - Major feature broken, no workaround
- [ ] **Medium** - Feature partially broken, workaround exists
- [ ] **Low** - Minor issue, cosmetic, edge case

### Priority
- [ ] **P1** - Fix immediately
- [ ] **P2** - Fix in next release
- [ ] **P3** - Fix when possible
- [ ] **P4** - Nice to have

---

### Component
- [ ] Wallet Creation/Import
- [ ] Send/Receive
- [ ] Swap
- [ ] Ghost Mode
- [ ] P2P Trade
- [ ] Invoice
- [ ] Settings
- [ ] Security
- [ ] UI/UX
- [ ] Other: ___________

---

### Environment

| Property | Value |
|----------|-------|
| **App Version** | 2.4.0 |
| **OS** | Windows 11 / macOS 14.x |
| **Network** | Mainnet / Testnet |
| **Screen Resolution** | 1920x1080 |
| **Memory** | 16GB |

---

### Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]
4. [Step where bug occurs]

---

### Expected Result
[What should happen]

---

### Actual Result
[What actually happened]

---

### Screenshots / Screen Recording

[Attach screenshots or video]

![Screenshot description](./screenshots/bug-xxx-1.png)

---

### Transaction Hash (if applicable)
```
[Transaction hash for blockchain-related bugs]
```

---

### Console Logs / Error Messages
```
[Paste any error messages or console logs]
```

---

### Additional Context
[Any other relevant information]

---

### Workaround
[If a workaround exists, describe it here]

---

### Related Bugs
- BUG-XXX
- BUG-YYY

---

## Example Bug Report

---

## Bug ID: BUG-001

### Summary
Send transaction fails with "Network Error" on slow connections

---

### Severity
- [ ] Critical
- [x] **High**
- [ ] Medium
- [ ] Low

### Priority
- [x] **P2**

---

### Component
- [x] Send/Receive

---

### Environment

| Property | Value |
|----------|-------|
| **App Version** | 2.4.0 |
| **OS** | Windows 11 |
| **Network** | Testnet |
| **Screen Resolution** | 1920x1080 |
| **Connection** | Slow 3G (throttled) |

---

### Steps to Reproduce

1. Enable network throttling to "Slow 3G"
2. Go to Send → BTC
3. Enter valid address and amount
4. Click "Confirm"
5. Wait 10 seconds

---

### Expected Result
Transaction should either succeed or show meaningful timeout error with retry option.

---

### Actual Result
Generic "Network Error" displayed. No retry option. User must restart the flow.

---

### Screenshots

![Network Error Screenshot](./screenshots/bug-001-network-error.png)

---

### Console Logs
```
Error: Network request timeout after 5000ms
    at TransactionService.broadcast (TransactionService.ts:142)
    at async SendPage.handleConfirm (Send.tsx:89)
```

---

### Workaround
Wait for better network connection before sending.

---

### Suggested Fix
1. Increase timeout to 30 seconds for broadcast
2. Show specific timeout error message
3. Add "Retry" button
4. Queue transaction for later broadcast
