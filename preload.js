const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  submitTokens: () => ipcRenderer.invoke('submit-tokens'),
  refreshPage: () => ipcRenderer.invoke('refresh-page'),
  getVersion: () => ipcRenderer.invoke('get-version')
});
