# Project Context: Serial Port Debugger (serial-port-tool)

## Overview
**serial-port-tool** is a cross-platform serial port debugging assistant built with Electron and Node.js. It allows users to send, receive, display, parse, and save serial port data. It is designed to run on Windows, macOS, and Linux.

## Technical Stack
- **Framework**: Electron (^28.0.0)
- **Runtime**: Node.js (^18.0.0)
- **Serial Communication**: `serialport` (^12.0.0)
- **Frontend**: HTML5, CSS3, ES6+ (Native Web Technologies)
- **Packaging**: `electron-builder` (^24.0.0)

## Architecture
The application follows the standard Electron multi-process architecture:

### 1. Main Process (`src/main`)
- **Responsibility**: Manages application lifecycle, native windows, and system interactions.
- **Key Modules**:
  - `SerialManager`: Handles all serial port operations (open, close, read, write, list).
  - `IPCHandler`: Manages IPC communication between Main and Renderer processes.
  - `FileManager`: Handles file saving and loading.

### 2. Renderer Process (`src/renderer`)
- **Responsibility**: Renders the UI and handles user interactions.
- **Components**:
  - `SerialConfig`: Settings for port, baud rate, data bits, etc.
  - `DataDisplay`: Shows received data (HEX/ASCII).
  - `SendPanel`: Input area for sending data.
  - `ChartView`: Visualizes data (optional/planned).
- **Security**: Uses a `preload.js` to securely expose API via `contextBridge`.

### 3. Data Flow
`Serial Device` -> `SerialPort (Main)` -> `IPC` -> `UI Display (Renderer)`

## Project Structure
```
D:\serial_port\
├── docs/                  # Documentation (Dev Guide, Tech Framework)
├── src/
│   ├── main/              # Main Process code
│   │   ├── index.js       # Entry point
│   │   ├── serial.js      # SerialManager implementation
│   │   └── ipc.js         # IPC definitions
│   ├── renderer/          # Renderer Process code
│   │   ├── components/    # UI Components
│   │   ├── styles/        # CSS files
│   │   ├── index.html     # Main UI entry
│   │   └── app.js         # Renderer entry logic
│   └── utils/             # Shared utilities (DataParser, HexUtils)
├── package.json           # Dependencies and scripts
└── electron-builder.json  # Build configuration
```

## Development Workflow

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- C++ Build Tools (for `serialport` native module compilation)

### Commands
- **Install Dependencies**: `npm install`
- **Development Mode**: `npm run dev` (Hot reload capable)
- **Start (No DevTools)**: `npm start`
- **Build (Current OS)**: `npm run build`
- **Build (Windows)**: `npm run build:win`
- **Build (macOS)**: `npm run build:mac`
- **Build (Linux)**: `npm run build:linux`

## Key Conventions
- **IPC Pattern**: Use `ipcMain.handle()` in Main and `ipcRenderer.invoke()` in Renderer for async operations. Use `webContents.send()` for pushing data to Renderer.
- **Security**: Node integration is disabled in Renderer. Context isolation is enabled.
- **Code Style**: Follows standard ESLint and Prettier configurations.
- **Versioning**: Semantic Versioning (SemVer).

## Documentation References
- **Framework**: `docs/技术框架.md`
- **Dev Guide**: `docs/开发指南.md`
