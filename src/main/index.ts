import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import { WalletManager } from './wallet/WalletManager';
import { CryptoService } from './crypto/CryptoService';
import { setupIpcHandlers } from './ipc/handlers';

// Secure electron settings
app.commandLine.appendSwitch('disable-http-cache');

const store = new Store({
  encryptionKey: process.env.STORE_ENCRYPTION_KEY || 'suisse-wallet-secure-key',
});

let mainWindow: BrowserWindow | null = null;
let walletManager: WalletManager;
let cryptoService: CryptoService;

const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../../public/icon.png'),
  });

  // Security: Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Security: Handle external links
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function initializeServices(): Promise<void> {
  cryptoService = new CryptoService();
  walletManager = new WalletManager(store, cryptoService);
  
  setupIpcHandlers(ipcMain, walletManager, cryptoService);
}

app.whenReady().then(async () => {
  await initializeServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Clear sensitive data from memory
  walletManager?.clearSensitiveData();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Handle certificate errors (reject invalid certs)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(false);
});
