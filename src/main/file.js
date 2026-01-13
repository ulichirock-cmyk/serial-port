const { dialog, BrowserWindow } = require('electron');
const fs = require('fs').promises;

class FileManager {
  /**
   * Save content to a file
   * @param {string} content - The content to save
   */
  async saveFile(content) {
    const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: '保存接收数据',
      defaultPath: 'received_data.txt',
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
