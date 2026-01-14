const { SerialPort } = require('serialport');
const { EventEmitter } = require('events');

class SerialManager extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.isOpen = false;
  }

  /**
   * List available serial ports
   * @returns {Promise<PortInfo[]>}
   */
  async listPorts() {
    console.log('[SerialManager] Listing ports...');
    try {
      const ports = await SerialPort.list();
      console.log('[SerialManager] Found ports:', ports);
      return ports;
    } catch (err) {
      console.error('[SerialManager] Error listing ports:', err);
      throw err;
    }
  }

  /**
   * Open a serial port
   * @param {Object} config - Port configuration
   * @param {string} config.path
   * @param {number} config.baudRate
   */
  async open(config) {
    if (this.isOpen && this.port) {
      await this.close();
    }

    return new Promise((resolve, reject) => {
      this.port = new SerialPort({
        path: config.path,
        baudRate: parseInt(config.baudRate),
        dataBits: config.dataBits || 8,
        stopBits: config.stopBits || 1,
        parity: config.parity || 'none',
        autoOpen: false 
      });

      this.port.open((err) => {
        if (err) {
          console.error('Error opening port:', err);
          reject(err);
          return;
        }

        this.isOpen = true;
        this.setupListeners();
        resolve();
      });
    });
  }

  /**
   * Close the current serial port
   */
  async close() {
    if (!this.port || !this.isOpen) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.port.close((err) => {
        if (err) {
          console.error('Error closing port:', err);
          reject(err);
          return;
        }
        this.isOpen = false;
        this.port = null;
        resolve();
      });
    });
  }

  /**
   * Write data to the serial port
   * @param {string|Buffer} data 
   */
  async write(data) {
    if (!this.isOpen || !this.port) {
      throw new Error('Port not open');
    }

    // Ensure data is compatible with SerialPort (Buffer or String)
    // IPC might deliver Uint8Array which SerialPort might not like directly in some versions
    if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
      data = Buffer.from(data);
    }

    return new Promise((resolve, reject) => {
      this.port.write(data, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  /**
   * Setup internal event listeners for the port
   */
  setupListeners() {
    if (!this.port) return;

    this.port.on('data', (data) => {
      this.emit('data', data);
    });

    this.port.on('error', (err) => {
      this.emit('error', err);
    });

    this.port.on('close', () => {
      this.isOpen = false;
      this.emit('close');
    });
  }
}

module.exports = new SerialManager();
