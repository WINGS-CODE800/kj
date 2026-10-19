const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 780,
    minWidth: 800,
    minHeight: 600,
    title: 'KIKI AI — Universal Voice Assistant',
    backgroundColor: '#07090e',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
  });

  // Enable microphone permissions automatically in desktop standalone window
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'media' || permission === 'microphone') return true;
    return true;
  });

  mainWindow.webContents.session.setDevicePermissionHandler(() => true);

  const startUrl = process.env.ELECTRON_START_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`);

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Native System Execution
ipcMain.handle('system:launch-app', async (event, appName) => {
  if (process.platform === 'darwin') {
    try {
      const script = `tell application "${appName}" to activate`;
      await execPromise(`osascript -e '${script}'`);
      return { success: true, platform: 'darwin', app: appName };
    } catch (err) {
      // Fallback to open -a
      try {
        await execPromise(`open -a "${appName}"`);
        return { success: true, platform: 'darwin', app: appName };
      } catch (openErr) {
        return { success: false, error: openErr.message };
      }
    }
  } else if (process.platform === 'win32') {
    try {
      await execPromise(`start "" "${appName}"`);
      return { success: true, platform: 'win32', app: appName };
    } catch (winErr) {
      return { success: false, error: winErr.message };
    }
  }
  return { success: false, error: 'Unsupported desktop platform' };
});

ipcMain.handle('system:open-url', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true, url };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('system:simulate-typing', async (event, text) => {
  if (process.platform === 'darwin') {
    const safeText = text.replace(/"/g, '\\"');
    const script = `tell application "System Events" to keystroke "${safeText}"`;
    try {
      await execPromise(`osascript -e '${script}'`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'Platform typing not supported' };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
