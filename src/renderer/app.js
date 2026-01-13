document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const portSelect = document.getElementById('port-select');
    const btnRefreshPorts = document.getElementById('btn-refresh-ports');
    const baudSelect = document.getElementById('baud-rate');
    const selTheme = document.getElementById('sel-theme');
    const btnOpen = document.getElementById('btn-open');
    const statusText = document.getElementById('status-text');
    const statusInfo = document.getElementById('status-info');
    
    // State
    let isConnected = false;

    // Send/Receive Elements
    const btnSend = document.getElementById('btn-send');
    const sendArea = document.getElementById('send-area');
    const receiveArea = document.getElementById('receive-area');
    const btnClearRecv = document.getElementById('btn-clear-recv');
    const btnSaveRecv = document.getElementById('btn-save-recv');
    const chkAutoScroll = document.getElementById('chk-auto-scroll');
    const btnToggleFilter = document.getElementById('btn-toggle-filter');
    const filterManager = document.getElementById('filter-manager');
    const selFilterType = document.getElementById('sel-filter-type');
    const inputNewFilter = document.getElementById('input-new-filter');
    const btnAddFilter = document.getElementById('btn-add-filter');
    const filterTagsContainer = document.getElementById('filter-tags');
    const chkHideSend = document.getElementById('chk-hide-send');
    const chkHexShow = document.getElementById('chk-hex-show');
    const chkHexSend = document.getElementById('chk-hex-send');
    const sendPanelContainer = document.getElementById('send-panel-container');
    
    // State
    let filterRules = []; // Array of { text, type }
    
    // Auto Send Controls
    const chkAutoSend = document.getElementById('chk-auto-send');
    const inputAutoInterval = document.getElementById('input-auto-interval');
    let autoSendTimer = null;
    let rawBuffer = ''; // Buffer for incoming text data to handle split lines

    // Initialize
    await refreshPorts();
    initTheme();

    // Event Listeners
    btnRefreshPorts.addEventListener('click', refreshPorts);
    btnOpen.addEventListener('click', toggleConnection);
    
    selTheme.addEventListener('change', () => {
        applyTheme(selTheme.value);
    });

    function initTheme() {
        const savedTheme = localStorage.getItem('app-theme') || 'default';
        selTheme.value = savedTheme;
        applyTheme(savedTheme);
    }

    function applyTheme(themeName) {
        document.body.classList.remove('theme-dark', 'theme-green', 'theme-purple');
        
        let overlayConfig = { color: '#e9ecef', symbolColor: '#333333' }; // Default
        
        if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
            
            // Adjust native window buttons based on theme
            if (themeName === 'dark') {
                overlayConfig = { color: '#333333', symbolColor: '#cccccc' };
            } else if (themeName === 'green') {
                overlayConfig = { color: '#d4e3b5', symbolColor: '#2e4a2e' };
            } else if (themeName === 'purple') {
                overlayConfig = { color: '#ede7f6', symbolColor: '#311b92' };
            }
        }
        
        window.electronAPI.updateTitleBar(overlayConfig);
        localStorage.setItem('app-theme', themeName);
    }

    // Data Handling
    window.electronAPI.onSerialData((data) => {
        // data is Uint8Array (from Buffer)
        displayData(data);
    });

    btnSend.addEventListener('click', sendData);

    // Filter Management Logic
    btnToggleFilter.addEventListener('click', () => {
        const isHidden = filterManager.style.display === 'none';
        filterManager.style.display = isHidden ? 'flex' : 'none';
        btnToggleFilter.classList.toggle('btn-primary', isHidden);
    });

    btnAddFilter.addEventListener('click', () => {
        const text = inputNewFilter.value.trim().toLowerCase();
        if (!text) return;
        
        // Check for duplicates
        if (filterRules.some(r => r.text === text && r.type === selFilterType.value)) {
            alert('该规则已存在');
            return;
        }

        filterRules.push({
            text: text,
            type: selFilterType.value
        });
        
        inputNewFilter.value = '';
        renderFilterTags();
    });

    inputNewFilter.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnAddFilter.click();
    });

    function renderFilterTags() {
        filterTagsContainer.innerHTML = '';
        filterRules.forEach((rule, index) => {
            const tag = document.createElement('div');
            tag.className = `filter-tag ${rule.type}`;
            tag.innerHTML = `
                <span>${rule.type === 'include' ? '+' : '-'} ${rule.text}</span>
                <span class="remove" data-index="${index}">&times;</span>
            `;
            filterTagsContainer.appendChild(tag);
        });
        
        btnToggleFilter.textContent = `过滤规则 (${filterRules.length})`;
        
        // Add remove events
        filterTagsContainer.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                filterRules.splice(index, 1);
                renderFilterTags();
            });
        });
    }

    // Enter to Send
    sendArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline
            sendData();
        }
    });

    // Hide Send Area Logic
    chkHideSend.addEventListener('change', () => {
        if (chkHideSend.checked) {
            sendPanelContainer.style.display = 'none';
        } else {
            sendPanelContainer.style.display = 'flex';
        }
    });
    
    // Auto Send Logic
    chkAutoSend.addEventListener('change', () => {
        if (chkAutoSend.checked) {
            const interval = parseInt(inputAutoInterval.value);
            if (isNaN(interval) || interval < 10) {
                alert('请输入有效的发送间隔 (>= 10ms)');
                chkAutoSend.checked = false;
                return;
            }
            
            if (!isConnected) {
                alert('请先打开串口');
                chkAutoSend.checked = false;
                return;
            }

            // Disable input while running
            inputAutoInterval.disabled = true;
            
            // Start timer
            autoSendTimer = setInterval(sendData, interval);
        } else {
            // Stop timer
            if (autoSendTimer) {
                clearInterval(autoSendTimer);
                autoSendTimer = null;
            }
            inputAutoInterval.disabled = false;
        }
    });

    btnClearRecv.addEventListener('click', () => {
        receiveArea.textContent = '';
    });
    
    btnSaveRecv.addEventListener('click', async () => {
        const content = receiveArea.textContent;
        if (!content) {
            alert('没有可保存的数据');
            return;
        }
        
        try {
            const result = await window.electronAPI.saveFile(content);
            if (result.success) {
                alert(`保存成功: ${result.path}`);
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert('保存失败: ' + err.message);
        }
    });

    // Functions
    async function refreshPorts() {
        console.log('[Renderer] refreshPorts called');
        try {
            console.log('[Renderer] Requesting port list from Main...');
            const ports = await window.electronAPI.listPorts();
            console.log('[Renderer] Received ports:', ports);
            
            portSelect.innerHTML = '';
            
            if (!ports || ports.length === 0) {
                console.log('[Renderer] No ports found');
                const option = document.createElement('option');
                option.text = '未找到串口';
                portSelect.add(option);
                return;
            }

            ports.forEach(port => {
                const option = document.createElement('option');
                option.value = port.path;
                option.text = `${port.path} - ${port.manufacturer || ''}`;
                portSelect.add(option);
            });
            console.log('[Renderer] Port select updated');
        } catch (err) {
            console.error('[Renderer] Failed to list ports:', err);
            statusText.textContent = '获取串口列表失败';
            portSelect.innerHTML = '<option value="">获取失败</option>';
        }
    }

    async function toggleConnection() {
        if (isConnected) {
            // Close Port
            try {
                await window.electronAPI.closePort();
                isConnected = false;
                updateUIState(false);
            } catch (err) {
                console.error('Failed to close port:', err);
                alert('关闭串口失败: ' + err.message);
            }
        } else {
            // Open Port
            const path = portSelect.value;
            const baudRate = parseInt(baudSelect.value);

            if (!path || path === '未找到串口') {
                alert('请选择有效的串口');
                return;
            }

            try {
                await window.electronAPI.openPort({
                    path,
                    baudRate
                });
                isConnected = true;
                updateUIState(true);
            } catch (err) {
                console.error('Failed to open port:', err);
                alert('打开串口失败: ' + err.message);
            }
        }
    }

    async function sendData() {
        if (!isConnected) {
            alert('请先打开串口');
            return;
        }

        const text = sendArea.value;
        if (!text) return;

        let dataToSend;

        if (chkHexSend.checked) {
            // Parse HEX string (e.g. "48 65 6C")
            try {
                const cleanHex = text.replace(/\s+/g, '');
                if (cleanHex.length % 2 !== 0) {
                    throw new Error('HEX 字符串长度必须为偶数');
                }
                const buffer = new Uint8Array(cleanHex.length / 2);
                for (let i = 0; i < cleanHex.length; i += 2) {
                    const byte = parseInt(cleanHex.substr(i, 2), 16);
                    if (isNaN(byte)) throw new Error('无效的 HEX 字符');
                    buffer[i / 2] = byte;
                }
                dataToSend = buffer;
            } catch (err) {
                alert('发送失败: ' + err.message);
                return;
            }
        } else {
            // Send as ASCII/UTF-8
            dataToSend = text;
        }

        try {
            await window.electronAPI.writePort(dataToSend);
        } catch (err) {
            console.error('Failed to send:', err);
            alert('发送失败: ' + err.message);
        }
    }

    function displayData(data) {
        // data comes as Uint8Array/Buffer
        if (chkHexShow.checked) {
            const timestamp = window.AppUtils.getTimestamp() + ' ';
            const displayStr = timestamp + window.AppUtils.toHexString(data) + '\n';
            receiveArea.textContent += displayStr;
            rawBuffer = ''; 
        } else {
            const text = new TextDecoder().decode(data);
            rawBuffer += text;
            
            let lastNewline = rawBuffer.lastIndexOf('\n');
            if (lastNewline !== -1) {
                const completeData = rawBuffer.substring(0, lastNewline + 1);
                rawBuffer = rawBuffer.substring(lastNewline + 1);

                const lines = completeData.split('\n');
                let htmlOutput = '';
                
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine === '') return;
                    
                    const lowerLine = trimmedLine.toLowerCase();
                    const isExcluded = filterRules.some(r => r.type === 'exclude' && lowerLine.includes(r.text));
                    if (isExcluded) return;
                    
                    const includeRules = filterRules.filter(r => r.type === 'include');
                    if (includeRules.length > 0) {
                        const isIncluded = includeRules.some(r => lowerLine.includes(r.text));
                        if (!isIncluded) return;
                    }
                    
                    htmlOutput += processLogLine(trimmedLine) + '\n'; 
                });

                receiveArea.insertAdjacentHTML('beforeend', htmlOutput);
            }
        }
        
        // Auto scroll
        if (chkAutoScroll.checked) {
            receiveArea.scrollTop = receiveArea.scrollHeight;
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function processLogLine(line) {
        const regex = /^(\ [\d\.]+\ ] )(\s*<[^>]+>[\.\-](\d+))?(\s*\[[^\]]+\])?(.*)$/;
        const match = line.match(regex);

        if (match) {
            const timestamp = escapeHtml(match[1] || '');
            const meta = escapeHtml(match[2] || '');
            const process = escapeHtml(match[3] || '');
            let content = escapeHtml(match[4] || '');
            
            let contentClass = 'log-content';
            if (content.includes('avc: denied') || content.includes('audit:')) {
                contentClass = 'log-err';
            } else if (content.toLowerCase().includes('error') || content.toLowerCase().includes('fail')) {
                contentClass = 'log-err';
            } else if (content.toLowerCase().includes('warning')) {
                contentClass = 'log-warn';
            } else if (content.includes('BOOTPROF')) {
                contentClass = 'log-info';
            }

            return `<span class="log-time">${timestamp}</span><span class="log-meta">${meta}</span><span class="log-proc">${process}</span><span class="${contentClass}">${content}</span>`;
        } else {
            const escapedLine = escapeHtml(line);
            if (escapedLine.toLowerCase().includes('error') || escapedLine.toLowerCase().includes('fail')) {
                return `<span class="log-err">${escapedLine}</span>`;
            }
            return `<span class="log-content">${escapedLine}</span>`;
        }
    }

    function updateUIState(connected) {
        if (connected) {
            btnOpen.textContent = '关闭串口';
            btnOpen.classList.remove('btn-primary');
            btnOpen.style.backgroundColor = '#dc3545';
            btnOpen.style.color = 'white';
            portSelect.disabled = true;
            baudSelect.disabled = true;
            statusText.textContent = '已连接';
            statusText.style.color = '#28a745';
            statusInfo.textContent = `${portSelect.value} | ${baudSelect.value}`;
        } else {
            btnOpen.textContent = '打开串口';
            btnOpen.classList.add('btn-primary');
            btnOpen.style.backgroundColor = '';
            btnOpen.style.color = '';
            portSelect.disabled = false;
            baudSelect.disabled = false;
            statusText.textContent = '未连接';
            statusText.style.color = 'white';
            statusInfo.textContent = '';
        }
    }
});