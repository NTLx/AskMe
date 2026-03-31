# AskMe 项目

## 项目概述
AskMe 是一个"反向提问"的 AI 对话应用 —— 让 AI 主动向用户提问，引导思考/学习/探索。

## 技术栈
- 前端：React 18 + TypeScript + Vite
- 桌面框架：Tauri 2.0 (Rust 后端)
- 数据库：SQLite (rusqlite)
- 状态管理：Zustand
- UI：Tailwind CSS + Radix UI

## 架构决策
- LLM 适配器：可插拔设计，首期 OpenAI Compatible
- Agent 人格：参考 OpenClaw 格式 (SOUL.md, IDENTITY.md, AGENTS.md)
- 数据存储：本地优先，后续云同步 (付费功能)
- 分支系统：parent_id 引用，支持无限嵌套

## 文件结构
- `docs/superpowers/specs/` - 设计规格说明书
- `src/commands/` - Tauri Commands
- `src/db/` - 数据库 DAO 层
- `src/llm/adapters/` - LLM 适配器实现
- `frontend/src/` - React 前端代码

## 开发规范
- 语言：中文注释和文档
- Git 提交：使用 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- SPEC：详细版本，覆盖所有模块设计

## MCP Server
- 总是优先使用 BrowserOS MCP 进行联网查询
- 总是优先访问 google.com/ncr 作为搜索引擎

## 实施计划
- MVP 实施：`docs/superpowers/plans/2026-03-30-askme-mvp-implementation.md` (12 个 Task)
- 设计规格：`docs/superpowers/specs/2026-03-30-askme-design.md`

## 构建命令
- `npm run build` → dist/ → 前端构建 (tsc + vite)
- `npm run build:tauri` → Tauri App Bundles
- `npm run tauri` → Tauri 开发模式
- `npm run dev` → Vite 开发服务器 (localhost:3000)

## 架构细节
- StorageProvider 接口：IndexedDB (Web) / SQLite (Tauri) 双后端
- Agent 人格：4 预定义人格 (温和引导者/苏格拉底导师/中立探索者/灵感催化师)
- 分支系统：parent_id 引用，无限嵌套，branch_metadata 快速查询

## 开发注意事项
- TypeScript 严格模式：未使用的导入/变量会阻止构建，必须清理
- Store 命名：`currentAgent`/`currentSessionId` (非 `activeAgentProfile`)
- UI 组件导入：从 `components/ui/` 到 `utils/` 用 `../../utils/cn`
- 路径别名：`@/*` 映射到 `./src/*`，可用 `@/utils/cn` 替代相对路径
- 未使用参数：必须加 `_` 前缀 (如 `_onDeleteAgent`) 否则 TS6133 报错
- 异步过滤：`filter()` 中 async 谓词需先 `Promise.all()` 收集结果
- 安全：Markdown 渲染使用 DOMPurify 防止 XSS (见 `utils/markdown.ts`)

## 前端样式规范 (Material Design 3 + 手机版设计)
- CSS @import 必须在 @tailwind 指令之前
- 主题切换：通过 `data-theme` 属性 + `styles/themes/*.css` CSS 变量
- 无边框设计：用 surface 层级背景色替代 1px 边框分隔区域
- 字体：Inter (body) / Manrope (display)，本地文件在 `public/fonts/`
- 手机版布局：底部导航栏 (BottomNav) + 全屏页面式设计
- 主题规范:
  - 浅色主题："The Intellectual Atelier" - 纸质表面层级 (surface-container-lowest 等)
  - 深色主题："The Digital Nocturne" - 墨水表面层级 (surface-container-lowest 等)
- 组件设计规范:
  - LaunchPad：垂直卡片列表 + 右下角悬浮新建按钮
  - ChatArea：左侧 primary accent bar + 用户消息 capsule 设计
  - InputArea：浮动底部输入框 + primary-container 圆形发送按钮
  - Sidebar：PINNED/TODAY/YESTERDAY 时间分组 + 会话时间戳显示
  - Settings：全屏页面式设置 + 顶部 Tab 导航
  - AgentPersonas：垂直卡片列表 + 激活状态光晕效果
