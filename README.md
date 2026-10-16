[![Tokens Stats](https://tokens.ci/api/embed/linker9527/svg?template=vitals&tokens=compact&cost=compact)](https://tokens.ci/u/linker9527)

# TokensCI Desktop

桌面版 tokens.ci 提交工具 — 打开 tokens.ci，悬浮 ⬆️ Submit 按钮，一键提交 tokens 数据。

## 下载

[⬇️ 下载最新安装包](https://github.com/linker9527/tokens.ci-desktop/releases/latest) — Windows x64 安装包，安装后桌面自动生成快捷方式。

## 运行

```bash
npm install
npm start
```

## 文件结构

```
├── main.js              # Electron 主进程
├── preload.js           # contextBridge 桥接
├── package.json         # 项目配置
├── renderer/
│   └── inject.js        # 悬浮按钮注入脚本
└── build/
    └── installer.nsi    # NSIS 安装包脚本
```
