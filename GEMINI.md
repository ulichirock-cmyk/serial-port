# 项目上下文：串口调试助手 (serial-port-tool)

## 项目概述
**serial-port-tool** 是一款基于 Electron 和 Node.js 开发的跨平台串口调试工具。它支持串口数据的发送、接收、显示、解析及保存功能，适用于 Windows、macOS 和 Linux 系统。

## 技术栈
- **框架**: Electron (^28.0.0)
- **运行时**: Node.js (^18.0.0)
- **串口通信**: `serialport` (^12.0.0)
- **前端**: HTML5, CSS3, ES6+ (原生 Web 技术)
- **打包工具**: `electron-builder` (^24.0.0)

## 系统架构
应用采用标准的 Electron 多进程架构：

### 1. 主进程 (`src/main`)
- **职责**: 管理应用生命周期、原生窗口及系统级交互。
- **关键模块**:
  - `SerialManager` (serial.js): 处理所有串口操作（打开、关闭、读写、枚举）。
  - `IPCHandler` (ipc.js): 管理主进程与渲染进程间的 IPC 通信。
  - `FileManager` (file.js): 负责文件的保存与加载。
  - `preload.js`: 预加载脚本，通过 `contextBridge` 安全地暴露 API。

### 2. 渲染进程 (`src/renderer`)
- **职责**: 渲染用户界面并处理用户交互。
- **主要内容**:
  - `index.html`: 主界面结构。
  - `app.js`: 渲染进程业务逻辑。
  - `styles/main.css`: 应用样式定义。
  - `utils.js`: 渲染层工具函数。

### 3. 数据流
`串口设备` -> `SerialPort (主进程)` -> `IPC` -> `UI 显示 (渲染进程)`

## 项目结构
```
D:\serial_port\
├── assets/                # 静态资源（如图标）
├── docs/                  # 项目文档
│   ├── 开发步骤详情.md
│   ├── 开发指南.md
│   └── 技术框架.md
├── src/
│   ├── main/              # 主进程代码
│   │   ├── index.js       # 应用入口
│   │   ├── serial.js      # 串口逻辑实现
│   │   ├── ipc.js         # IPC 通信定义
│   │   ├── file.js        # 文件操作逻辑
│   │   └── preload.js     # 预加载脚本
│   ├── renderer/          # 渲染进程代码
│   │   ├── components/    # UI 组件
│   │   ├── styles/        # CSS 样式
│   │   ├── index.html     # 主界面
│   │   ├── app.js         # 界面交互逻辑
│   │   └── utils.js       # 渲染层工具类
│   └── utils/             # 共享工具函数
├── package.json           # 依赖管理与构建配置
├── build_exe.bat          # Windows 快速打包脚本
└── GEMINI.md              # 项目上下文（本文件）
```

## 开发工作流

### 环境准备
- Node.js >= 18.0.0
- npm >= 9.0.0
- C++ 编译工具（用于 `serialport` 原生模块编译）

### 常用命令
- **安装依赖**: `npm install`
- **开发模式**: `npm run dev` (支持开发者工具)
- **直接启动**: `npm start`
- **全平台打包**: `npm run build`
- **Windows 打包**: `npm run build:win` 或运行 `.\build_exe.bat`
- **macOS 打包**: `npm run build:mac`
- **Linux 打包**: `npm run build:linux`

## 关键规范
- **IPC 模式**: 主进程使用 `ipcMain.handle()`，渲染进程使用 `ipcRenderer.invoke()` 进行异步通信。主进程主动推送数据使用 `webContents.send()`。
- **安全性**: 渲染进程禁用 Node.js 集成，启用上下文隔离 (Context Isolation)。
- **构建配置**: 构建相关配置直接定义在 `package.json` 的 `build` 字段中。

## 相关文档
- **技术框架**: `docs/技术框架.md`
- **开发指南**: `docs/开发指南.md`
- **开发步骤**: `docs/开发步骤详情.md`