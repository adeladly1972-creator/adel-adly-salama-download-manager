const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const BRAND_NAME = 'Adel Adly Salama Download Manager';
const DEVELOPER = 'Adel Adly Salama';
const APP_VERSION = '2.0.0';

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.show();

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('app-info', {
      name: BRAND_NAME,
      version: APP_VERSION,
      developer: DEVELOPER
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Exit', accelerator: 'Ctrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Ctrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Ctrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Ctrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'Ctrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'Ctrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: `About ${BRAND_NAME}`,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: `About ${BRAND_NAME}`,
              message: BRAND_NAME,
              detail: `Version ${APP_VERSION}\n\nDeveloped by: ${DEVELOPER}\n\nAdvanced download manager with automatic media optimization, resume capability, and neon blue interface.\n\nNo activation key required - Fully unlocked for all Windows versions.`,
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Official Website',
          click: () => require('electron').shell.openExternal('https://github.com/adeladly1972-creator')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.handle('get-app-info', () => ({
  name: BRAND_NAME,
  version: APP_VERSION,
  developer: DEVELOPER,
  platform: process.platform
}));

ipcMain.handle('select-download-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Download Folder'
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('save-download-state', async (event, data) => {
  const configPath = path.join(app.getPath('userData'), 'downloads-state.json');
  try {
    if (!fs.existsSync(path.dirname(configPath))) {
      fs.mkdirSync(path.dirname(configPath), { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
});

ipcMain.handle('load-download-state', async () => {
  const configPath = path.join(app.getPath('userData'), 'downloads-state.json');
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    return null;
  } catch (error) {
    console.error('Load error:', error);
    return null;
  }
});
