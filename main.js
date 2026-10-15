const { app, BrowserWindow, ipcMain, session } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Tokens CI Desktop',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load tokens.ci
  mainWindow.loadURL('https://tokens.ci');

  // Inject floating button after page load
  mainWindow.webContents.on('did-finish-load', () => {
    injectFloatingButton();
  });

  // Also inject on navigation (for OAuth redirects and page changes)
  mainWindow.webContents.on('did-navigate', () => {
    setTimeout(() => injectFloatingButton(), 500);
  });

  // Handle opening external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      require('electron').shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

function injectFloatingButton() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  
  // Only inject on tokens.ci domain
  const currentURL = mainWindow.webContents.getURL();
  if (!currentURL.includes('tokens.ci')) return;

  const injectScriptPath = path.join(__dirname, 'renderer', 'inject.js');
  try {
    const injectScript = fs.readFileSync(injectScriptPath, 'utf8');
    mainWindow.webContents.executeJavaScript(injectScript).catch(err => {
      console.error('Failed to inject button:', err);
    });
  } catch (err) {
    console.error('Failed to read inject script:', err);
  }
}

// Handle submit command from renderer
ipcMain.handle('submit-tokens', async () => {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    // Use npx.cmd on Windows to avoid PowerShell execution policy issues
    const cmd = isWindows 
      ? 'npx.cmd -y tokens-cli@latest submit' 
      : 'npx -y tokens-cli@latest submit';
    
    const homeDir = process.env.USERPROFILE || process.env.HOME || process.cwd();
    
    exec(cmd, { 
      maxBuffer: 20 * 1024 * 1024,
      cwd: homeDir,
      timeout: 120000 // 2 minute timeout
    }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        error: error ? error.message : null,
        stdout: stdout,
        stderr: stderr
      });
    });
  });
});

// Handle refresh page
ipcMain.handle('refresh-page', async () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.reload();
  }
  return { success: true };
});

// Handle getting app version
ipcMain.handle('get-version', async () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  // Set a custom user agent to identify our app
  session.defaultSession.setUserAgent(
    session.defaultSession.getUserAgent() + ' TokensCIDesktop/1.0.0'
  );
  
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
