const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  launchApp: (appName) => ipcRenderer.invoke('system:launch-app', appName),
  openUrl: (url) => ipcRenderer.invoke('system:open-url', url),
  simulateTyping: (text) => ipcRenderer.invoke('system:simulate-typing', text),
});
