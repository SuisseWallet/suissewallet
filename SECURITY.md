# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Suisse Wallet, please report it responsibly.

### How to Report

1. **Email:** security@suissewallet.io
2. **Subject:** [SECURITY] Brief description
3. **Encrypt:** Use our PGP key (below)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### PGP Key

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Public key would be here]
-----END PGP PUBLIC KEY BLOCK-----
```

## Response Timeline

| Phase | Timeframe |
|-------|-----------|
| Acknowledgment | 24 hours |
| Initial Assessment | 72 hours |
| Fix Development | 7-14 days |
| Public Disclosure | After fix released |

## Bug Bounty

We offer rewards for responsibly disclosed vulnerabilities:

| Severity | Reward |
|----------|--------|
| Critical | $5,000 - $10,000 |
| High | $1,000 - $5,000 |
| Medium | $500 - $1,000 |
| Low | $100 - $500 |

### Scope

**In Scope:**
- Private key exposure
- Unauthorized fund access
- Authentication bypass
- Cryptographic weaknesses
- Remote code execution

**Out of Scope:**
- Social engineering
- Physical attacks
- DoS attacks
- Issues in third-party dependencies (report upstream)

## Security Best Practices

### For Users

1. **Backup your seed phrase** - Store offline, never digitally
2. **Use strong password** - Minimum 12 characters, mixed types
3. **Enable auto-lock** - Set to 5 minutes or less
4. **Verify addresses** - Always double-check before sending
5. **Update regularly** - Install security updates promptly

### For Developers

1. **Never log sensitive data** - No keys, seeds, or passwords
2. **Use secure randomness** - crypto.getRandomValues()
3. **Validate all inputs** - Sanitize user input
4. **Follow least privilege** - Minimal permissions
5. **Code review** - All changes reviewed before merge

## Architecture Security

```
┌─────────────────────────────────────────────┐
│              SECURITY LAYERS                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     Application Layer               │    │
│  │     - Input validation              │    │
│  │     - Rate limiting                 │    │
│  │     - Session management            │    │
│  └─────────────────────────────────────┘    │
│                    │                        │
│  ┌─────────────────────────────────────┐    │
│  │     Cryptography Layer              │    │
│  │     - AES-256-GCM encryption        │    │
│  │     - Argon2 key derivation         │    │
│  │     - Secure key storage            │    │
│  └─────────────────────────────────────┘    │
│                    │                        │
│  ┌─────────────────────────────────────┐    │
│  │     Network Layer                   │    │
│  │     - TLS 1.3 only                  │    │
│  │     - Certificate pinning           │    │
│  │     - No HTTP fallback              │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Audit History

| Date | Auditor | Scope | Report |
|------|---------|-------|--------|
| 2024-Q4 | [Pending] | Full application | [Link] |

## Contact

- Security issues: security@suissewallet.io
- General support: support@suissewallet.io
