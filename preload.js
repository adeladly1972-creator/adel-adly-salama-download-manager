const { contextBridge, ipcMain, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  app: {
    getInfo: () => ipcRenderer.invoke('get-app-info'),
    selectDownloadPath: () => ipcRenderer.invoke('select-download-path'),
    saveState: (data) => ipcRenderer.invoke('save-download-state', data),
    loadState: () => ipcRenderer.invoke('load-download-state')
  }
});

contextBridge.exposeInMainWorld('appVersion', {
  version: '2.0.0',
  name: 'Adel Adly Salama Download Manager',
  developer: 'Adel Adly Salama'
});
