const { dialog, BrowserWindow } = require('electron');
const fs = require('fs').promises;

class FileManager {
  /**
   * Save content to a file
   * @param {string} content - The content to save
   */
  async saveFile(content) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const defaultFileName = `RAYCOM_${year}${month}${day}_${hours}${minutes}${seconds}.txt`;

    const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: '保存接收数据',
      defaultPath: defaultFileName,
      filters: [
        { name: 'Text Files', extensions: ['txt', 'log'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    try {
      await fs.writeFile(filePath, content, 'utf8');
      return { success: true, path: filePath };
    } catch (err) {
      console.error('Failed to save file:', err);
      throw err;
    }
  }
}

module.exports = new FileManager();
