# RAYCOM 串口调试助手

RAYCOM 是一款基于 Electron 和 Node.js 开发的跨平台串口调试工具。支持 Windows、macOS 和 Linux。
<img width="1024" height="768" alt="image" src="https://github.com/user-attachments/assets/977e6c82-cd84-4487-a98f-43a87b03d57e" />


## 功能特性

- **跨平台支持**：Windows, macOS, Linux
- **串口配置**：波特率、数据位、停止位、校验位等
- **数据收发**：
  - 支持 HEX/ASCII 接收与发送
  - 自动发送功能
  - 发送回显 (Local Echo)
- **高级功能**：
  - **搜索过滤**：支持关键词搜索（全词匹配、大小写敏感）、高亮显示、快速跳转
  - **日志管理**：自动保存接收数据（RAYCOM_日期_时间.txt），支持行号显示
  - **界面定制**：多主题切换（暗黑、护眼绿、专业紫），可调整面板高度
- **便捷安装**：提供 Windows 一键安装包构建脚本

## 开发环境准备

确保您的系统已安装以下软件：

- [Node.js](https://nodejs.org/) (建议版本 >= 18.0.0)
- [git](https://git-scm.com/)

## 快速上手

### 1. 获取代码

```bash
git clone https://github.com/YourUsername/serial-port-tool.git
cd serial-port-tool
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发模式

开发模式下支持热重载：

```bash
npm run dev
```

### 4. 构建安装包

#### Windows 一键构建

直接运行根目录下的脚本：

```bash
build_exe.bat
```

或者使用 npm 命令：

```bash
npm run build:win
```

构建产物位于 `dist/` 目录下。

- 安装程序：`dist/RAYCOM Setup 1.0.0.exe`
- 免安装版：`dist/win-unpacked/`

#### 其他平台构建

```bash
# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 项目结构

```
D:\serial_port\
├── assets/                # 静态资源（图标等）
├── build_exe.bat          # Windows 构建脚本
├── dist/                  # 构建产出目录
├── docs/                  # 开发文档
├── src/
│   ├── main/              # 主进程 (Electron Main)
│   ├── renderer/          # 渲染进程 (UI Frontend)
│   └── utils/             # 工具类
├── package.json           # 项目配置
└── README.md              # 说明文档
```

## 技术栈

- Electron
- Node.js
- SerialPort
- HTML5/CSS3/JavaScript

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## License

MIT
