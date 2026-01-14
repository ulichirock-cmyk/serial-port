# RAYCOM Serial Port Debugger

RAYCOM is a cross-platform serial port debugging assistant built with Electron and Node.js. It supports Windows, macOS, and Linux.

<img width="1024" height="768" alt="image" src="https://github.com/user-attachments/assets/977e6c82-cd84-4487-a98f-43a87b03d57e" />

## Features

- **Cross-Platform**: Works on Windows, macOS, and Linux.
- **Serial Configuration**: Adjustable baud rate, data bits, stop bits, parity, etc.
- **Data Transmission**:
  - Supports HEX and ASCII for both sending and receiving.
  - Auto-send feature with customizable intervals.
  - Local Echo (Transmitted data displayed in receive area).
- **Advanced Tools**:
  - **Search & Filter**: Keyword search (Whole Word, Case Sensitive), highlighting, and quick jump to lines.
  - **Log Management**: Automatic file saving (Format: `RAYCOM_YYYYMMDD_HHmmss.txt`), with line number display.
  - **UI Customization**: Multiple themes (Dark, Green, Purple) and adjustable panel heights.
- **Easy Installation**: One-click build script for Windows installers.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version >= 18.0.0 recommended)
- [Git](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/serial-port-tool.git
cd serial-port-tool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run in Development Mode

Starts the app with hot-reload support:

```bash
npm run dev
```

### 4. Build Installation Packages

#### Windows (One-Click)

Run the batch script in the root directory:

```bash
build_exe.bat
```

Or use npm:

```bash
npm run build:win
```

Build artifacts will be located in the `dist/` directory:
- Installer: `dist/RAYCOM Setup 1.0.0.exe`
- Portable Version: `dist/win-unpacked/`

#### Other Platforms

```bash
# macOS
npm run build:mac

# Linux
npm run build:linux
```

## Project Structure

```
D:\serial_port\
├── assets/                # Static assets (icons, etc.)
├── build_exe.bat          # Windows build script
├── dist/                  # Build output directory
├── docs/                  # Developer documentation
├── src/
│   ├── main/              # Electron Main Process
│   ├── renderer/          # UI Frontend (Renderer Process)
│   └── utils/             # Shared utilities
├── package.json           # Project configuration
└── README.md              # User guide (Chinese)
└── README_EN.md           # User guide (English)
```

## Tech Stack

- Electron
- Node.js
- SerialPort
- HTML5 / CSS3 / JavaScript (ES6+)

## Contributing

Issues and Pull Requests are welcome!

## License 

MIT
