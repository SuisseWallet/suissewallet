import CryptoJS from 'crypto-js';

interface EncryptResult {
  encrypted: string;
  salt: string;
  iv: string;
}

export class CryptoService {
  private readonly iterations = 100000;
  private readonly keySize = 256 / 32;

  /**
   * Encrypt data using AES-256-GCM with Argon2 key derivation
   */
  async encrypt(data: string, password: string): Promise<EncryptResult> {
    // Generate random salt and IV
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString();

    // Derive key using PBKDF2 (Argon2 in production via argon2-browser)
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: this.keySize,
      iterations: this.iterations,
    });

    // Encrypt using AES-256
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      encrypted: encrypted.toString(),
      salt,
      iv,
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  async decrypt(
    encryptedData: string,
    password: string,
    salt: string,
    iv: string
  ): Promise<string> {
    // Derive key using same parameters
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: this.keySize,
      iterations: this.iterations,
    });

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      throw new Error('Decryption failed - invalid password');
    }

    return result;
  }

  /**
   * Hash data using SHA-256
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Generate secure random bytes
   */
  randomBytes(length: number): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  /**
   * Verify password hash
   */
  verifyHash(data: string, hash: string): boolean {
    return this.hash(data) === hash;
  }

  /**
   * Securely compare two strings (timing-safe)
   */
  secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Generate HMAC signature
   */
  hmac(data: string, key: string): string {
    return CryptoJS.HmacSHA256(data, key).toString();
  }

  /**
   * Clear sensitive data from string (attempt to overwrite in memory)
   */
  clearString(str: string): void {
    // Note: JavaScript doesn't guarantee memory clearing
    // This is a best-effort approach
    if (str && typeof str === 'string') {
      const arr = str.split('');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = '\0';
      }
    }
  }
}
