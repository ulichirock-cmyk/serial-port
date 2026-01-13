/**
 * Format a Uint8Array into a HEX string
 * @param {Uint8Array} data 
 * @returns {string} e.g. "48 65 6C"
 */
function toHexString(data) {
    const hexArr = [];
    data.forEach(byte => {
        hexArr.push(byte.toString(16).padStart(2, '0').toUpperCase());
    });
    return hexArr.join(' ');
}

/**
 * Get current timestamp string
 * @returns {string} "[HH:mm:ss.ms]"
 */
function getTimestamp() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    return `[${h}:${m}:${s}.${ms}]`;
}

// Export for usage if using modules, but here we just load it globally in index.html for simplicity
// or we can attach to window if needed.
window.AppUtils = {
    toHexString,
    getTimestamp
};
