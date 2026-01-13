const { ipcMain, BrowserWindow } = require('electron');
const serialManager = require('./serial');
const fileManager = require('./file');

// IPC Handlers
ipcMain.handle('serial:list', async () => {
  console.log('[IPC] serial:list called');
  try {
    const ports = await serialManager.listPorts();
    console.log('[IPC] serial:list returning', ports.length, 'ports');
    return ports;
  } catch (err) {
    console.error('[IPC] serial:list error:', err);
    throw err;
  }
});

ipcMain.handle('serial:open', async (event, config) => {
  return await serialManager.open(config);
});

ipcMain.handle('serial:close', async () => {
  return await serialManager.close();
});

ipcMain.handle('serial:write', async (event, data) => {
  return await serialManager.write(data);
});

ipcMain.handle('file:save', async (event, content) => {
  return await fileManager.saveFile(content);
});

// Event Forwarding (Main -> Renderer)
serialManager.on('data', (data) => {
  // Send to all windows (usually just one)
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('serial:data', data);
  });
});

serialManager.on('error', (err) => {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('serial:error', err.message);
  });
});

serialManager.on('close', () => {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('serial:closed');
  });
});

module.exports = {
  // Helpers if needed
};