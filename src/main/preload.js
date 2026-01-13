const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Serial Port Methods
  listPorts: () => ipcRenderer.invoke('serial:list'),
  openPort: (config) => ipcRenderer.invoke('serial:open', config),
  closePort: () => ipcRenderer.invoke('serial:close'),
  writePort: (data) => ipcRenderer.invoke('serial:write', data),

  // Event Listeners
  onSerialData: (callback) => {
    // Remove existing listeners to avoid duplicates if re-registered
    ipcRenderer.removeAllListeners('serial:data');
    ipcRenderer.on('serial:data', (event, data) => callback(data));
  },
  
  // File System Methods
  saveFile: (data) => ipcRenderer.invoke('file:save', data),

  // Window Methods
  updateTitleBar: (config) => ipcRenderer.invoke('window:update-titlebar', config)
});
