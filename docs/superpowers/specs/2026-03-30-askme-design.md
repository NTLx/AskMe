# AskMe 应用设计规格说明书

**版本：** 1.0
**日期：** 2026-03-30
**状态：** 草案
**作者：** AskMe Team

---

## 目录

1. [产品概述](#1-产品概述)
2. [用户界面设计](#2-用户界面设计)
3. [系统架构](#3-系统架构)
4. [数据模型设计](#4-数据模型设计)
5. [核心模块设计](#5-核心模块设计)
6. [LLM 适配器架构](#6-llm-适配器架构)
7. [Agent 人格系统](#7-agent-人格系统)
8. [分支系统设计](#8-分支系统设计)
9. [安全与隐私](#9-安全与隐私)
10. [MVP 范围与迭代计划](#10-mvp 范围与迭代计划)

---

## 1. 产品概述

### 1.1 产品愿景

AskMe 是一个反向提问的 AI 对话应用。与传统"用户问，AI 答"的模式不同，AskMe 的核心理念是**"让 AI 向你提问"**——充分发挥 AI 知识渊博的优势，通过主动提问引导用户思考、学习、探索和自我发现。

### 1.2 目标用户

- **学习者**：希望通过引导式提问深入学习某个主题
- **思考者**：需要通过对话理清思路、发现盲点
- **探索者**：想要进行自我反思、获得人生洞察
- **创造者**：寻求头脑风暴、打破思维定式

### 1.3 核心价值主张

| 传统 AI 对话 | AskMe |
|------------|-------|
| 用户问 → AI 答 | AI 问 → 用户答 → AI 继续问 |
| 被动获取答案 | 主动建构理解 |
| 一次性知识传递 | 持续性思维引导 |
| 通用型助手 | 个性化思考伙伴 |

### 1.4 平台覆盖

- **网页版**：GitHub Pages 静态托管 + PWA
- **PC 客户端**：Windows、macOS、Linux（Tauri 2.0）
- **手机 APP**：iOS、Android（Tauri Mobile）

### 1.5 技术选型

#### 前端（共享）

| 层级 | 技术选择 | 理由 |
|------|---------|------|
| 前端框架 | React 18 + TypeScript | 成熟的生态、类型安全 |
| 状态管理 | Zustand | 轻量、简单、性能优秀 |
| 构建工具 | Vite | 快速开发、热更新、多目标构建 |
| UI 组件 | Tailwind CSS + Radix UI | 高度可定制、无障碍支持 |

#### 后端/运行时

| 平台 | 数据持久化 | 加密存储 | LLM 调用 |
|------|-----------|---------|---------|
| **Tauri 桌面/移动** | SQLite (rusqlite) | 系统 Keychain/DPAPI | Rust 后端代理 |
| **Web (GitHub Pages)** | IndexedDB (dexie) | Web Crypto API | 浏览器 Fetch |

#### 双目标构建架构

```
源代码 (共享前端)
    ├── /frontend/src/          # React 组件、状态管理、业务逻辑
    ├── /frontend/src/storage/  # 数据访问层 (抽象接口)
    │   ├── interface.ts        # StorageProvider 接口定义
    │   ├── sqlite-provider.ts  # Tauri + SQLite 实现
    │   └── indexeddb-provider.ts # Web + IndexedDB 实现
    └── /src-tauri/             # Tauri Rust 后端 (仅桌面/移动)

构建目标：
    ├── npm run build:web       → dist/ → GitHub Pages
    └── npm run build:tauri     → Tauri App Bundles
```

---

## 2. 用户界面设计

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  侧边栏 (280px)  │           主内容区 (flex-1)              │
│                  │  ┌─────────────────────────────────────┐ │
│  [+ 新对话]      │  │  顶部栏 (60px)                       │ │
│  ────────────    │  │  [会话标题] [Agent] [LLM] [分支]    │ │
│  🔍 搜索...      │  │                      [导出] [设置]  │ │
│  ────────────    │  └─────────────────────────────────────┘ │
│  [视图 Tabs]     │  ┌─────────────────────────────────────┐ │
│  ────────────    │  │                                      │ │
│  📌 已置顶       │  │           对话消息区域               │ │
│    [会话 1]      │  │         (flex, overflow-y)          │ │
│  ────────────    │  │                                      │ │
│  今天            │  └─────────────────────────────────────┘ │
│    [会话 2]      │  ┌─────────────────────────────────────┐ │
│    [会话 3]      │  │           输入区域                   │ │
│  昨天            │  │  [文本框]                            │ │
│    [会话 4]      │  │  [发送]                              │ │
│                  │  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 启动界面

启动界面是用户打开 AskMe 后看到的第一个界面（当没有打开任何会话时）。

**设计要素：**

```
┌──────────────────────────────────────┐
│            🤔                        │
│          AskMe                       │
│       让 AI 向你提问                   │
│                                      │
│     你好，今天想探索什么？             │
│                                      │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ 🎯 解决问题   │ │ 📚 学习探索  │  │
│  │ 理清思路找答案 │ │ 深入学习建立理解│ │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ 💭 深度对话   │ │ ✨ 寻求启发  │  │
│  │ 反思自我发现洞察│ │ 打破常规获得灵感│ │
│  └──────────────┘ └──────────────┘  │
│  ─────────────────────────────────   │
│            或者                       │
│  ─────────────────────────────────   │
│    直接输入你想探讨的问题或想法...    │
│   ┌──────────────────────────────┐  │
│   │ 💬 [输入框]                   │  │
│   └──────────────────────────────┘  │
│                                      │
│   🔮 自适应人格  📝 会话记忆  ⚙️ 自定义│
└──────────────────────────────────────┘
```

**场景按钮行为：**

| 按钮 | 触发 Prompt | 适用场景 |
|------|------------|---------|
| 🎯 解决问题 | "我有事情需要咨询，请通过提问帮助我理清思路、找到答案" | 决策困难、思路混乱 |
| 📚 学习探索 | "我想进行学习，请通过提问帮助我深入理解一个主题" | 学习新知识、技能 |
| 💭 深度对话 | "我想来一场深度对话，请通过提问引导我反思和发现洞察" | 自我探索、人生思考 |
| ✨ 寻求启发 | "我需要一些启发，请通过提问帮助我打破常规思维" | 创意瓶颈、需要灵感 |

### 2.3 侧边栏设计

#### 2.3.1 搜索功能

**搜索维度（默认全选）：**
- 会话名称
- 会话内容（消息正文）
- 标签
- Agent Profile 名称
- LLM 提供商

**搜索语法：**
```
# 基础搜索
关键词

# 维度限定
name:关键词        # 仅搜索名称
content:关键词      # 仅搜索内容
tag:学习            # 仅搜索标签
agent:苏格拉底      # 仅搜索 Agent
llm:claude         # 仅搜索 LLM

# 组合搜索
tag:学习 content:rust    # 学习标签且内容包含 rust
```

#### 2.3.2 视图切换

**时间线视图（默认）：**
```
📌 已置顶
  └─ [🎯 如何解决职业倦怠？] [温和引导者] [Claude] [2 小时前]

今天
  └─ [📚 学习 Rust 内存所有权] [苏格拉底导师] [GPT-4] [刚刚] [🌿]

昨天
  └─ [💭 深度对话：人生的意义] [中立探索者] [Claude] [昨天]

3 月 28 日
  └─ [✨ 创业点子头脑风暴] [灵感催化师] [Gemini] [#创业]
```

**标签视图：**
```
📂 #学习
  └─ 学习 Rust 内存所有权
  └─ Python 异步编程
  └─ 机器学习基础

📂 #创业
  └─ 创业点子头脑风暴
  └─ MVP 功能定义

📂 #人生
  └─ 深度对话：人生的意义
  └─ 职业规划困惑
```

**Agent 视图：**
```
🤗 温和引导者 (3)
  └─ 如何解决职业倦怠？
  └─ 第一次心理咨询体验
  └─ 学习 React Hooks

🧠 苏格拉底导师 (2)
  └─ 学习 Rust 内存所有权
  └─ 哲学思辨训练
```

**LLM 视图：**
```
🟢 OpenAI (2)
  └─ 会话 1
  └─ 会话 2

🔵 Claude (3)
  └─ 会话 3
  └─ 会话 4
  └─ 会话 5
```

#### 2.3.3 会话项结构

```typescript
interface SessionListItem {
  id: string;
  title: string;
  isPinned: boolean;
  isLocked: boolean;  // 标题锁定
  agentName: string;
  agentEmoji: string;
  llmName: string;
  llmIcon: string;
  branchLabel?: string;  // "分支 2"
  tags: string[];
  lastActiveAt: Date;
  messageCount: number;
  hasParent: boolean;  // 是否是分支
  hasChildren: boolean; // 是否有子分支
}
```

### 2.4 主对话区域

#### 2.4.1 消息气泡设计

**AI 消息：**
```
┌─────────────────────────────────────────┐
│ 🤔 AskMe                       刚刚    │
│                                         │
│  很好！你已经理解了所有权的基本概念。    │
│  那么让我问你：如果你有一个函数想要     │
│  "借用"一个 String 而不是拿走它，你觉得  │
│  Rust 会提供什么样的机制？               │
│                                         │
│  [🌿 分支] [📋 复制] [👍] [👎]         │
└─────────────────────────────────────────┘
```

**用户消息：**
```
                    ┌─────────────────────────────────────────┐
                    │ 你                              刚刚 │
                    │                                         │
                    │ 是引用吗？& 符号？                       │
                    └─────────────────────────────────────────┘
```

#### 2.4.2 输入区域

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 输入你的回答或问题...                              │ │
│  │                                                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  💡 AI 会向你提问          Enter 发送     [发送]       │
└─────────────────────────────────────────────────────────┘
```

**输入功能：**
- Enter 发送
- Shift+Enter 换行
- 支持 Markdown 输入
- 自动高度（最大 200px）
- 发送后保留草稿（可配置）

### 2.5 设置面板

#### 2.5.1 Agent 人格页签

**预定义人格卡片：**
```
┌─────────────────────────────────────────────────────────┐
│ 🤗 温和引导者                                           │
│                                                         │
│ 温暖支持，循序渐进地引导思考，适合需要鼓励的学习者      │
│                                                         │
│ [✏️ 编辑] [📋 复制]                                     │
└─────────────────────────────────────────────────────────┘
```

**创建新人格：**
```
┌─────────────────────────────────────────────────────────┐
│                         +                               │
│                   创建新人格                            │
│           支持上传文件或在线编辑                        │
└─────────────────────────────────────────────────────────┘
```

#### 2.5.2 LLM 提供商页签

```
┌─────────────────────────────────────────────────────────┐
│ 🟢 OpenAI Compatible                           [已启用] │
│ Base URL: https://api.openai.com/v1                    │
│ Models: gpt-4, gpt-3.5-turbo, ...                      │
├─────────────────────────────────────────────────────────┤
│ 🔵 Anthropic Claude                     [📦 安装插件]  │
│ 需安装 Claude 适配器插件                                │
├─────────────────────────────────────────────────────────┤
│ 🦙 Ollama (本地)                        [📦 安装插件]  │
│ 需安装 Ollama 适配器插件                                │
└─────────────────────────────────────────────────────────┘
```

#### 2.5.3 通用设置页签

| 设置项 | 选项 | 默认值 |
|--------|------|--------|
| 主题 | 深色 / 浅色 / 跟随系统 | 深色 |
| 会话标题生成 | 自动生成 / 手动输入 | 自动生成 |
| 输入框草稿 | 保留 / 清除 | 保留 |
| 搜索维度默认 | 全选 / 自定义 | 全选 |
| 数据导出路径 | 文件夹选择 | ~/Downloads |

---

## 3. 系统架构

### 3.1 整体架构图

#### 双目标构建架构

```
                         源代码 (TypeScript + React)
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        ┌───────────────────┐           ┌───────────────────┐
        │   Web 构建目标     │           │  Tauri 构建目标   │
        │  (GitHub Pages)   │           │  (桌面/移动应用)   │
        │                   │           │                   │
        │  React + Vite     │           │  React + Vite     │
        │  IndexedDB        │           │  Tauri IPC        │
        │  Web Crypto       │           │  Rust 后端        │
        │  Fetch API        │           │  SQLite           │
        │                   │           │  系统 Keychain    │
        └───────────────────┘           └───────────────────┘
                    │                               │
                    ▼                               ▼
            dist/ 目录                    src-tauri/target/
            (静态资源)                   (应用安装包)
```

#### Tauri 架构（桌面/移动）

```
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (React)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  启动界面   │ │  主界面     │ │   设置面板          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  侧边栏     │ │  对话区域   │ │   分支管理          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ IPC (Tauri Commands)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Rust 后端层 (Tauri)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ 数据库服务  │ │  文件服务   │ │    系统服务         │  │
│  │  (SQLite)   │ │  (导出)     │ │  (Keychain/DPAPI)   │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ LLM 管理器  │ │ Agent 管理器│ │   导出服务          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     LLM 适配器层                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ OpenAI 适配器│ │ Claude 适配器│ │ Ollama 适配器      │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    外部 LLM 服务                            │
│    OpenAI API    │   Anthropic API   │    Ollama Local    │
└─────────────────────────────────────────────────────────────┘
```

#### Web 架构（GitHub Pages）

```
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (React)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  启动界面   │ │  主界面     │ │   设置面板          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  侧边栏     │ │  对话区域   │ │   分支管理          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 直接调用
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   浏览器 API 层                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ IndexedDB   │ │ Web Crypto  │ │   Download API      │  │
│  │  (dexie.js) │ │   (加密)    │ │    (导出)           │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ LLM Adapter │ │ Agent Loader│ │   Export Generator  │  │
│  │ (Fetch API) │ │ (纯 JS)     │ │    (Markdown)       │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    外部 LLM 服务                            │
│    OpenAI API    │   Anthropic API   │    Ollama Local    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 模块职责

#### 共享模块（Frontend）

| 模块 | 职责 | 位置 |
|------|------|------|
| UI Components | 界面组件、状态展示 | `frontend/src/components/` |
| State Management | 应用状态、会话状态 | `frontend/src/stores/` |
| Storage Interface | 数据访问抽象接口 | `frontend/src/storage/interface.ts` |
| Agent Loader | Agent Profile 解析 | `frontend/src/agent/` |
| LLM Adapter Interface | LLM 适配器接口 | `frontend/src/llm/adapter.ts` |

#### 平台特定模块

| 模块 | Tauri 实现 | Web 实现 |
|------|-----------|---------|
| Database | SQLite (`src/db/`) | IndexedDB (`frontend/src/storage/indexeddb-provider.ts`) |
| Crypto | 系统 Keychain (`src/crypto/`) | Web Crypto (`frontend/src/storage/web-crypto.ts`) |
| File Export | Rust 文件系统 | Browser Download API |
| LLM Call | Rust HTTP 代理 | Fetch API |
| Agent Storage | 文件系统 | IndexedDB |

### 3.3 数据访问层抽象

```typescript
// frontend/src/storage/interface.ts

/**
 * 存储提供者接口 - 由不同平台实现
 */
export interface StorageProvider {
  // 会话操作
  createSession(session: Session): Promise<string>;
  getSession(id: string): Promise<Session | null>;
  updateSession(session: Session): Promise<void>;
  deleteSession(id: string): Promise<void>;
  listSessions(): Promise<SessionListItem[]>;

  // 消息操作
  createMessage(message: Message): Promise<string>;
  getMessages(sessionId: string, limit?: number): Promise<Message[]>;
  updateMessage(message: Message): Promise<void>;

  // Agent Profile
  getAgentProfile(id: string): Promise<AgentProfile | null>;
  listAgentProfiles(): Promise<AgentProfile[]>;
  saveAgentProfile(profile: AgentProfile): Promise<void>;

  // LLM Provider
  getLLMProvider(id: string): Promise<LLMProvider | null>;
  listLLMProviders(): Promise<LLMProvider[]>;
  saveLLMProvider(provider: LLMProvider): Promise<void>;

  // 标签
  getTags(): Promise<Tag[]>;
  addTag(tag: Tag): Promise<void>;
  linkTag(sessionId: string, tagId: string): Promise<void>;

  // 搜索
  searchSessions(query: SearchRequest): Promise<SearchResult>;

  // 工具
  encryptApiKey(apiKey: string): Promise<string>;
  decryptApiKey(encrypted: string): Promise<string>;
}
```

### 3.4 数据流向

#### Tauri 版本流程

**发送消息流程：**
```
1. 用户在输入框输入内容
2. Frontend: 更新本地状态 (optimistic update)
3. Frontend: 调用 Tauri Command → send_message(session_id, content)
4. Backend: 获取会话上下文（包含历史消息）
5. Backend: 加载 Agent Profile（SOUL, IDENTITY 等）
6. Backend: 通过 LLM Manager 选择合适的适配器
7. Backend: 构建 Prompt（系统提示 + 上下文 + 用户消息）
8. LLM Adapter: 调用外部 API
9. Backend: 流式接收响应
10. Backend: 流式推送给 Frontend
11. Frontend: 实时渲染 AI 响应
12. Backend: 保存完整对话到 SQLite 数据库
```

#### Web 版本流程

**发送消息流程：**
```
1. 用户在输入框输入内容
2. Frontend: 更新本地状态 (optimistic update)
3. Frontend: 调用 StorageProvider → createMessage()
4. Frontend: IndexedDB 保存消息
5. Frontend: 加载 Agent Profile（从 IndexedDB）
6. Frontend: 构建 Prompt
7. Frontend: Fetch API 调用 LLM
8. Frontend: 流式接收响应
9. Frontend: 实时渲染 AI 响应
10. Frontend: 更新 IndexedDB 中的消息
```

---

## 4. 数据模型设计

### 4.1 数据库 Schema

```sql
-- 会话表
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES sessions(id),  -- 分支父节点
    title TEXT NOT NULL,
    title_locked INTEGER DEFAULT 0,  -- 0=false, 1=true
    agent_profile_id TEXT REFERENCES agent_profiles(id),
    llm_provider_id TEXT REFERENCES llm_providers(id),
    scenario_type TEXT,  -- 'problem_solving', 'learning', 'deep_chat', 'inspiration'
    is_pinned INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_message_at INTEGER,

    -- 用于快速查询的冗余字段
    message_count INTEGER DEFAULT 0,
    branch_count INTEGER DEFAULT 0
);

-- 消息表
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    role TEXT NOT NULL,  -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    content_html TEXT,  -- 渲染后的 HTML
    token_count INTEGER,
    created_at INTEGER NOT NULL,

    -- 分支点标记
    is_branch_point INTEGER DEFAULT 0,
    branch_point_label TEXT  -- 可选的分支点描述
);

-- Agent Profile 表
CREATE TABLE agent_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT,
    description TEXT,
    is_builtin INTEGER DEFAULT 0,  -- 是否为内置
    is_active INTEGER DEFAULT 0,   -- 是否为当前默认

    -- 配置文件内容（参考 OpenClaw 格式）
    agents_md TEXT,
    soul_md TEXT,
    identity_md TEXT,
    user_md TEXT,
    tools_md TEXT,

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- LLM Provider 表
CREATE TABLE llm_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'openai_compatible', 'anthropic', 'ollama', ...
    base_url TEXT,
    api_key TEXT,  -- 加密存储
    is_enabled INTEGER DEFAULT 0,
    is_default INTEGER DEFAULT 0,

    -- 配置（JSON 格式）
    config TEXT,

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 标签表
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at INTEGER NOT NULL
);

-- 会话 - 标签关联表
CREATE TABLE session_tags (
    session_id TEXT REFERENCES sessions(id),
    tag_id TEXT REFERENCES tags(id),
    PRIMARY KEY (session_id, tag_id)
);

-- 用户设置表
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 分支元数据表（用于快速查询分支树）
CREATE TABLE branch_metadata (
    session_id TEXT PRIMARY KEY REFERENCES sessions(id),
    root_session_id TEXT REFERENCES sessions(id),  -- 根会话 ID
    depth INTEGER DEFAULT 0,  -- 分支深度（0=根）
    path TEXT,  -- 完整路径，如 "root/branch1/branch1a"

    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- 索引
CREATE INDEX idx_sessions_parent ON sessions(parent_id);
CREATE INDEX idx_sessions_pinned ON sessions(is_pinned);
CREATE INDEX idx_sessions_updated ON sessions(updated_at DESC);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_session_tags_session ON session_tags(session_id);
CREATE INDEX idx_session_tags_tag ON session_tags(tag_id);
CREATE INDEX idx_branch_root ON branch_metadata(root_session_id);
```

### 4.2 TypeScript 类型定义

```typescript
// ============ 核心类型 ============

type ScenarioType = 'problem_solving' | 'learning' | 'deep_chat' | 'inspiration';

type MessageRole = 'user' | 'assistant' | 'system';

// ============ 会话 ============

interface Session {
  id: string;
  parentId: string | null;  // 分支父节点
  title: string;
  titleLocked: boolean;
  agentProfileId: string;
  llmProviderId: string;
  scenarioType: ScenarioType | null;
  isPinned: boolean;
  createdAt: number;  // Unix timestamp (ms)
  updatedAt: number;
  lastMessageAt: number | null;
  messageCount: number;
  branchCount: number;

  // 关联数据（前端扩展）
  agent?: AgentProfile;
  llm?: LLMProvider;
  tags?: Tag[];
  messages?: Message[];
  children?: Session[];  // 子分支
}

// ============ 消息 ============

interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  contentHtml?: string;
  tokenCount?: number;
  createdAt: number;

  // 分支相关
  isBranchPoint: boolean;
  branchPointLabel?: string;

  // 前端扩展
  isStreaming?: boolean;  // 是否正在流式传输
  isError?: boolean;
  error?: string;
}

// ============ Agent Profile ============

interface AgentProfile {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  isBuiltin: boolean;
  isActive: boolean;

  // 配置文件内容
  agentsMd?: string;
  soulMd?: string;
  identityMd?: string;
  userMd?: string;
  toolsMd?: string;

  createdAt: number;
  updatedAt: number;
}

// 预定义人格
const BUILTIN_AGENTS: Omit<AgentProfile, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'gentle_guide',
    name: '温和引导者',
    emoji: '🤗',
    description: '温暖支持，循序渐进地引导思考，适合需要鼓励的学习者',
    isBuiltin: true,
    isActive: false,
    soulMd: `# SOUL - 温和引导者

## 核心特质
- 温暖、支持性、鼓励性
- 耐心倾听，循序渐进
- 关注用户的情感状态

## 提问风格
- 使用温和的措辞
- 先肯定再引导
- 提供安全感的表达空间

## 边界
- 不提供专业心理建议
- 不涉及医疗诊断
- 遇到危机情况建议寻求专业帮助`,
    identityMd: `# IDENTITY - 温和引导者

## 角色定位
你是一位温和的导师，像一位耐心的园丁，陪伴学习者在安全的环境中成长。

## 语气风格
- 温暖、亲切
- 使用鼓励性语言
- 避免评判性措辞

## Emoji
🤗`
  },
  {
    id: 'socrates',
    name: '苏格拉底导师',
    emoji: '🧠',
    description: '通过挑战性提问激发深度思考，适合追求突破的学习者',
    isBuiltin: true,
    isActive: false,
    soulMd: `# SOUL - 苏格拉底导师

## 核心特质
- 挑战性的、思辨的
- 不满足于表面答案
- 追求深度理解

## 提问风格
- 追问"为什么"
- 揭示假设和矛盾
- 引导自我质疑

## 边界
- 挑战但不贬低
- 质疑但不攻击
- 保持学术诚信`,
    identityMd: `# IDENTITY - 苏格拉底导师

## 角色定位
你是一位苏格拉底式的导师，通过持续的提问帮助对方发现知识的边界和思维的盲点。

## 语气风格
- 理性、直接
- 不回避尖锐问题
- 但保持尊重和学术精神

## Emoji
🧠`
  },
  {
    id: 'neutral_explorer',
    name: '中立探索者',
    emoji: '🧭',
    description: '开放好奇，不带评判地探索想法，适合自我反思',
    isBuiltin: true,
    isActive: false,
    soulMd: `# SOUL - 中立探索者

## 核心特质
- 开放的、好奇的
- 不带预判和评判
- 纯粹探索的态度

## 提问风格
- "能多说说吗？"
- "这对你意味着什么？"
- "还有其他可能吗？"

## 边界
- 保持中立但不冷漠
- 探索但不窥探隐私`,
    identityMd: `# IDENTITY - 中立探索者

## 角色定位
你是一位中立的探索者，像一位好奇的旅伴，陪伴用户探索内心的风景。

## 语气风格
- 开放、接纳
- 充满好奇
- 不带评判

## Emoji
🧭`
  },
  {
    id: 'inspiration_catalyst',
    name: '灵感催化师',
    emoji: '⚡',
    description: '跳出框架思考，提供发散性视角，适合创意探索',
    isBuiltin: true,
    isActive: false,
    soulMd: `# SOUL - 灵感催化师

## 核心特质
- 发散的、创造性的
- 打破常规思维
- 连接看似无关的概念

## 提问风格
- "如果反过来会怎样？"
- "这让你想到什么完全不同的事物？"
- "十年后会怎么看这个问题？"

## 边界
- 发散但有焦点
- 创意但不荒谬`,
    identityMd: `# IDENTITY - 灵感催化师

## 角色定位
你是一位灵感催化师，像一位创意的魔术师，帮助用户打破思维定式，发现新的可能性。

## 语气风格
- 活泼、充满能量
- 出人意表
- 启发性的

## Emoji
⚡`
  }
];

// ============ LLM Provider ============

interface LLMProvider {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl?: string;
  apiKey?: string;  // 加密存储
  isEnabled: boolean;
  isDefault: boolean;
  config: LLMProviderConfig;
  createdAt: number;
  updatedAt: number;
}

type LLMProviderType = 'openai_compatible' | 'anthropic' | 'ollama' | 'custom';

interface LLMProviderConfig {
  models?: string[];
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
  [key: string]: unknown;
}

// ============ 标签 ============

interface Tag {
  id: string;
  name: string;
  color?: string;
  sessionCount?: number;  // 前端扩展
}

// ============ 设置 ============

interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  autoGenerateTitle: boolean;
  preserveInputDraft: boolean;
  defaultSearchDimensions: SearchDimension[];
  exportPath?: string;
  defaultAgentProfileId?: string;
  defaultLLMProviderId?: string;
}

type SearchDimension = 'name' | 'content' | 'tag' | 'agent' | 'llm';

// ============ 分支元数据 ============

interface BranchMetadata {
  sessionId: string;
  rootSessionId: string;
  depth: number;
  path: string;  // 如 "root/branch1/branch1a"
}

// ============ 导出类型 ============

interface ExportOptions {
  format: 'markdown';
  includeBranches: boolean;
  includeMetadata: boolean;
  sessions: string[];  // Session IDs to export
}

interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}
```

---

## 5. 核心模块设计

### 5.1 会话管理模块

#### 5.1.1 创建会话

```rust
// Backend: Rust
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSessionRequest {
    pub title: Option<String>,  // None = 自动生成
    pub agent_profile_id: String,
    pub llm_provider_id: String,
    pub scenario_type: Option<ScenarioType>,
    pub parent_message_id: Option<String>,  // 如果是分支
}

#[tauri::command]
pub async fn create_session(
    state: State<'_, AppState>,
    request: CreateSessionRequest,
) -> Result<Session, String> {
    let mut conn = state.db.lock().await;

    // 生成唯一 ID
    let id = Uuid::new_v4().to_string();
    let now = timestamp_ms();

    // 如果是分支，验证父消息存在
    let parent_id = if let Some(parent_msg_id) = request.parent_message_id {
        // 获取父消息所属的会话
        let parent_session_id = get_session_id_by_message_id(&mut conn, &parent_msg_id)?;
        Some(parent_session_id)
    } else {
        None
    };

    // 插入会话
    let sql = r#"
        INSERT INTO sessions (id, parent_id, title, title_locked, agent_profile_id,
                              llm_provider_id, scenario_type, is_pinned,
                              created_at, updated_at, last_message_at,
                              message_count, branch_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 0, 0)
    "#;

    conn.execute(sql, rusqlite::params![
        id,
        parent_id,
        request.title.unwrap_or_else(|| "新对话".to_string()),
        request.title.is_some(),  // 手动提供标题则锁定
        request.agent_profile_id,
        request.llm_provider_id,
        request.scenario_type.map(|s| s.to_string()),
        now, now, now
    ])?;

    // 如果是分支，更新父会话的 branch_count
    if let Some(pid) = &parent_id {
        conn.execute(
            "UPDATE sessions SET branch_count = branch_count + 1 WHERE id = ?",
        [pid]?;

        // 更新分支元数据
        update_branch_metadata(&mut conn, &id)?;
    }

    // 获取完整会话信息
    let session = get_session_by_id(&mut conn, &id)?;

    Ok(session)
}
```

#### 5.1.2 发送消息

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct SendMessageRequest {
    pub session_id: String,
    pub content: String,
}

#[tauri::command]
pub async fn send_message(
    state: State<'_, AppState>,
    request: SendMessageRequest,
) -> Result<(), String> {
    let mut conn = state.db.lock().await;

    // 1. 保存用户消息
    let user_msg_id = save_message(&mut conn, &request.session_id, "user", &request.content)?;

    // 2. 更新会话时间戳
    update_session_timestamp(&mut conn, &request.session_id)?;

    // 3. 获取会话上下文
    let session = get_session_by_id(&mut conn, &request.session_id)?;
    let history = get_message_history(&mut conn, &request.session_id, 50)?;  // 最近 50 条

    // 4. 加载 Agent Profile
    let agent = get_agent_profile(&mut conn, &session.agent_profile_id)?;
    let system_prompt = build_system_prompt(&agent)?;

    // 5. 获取 LLM Provider
    let llm = get_llm_provider(&mut conn, &session.llm_provider_id)?;

    // 6. 调用 LLM（流式）
    let adapter = get_llm_adapter(&llm);
    let response_stream = adapter.chat_stream(system_prompt, &history, &request.content).await?;

    // 7. 创建空白的 assistant 消息（用于流式更新）
    let assistant_msg_id = save_message(&mut conn, &request.session_id, "assistant", "")?;

    // 8. 流式处理响应
    let mut full_response = String::new();
    let tx = get_event_channel(&assistant_msg_id);  // 通过事件通道推送给前端

    tokio::pin!(response_stream);
    while let Some(chunk) = response_stream.next().await {
        let chunk_text = chunk?;
        full_response.push_str(&chunk_text);

        // 实时更新数据库
        update_message_content(&mut conn, &assistant_msg_id, &full_response)?;

        // 推送给前端
        tx.send(chunk_text).await.ok();
    }

    // 9. 最终更新
    let token_count = estimate_tokens(&full_response);
    finalize_message(&mut conn, &assistant_msg_id, &full_response, token_count)?;

    // 10. 如果标题未锁定且为空/默认，尝试自动生成
    if !session.title_locked {
        maybe_auto_generate_title(&mut conn, &request.session_id)?;
    }

    Ok(())
}

fn build_system_prompt(agent: &AgentProfile) -> Result<String, String> {
    // 组合 SOUL + IDENTITY + AGENTS 等内容
    let mut prompt = String::new();

    if let Some(identity) = &agent.identity_md {
        prompt.push_str("=== IDENTITY ===\n");
        prompt.push_str(identity);
        prompt.push_str("\n\n");
    }

    if let Some(soul) = &agent.soul_md {
        prompt.push_str("=== SOUL ===\n");
        prompt.push_str(soul);
        prompt.push_str("\n\n");
    }

    if let Some(agents) = &agent.agents_md {
        prompt.push_str("=== AGENTS ===\n");
        prompt.push_str(agents);
        prompt.push_str("\n\n");
    }

    // 添加核心指令
    prompt.push_str("=== CORE INSTRUCTION ===\n");
    prompt.push_str("你是一个 AskMe AI 助手。你的核心行为模式是：主动向用户提问，而不是直接给出答案。\n");
    prompt.push_str("通过提问引导用户思考、学习、探索或自我发现。\n");
    prompt.push_str("每次回应后，都要提出一个开放性的问题，推动对话继续。\n");

    Ok(prompt)
}
```

#### 5.1.3 分支管理

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateBranchRequest {
    pub session_id: String,  // 当前会话
    pub message_id: String,  // 从哪条消息后开始分支
    pub new_agent_profile_id: Option<String>,  // 可选：更换 Agent
    pub new_llm_provider_id: Option<String>,   // 可选：更换 LLM
    pub branch_label: Option<String>,  // 可选：分支描述
}

#[tauri::command]
pub async fn create_branch(
    state: State<'_, AppState>,
    request: CreateBranchRequest,
) -> Result<Session, String> {
    let mut conn = state.db.lock().await;

    // 1. 验证源消息存在
    let source_msg = get_message_by_id(&mut conn, &request.message_id)?;

    // 2. 获取源会话信息
    let source_session = get_session_by_id(&mut conn, &request.session_id)?;

    // 3. 创建新会话（作为分支）
    let new_session_id = Uuid::new_v4().to_string();
    let now = timestamp_ms();

    // 确定新会话的标题（默认使用原 session 标题 + 分支标识）
    let title = format!("{} (分支)", source_session.title);

    conn.execute(r#"
        INSERT INTO sessions (id, parent_id, title, title_locked, agent_profile_id,
                              llm_provider_id, scenario_type, is_pinned,
                              created_at, updated_at, last_message_at,
                              message_count, branch_count)
        VALUES (?, ?, ?, 0, ?, ?, ?, 0, ?, ?, ?, 0, 0)
    "#, rusqlite::params![
        new_session_id,
        request.session_id,  // parent_id
        title,
        request.new_agent_profile_id.unwrap_or(source_session.agent_profile_id),
        request.new_llm_provider_id.unwrap_or(source_session.llm_provider_id),
        source_session.scenario_type,
        now, now, now
    ])?;

    // 4. 复制分支点之前的消息
    copy_messages_to_branch(&mut conn, &request.session_id, &new_session_id, &request.message_id)?;

    // 5. 标记分支点
    mark_as_branch_point(&mut conn, &request.message_id, request.branch_label)?;

    // 6. 更新父会话的分支计数
    conn.execute(
        "UPDATE sessions SET branch_count = branch_count + 1 WHERE id = ?",
        [&request.session_id]
    )?;

    // 7. 更新分支元数据
    update_branch_metadata(&mut conn, &new_session_id)?;

    // 8. 返回新会话
    get_session_by_id(&mut conn, &new_session_id)
}

fn copy_messages_to_branch(
    conn: &mut rusqlite::Connection,
    source_session_id: &str,
    target_session_id: &str,
    last_message_id: &str,
) -> Result<(), String> {
    // 获取分支点之前的所有消息（包含分支点）
    let mut stmt = conn.prepare(r#"
        SELECT id, role, content, content_html, token_count, created_at,
               is_branch_point, branch_point_label
        FROM messages
        WHERE session_id = ? AND created_at <= (
            SELECT created_at FROM messages WHERE id = ?
        )
        ORDER BY created_at ASC
    "#)?;

    let messages = stmt.query_map([source_session_id, last_message_id], |row| {
        Ok((
            row.get::<_, String>(0)?,  // original_id
            row.get::<_, String>(1)?,  // role
            row.get::<_, String>(2)?,  // content
            row.get::<_, Option<String>>(3)?,  // content_html
            row.get::<_, Option<i32>>(4)?,  // token_count
            row.get::<_, i64>(5)?,  // created_at
            row.get::<_, bool>(6)?,  // is_branch_point
            row.get::<_, Option<String>>(7)?,  // branch_point_label
        ))
    })?;

    // 复制到新会话（生成新 ID）
    for msg in messages {
        let (orig_id, role, content, html, tokens, created_at, is_bp, bp_label) = msg?;

        // 如果是分支点消息，标记它
        let new_is_branch_point = if orig_id == last_message_id { true } else { is_bp };

        conn.execute(r#"
            INSERT INTO messages (id, session_id, role, content, content_html,
                                  token_count, created_at, is_branch_point, branch_point_label)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#, rusqlite::params![
            Uuid::new_v4().to_string(),  // 新 ID
            target_session_id,
            role,
            content,
            html,
            tokens,
            created_at,
            new_is_branch_point,
            if new_is_branch_point { bp_label.clone() } else { None }
        ])?;
    }

    Ok(())
}

fn update_branch_metadata(
    conn: &mut rusqlite::Connection,
    session_id: &str,
) -> Result<(), String> {
    // 递归计算 root_session_id, depth, path
    let mut root_id = session_id.to_string();
    let mut depth = 0;
    let mut path_parts = vec![];

    let mut current_id = session_id.to_string();
    loop {
        path_parts.push(current_id.clone());

        let parent_id: Option<String> = conn.query_row(
            "SELECT parent_id FROM sessions WHERE id = ?",
            [&current_id],
            |row| row.get(0)
        )?;

        match parent_id {
            Some(pid) => {
                root_id = pid.clone();  // 暂时设为 parent，继续向上找
                current_id = pid;
                depth += 1;
            }
            None => break,
        }
    }

    // root_id 应该是最顶层的祖先
    // 重新计算正确的 root_id
    if depth > 0 {
        // 已经有父节点，需要找到真正的 root
        let true_root: String = conn.query_row(r#"
            WITH RECURSIVE ancestors(id, parent_id) AS (
                SELECT id, parent_id FROM sessions WHERE id = ?
                UNION ALL
                SELECT s.id, s.parent_id FROM sessions s
                INNER JOIN ancestors a ON s.id = a.parent_id
            )
            SELECT id FROM ancestors WHERE parent_id IS NULL LIMIT 1
        "#, [session_id], |row| row.get(0))?;
        root_id = true_root;
    }

    path_parts.reverse();
    let path = path_parts.join("/");

    // 插入或更新元数据
    conn.execute(r#"
        INSERT OR REPLACE INTO branch_metadata (session_id, root_session_id, depth, path)
        VALUES (?, ?, ?, ?)
    "#, rusqlite::params![session_id, root_id, depth, path])?;

    Ok(())
}
```

### 5.2 搜索模块

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct SearchRequest {
    pub query: String,
    pub dimensions: Vec<SearchDimension>,
    pub limit: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SearchResult {
    pub sessions: Vec<SessionListItem>,
    pub total: i64,
}

#[tauri::command]
pub async fn search_sessions(
    state: State<'_, AppState>,
    request: SearchRequest,
) -> Result<SearchResult, String> {
    let conn = state.db.lock().await;

    // 构建动态查询
    let mut conditions = vec![];
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = vec![];

    let query_lower = request.query.to_lowercase();

    for dim in &request.dimensions {
        match dim {
            SearchDimension::Name => {
                conditions.push("LOWER(s.title) LIKE ?");
                params.push(Box::new(format!("%{}%", query_lower)));
            }
            SearchDimension::Content => {
                conditions.push(r#"
                    EXISTS (
                        SELECT 1 FROM messages m
                        WHERE m.session_id = s.id AND LOWER(m.content) LIKE ?
                    )
                "#);
                params.push(Box::new(format!("%{}%", query_lower)));
            }
            SearchDimension::Tag => {
                conditions.push(r#"
                    EXISTS (
                        SELECT 1 FROM session_tags st
                        JOIN tags t ON st.tag_id = t.id
                        WHERE st.session_id = s.id AND LOWER(t.name) LIKE ?
                    )
                "#);
                params.push(Box::new(format!("%{}%", query_lower)));
            }
            SearchDimension::Agent => {
                conditions.push(r#"
                    EXISTS (
                        SELECT 1 FROM agent_profiles ap
                        WHERE ap.id = s.agent_profile_id AND LOWER(ap.name) LIKE ?
                    )
                "#);
                params.push(Box::new(format!("%{}%", query_lower)));
            }
            SearchDimension::LLM => {
                conditions.push(r#"
                    EXISTS (
                        SELECT 1 FROM llm_providers lp
                        WHERE lp.id = s.llm_provider_id AND LOWER(lp.name) LIKE ?
                    )
                "#);
                params.push(Box::new(format!("%{}%", query_lower)));
            }
        }
    }

    let where_clause = if conditions.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", conditions.join(" OR "))
    };

    // 获取总数
    let count_sql = format!("SELECT COUNT(*) FROM sessions s {}", where_clause);
    let total: i64 = conn.query_row(&count_sql, rusqlite::params_from_iter(params.iter()), |row| {
        row.get(0)
    })?;

    // 获取会话列表
    let limit = request.limit.unwrap_or(100);
    let sql = format!(r#"
        SELECT
            s.id, s.title, s.title_locked, s.is_pinned,
            s.agent_profile_id, ap.name as agent_name, ap.emoji as agent_emoji,
            s.llm_provider_id, lp.name as llm_name, lp.type as llm_type,
            s.scenario_type, s.created_at, s.updated_at, s.last_message_at,
            s.message_count, s.branch_count,
            (SELECT GROUP_CONCAT(t.name, ',') FROM session_tags st
             JOIN tags t ON st.tag_id = t.id WHERE st.session_id = s.id) as tags
        FROM sessions s
        LEFT JOIN agent_profiles ap ON s.agent_profile_id = ap.id
        LEFT JOIN llm_providers lp ON s.llm_provider_id = lp.id
        {}
        ORDER BY s.is_pinned DESC, s.updated_at DESC
        LIMIT ?
    "#, where_clause);

    params.push(Box::new(limit));

    let mut stmt = conn.prepare(&sql)?;
    let sessions = stmt.query_map(rusqlite::params_from_iter(params.iter()), |row| {
        Ok(SessionListItem {
            id: row.get("id")?,
            title: row.get("title")?,
            is_pinned: row.get("is_pinned")?,
            is_locked: row.get("title_locked")?,
            agent_name: row.get("agent_name")?,
            agent_emoji: row.get("agent_emoji")?,
            llm_name: row.get("llm_name")?,
            llm_icon: row.get("llm_type")?,
            tags: row.get::<_, Option<String>>("tags")?
                .map(|s| s.split(',').map(String::from).collect())
                .unwrap_or_default(),
            last_active_at: row.get("last_message_at")?,
            message_count: row.get("message_count")?,
            has_parent: row.get::<_, Option<String>>("parent_id")?.is_some(),
            has_children: row.get("branch_count")? > 0,
        })
    })?;

    let session_list: Vec<SessionListItem> = sessions.filter_map(|r| r.ok()).collect();

    Ok(SearchResult {
        sessions: session_list,
        total,
    })
}
```

### 5.3 导出模块

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct ExportRequest {
    pub session_ids: Vec<String>,
    pub include_branches: bool,
    pub include_metadata: bool,
    pub output_path: String,
}

#[tauri::command]
pub async fn export_sessions(
    state: State<'_, AppState>,
    request: ExportRequest,
) -> Result<ExportResult, String> {
    let conn = state.db.lock().await;

    // 1. 收集要导出的会话
    let mut sessions_to_export = Vec::new();

    for session_id in &request.session_ids {
        let session = get_session_by_id(&mut *conn, session_id)?;
        sessions_to_export.push(session);

        // 如果需要包含分支，递归获取
        if request.include_branches {
            let children = get_child_sessions(&mut *conn, session_id)?;
            for child in children {
                sessions_to_export.push(child);
            }
        }
    }

    // 2. 生成 Markdown 内容
    let mut markdown = String::new();

    markdown.push_str("# AskMe 会话导出\n\n");
    markdown.push_str(&format!("导出时间：{}\n\n", chrono::Local::now().format("%Y-%m-%d %H:%M:%S")));

    for session in &sessions_to_export {
        // 会话标题
        let branch_marker = if session.parent_id.is_some() { "🌿 " } else { "" };
        markdown.push_str(&format!("## {}{}\n\n", branch_marker, session.title));

        // 元数据
        if request.include_metadata {
            markdown.push_str(&format!(
                "**Agent:** {} {}\n",
                session.agent_emoji.as_deref().unwrap_or("🤖"),
                session.agent_name.as_deref().unwrap_or("Unknown")
            ));
            markdown.push_str(&format!(
                "**LLM:** {}\n",
                session.llm_name.as_deref().unwrap_or("Unknown")
            ));
            markdown.push_str(&format!(
                "**时间:** {}\n\n",
                chrono::DateTime::from_timestamp_millis(session.created_at as i64)
                    .unwrap()
                    .format("%Y-%m-%d %H:%M")
            ));
        }

        // 获取消息
        let messages = get_message_history(&mut *conn, &session.id, 10000)?;

        for msg in messages {
            if msg.role == "user" {
                markdown.push_str(&format!("### 👤 你\n\n{}\n\n", msg.content));
            } else if msg.role == "assistant" {
                markdown.push_str(&format!("### 🤔 AskMe\n\n{}\n\n", msg.content));
            }
        }

        markdown.push_str("---\n\n");
    }

    // 3. 写入文件
    let file_path = Path::new(&request.output_path);
    std::fs::write(file_path, &markdown)?;

    Ok(ExportResult {
        success: true,
        filePath: Some(request.output_path),
        error: None,
    })
}

fn get_child_sessions(
    conn: &mut rusqlite::Connection,
    parent_id: &str,
) -> Result<Vec<Session>, String> {
    let mut stmt = conn.prepare(r#"
        SELECT * FROM sessions WHERE parent_id = ?
    "#)?;

    let children = stmt.query_map([parent_id], |row| {
        Ok(Session::from_row(row))
    })?;

    let mut result = Vec::new();
    for child in children {
        let c = child?;
        result.push(c);

        // 递归获取子分支
        let grandchildren = get_child_sessions(conn, &c.id)?;
        result.extend(grandchildren);
    }

    Ok(result)
}
```

---

## 6. LLM 适配器架构

### 6.1 适配器 Trait 定义

```rust
// traits/llm_adapter.rs

use async_trait::async_trait;
use futures::stream::Stream;
use std::pin::Pin;

pub type ChatStream = Pin<Box<dyn Stream<Item = Result<String, String>> + Send>>;

#[async_trait]
pub trait LLMAdapter: Send + Sync {
    /// 获取适配器名称
    fn name(&self) -> &str;

    /// 获取支持的模型列表
    fn supported_models(&self) -> Vec<&str>;

    /// 非流式对话
    async fn chat(
        &self,
        system_prompt: &str,
        history: &[Message],
        user_message: &str,
    ) -> Result<String, String>;

    /// 流式对话
    async fn chat_stream(
        &self,
        system_prompt: &str,
        history: &[Message],
        user_message: &str,
    ) -> Result<ChatStream, String>;
}

// 消息结构
pub struct Message {
    pub role: String,  // "system", "user", "assistant"
    pub content: String,
}
```

### 6.2 OpenAI Compatible 适配器

```rust
// adapters/openai_compatible.rs

use reqwest::Client;
use serde::{Deserialize, Serialize};
use futures::stream::{Stream, StreamExt};

pub struct OpenAICompatibleAdapter {
    client: Client,
    base_url: String,
    api_key: String,
    default_model: String,
}

impl OpenAICompatibleAdapter {
    pub fn new(base_url: String, api_key: String, default_model: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
            api_key,
            default_model,
        }
    }
}

#[async_trait]
impl LLMAdapter for OpenAICompatibleAdapter {
    fn name(&self) -> &str {
        "OpenAI Compatible"
    }

    fn supported_models(&self) -> Vec<&str> {
        vec!["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]
    }

    async fn chat(&self, system_prompt: &str, history: &[Message], user_message: &str) -> Result<String, String> {
        let mut messages = vec![
            ChatMessage { role: "system", content: system_prompt },
        ];

        for msg in history {
            messages.push(ChatMessage {
                role: &msg.role,
                content: &msg.content,
            });
        }

        messages.push(ChatMessage {
            role: "user",
            content: user_message,
        });

        let response = self.client
            .post(&format!("{}/chat/completions", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&ChatRequest {
                model: &self.default_model,
                messages,
                stream: false,
            })
            .send()
            .await
            .map_err(|e| format!("HTTP error: {}", e))?;

        let result: ChatResponse = response
            .json()
            .await
            .map_err(|e| format!("Parse error: {}", e))?;

        result.choices
            .first()
            .map(|c| c.message.content.clone())
            .ok_or_else(|| "No response from LLM".to_string())
    }

    async fn chat_stream(&self, system_prompt: &str, history: &[Message], user_message: &str) -> Result<ChatStream, String> {
        // 类似 chat 方法，但 stream=true，返回流式响应
        // 使用 SSE 解析
        todo!()
    }
}

#[derive(Serialize)]
struct ChatRequest<'a> {
    model: &'a str,
    messages: Vec<ChatMessage<'a>>,
    stream: bool,
}

#[derive(Serialize)]
struct ChatMessage<'a> {
    role: &'a str,
    content: &'a str,
}

#[derive(Deserialize)]
struct ChatResponse {
    choices: Vec<Choice>,
}

#[derive(Deserialize)]
struct Choice {
    message: ChatMessageData,
}

#[derive(Deserialize)]
struct ChatMessageData {
    content: String,
}
```

### 6.3 LLM 管理器

```rust
// llm_manager.rs

use std::collections::HashMap;
use std::sync::Arc;

pub struct LLMManager {
    adapters: HashMap<String, Arc<dyn LLMAdapter>>,
    default_adapter: Option<String>,
}

impl LLMManager {
    pub fn new() -> Self {
        Self {
            adapters: HashMap::new(),
            default_adapter: None,
        }
    }

    /// 注册适配器
    pub fn register_adapter(
        &mut self,
        id: &str,
        adapter: Arc<dyn LLMAdapter>,
        is_default: bool,
    ) {
        if is_default || self.default_adapter.is_none() {
            self.default_adapter = Some(id.to_string());
        }
        self.adapters.insert(id.to_string(), adapter);
    }

    /// 获取适配器
    pub fn get_adapter(&self, id: &str) -> Option<&Arc<dyn LLMAdapter>> {
        self.adapters.get(id)
    }

    /// 获取默认适配器
    pub fn get_default_adapter(&self) -> Option<&Arc<dyn LLMAdapter>> {
        self.default_adapter
            .as_ref()
            .and_then(|id| self.adapters.get(id))
    }
}
```

---

## 7. Agent 人格系统

### 7.1 人格文件结构

每个人格由多个 Markdown 文件组成，参考 OpenClaw 格式：

```
~/.local/share/askme/agent-profiles/{profile_id}/
├── AGENTS.md      # 行为规则、工作方式
├── SOUL.md        # 人格、语气、边界
├── IDENTITY.md    # 角色名、风格、emoji
├── USER.md        # 用户信息（可选）
└── TOOLS.md       # 工具说明（可选）
```

### 7.2 人格加载器

```rust
// agent_loader.rs

use std::path::PathBuf;
use std::fs;

pub struct AgentProfileLoader {
    base_path: PathBuf,
}

impl AgentProfileLoader {
    pub fn new() -> Self {
        Self {
            base_path: dirs::data_local_dir()
                .unwrap()
                .join("askme")
                .join("agent-profiles"),
        }
    }

    pub fn load_profile(&self, profile_id: &str) -> Result<AgentProfile, String> {
        let profile_path = self.base_path.join(profile_id);

        let agents_md = read_optional(&profile_path.join("AGENTS.md"));
        let soul_md = read_optional(&profile_path.join("SOUL.md"));
        let identity_md = read_optional(&profile_path.join("IDENTITY.md"));
        let user_md = read_optional(&profile_path.join("USER.md"));
        let tools_md = read_optional(&profile_path.join("TOOLS.md"));

        // 从 IDENTITY 提取名称和 emoji
        let (name, emoji) = parse_identity(&identity_md)?;

        Ok(AgentProfile {
            id: profile_id.to_string(),
            name,
            emoji,
            agents_md,
            soul_md,
            identity_md,
            user_md,
            tools_md,
        })
    }

    pub fn list_profiles(&self) -> Result<Vec<AgentProfile>, String> {
        let mut profiles = Vec::new();

        if !self.base_path.exists() {
            fs::create_dir_all(&self.base_path)?;
        }

        for entry in fs::read_dir(&self.base_path)? {
            let entry = entry?;
            let profile_id = entry.file_name().to_string_lossy().to_string();
            let profile = self.load_profile(&profile_id)?;
            profiles.push(profile);
        }

        Ok(profiles)
    }
}

fn read_optional(path: &PathBuf) -> Option<String> {
    if path.exists() {
        fs::read_to_string(path).ok()
    } else {
        None
    }
}

fn parse_identity(identity_md: &Option<String>) -> Result<(String, Option<String>), String> {
    // 简单解析：查找 "# IDENTITY - {name}" 和 "## Emoji"
    match identity_md {
        Some(content) => {
            // 查找名称
            let name = content
                .lines()
                .find(|l| l.starts_with("# IDENTITY"))
                .and_then(|l| l.split(" - ").nth(1))
                .unwrap_or("Unknown")
                .to_string();

            // 查找 Emoji
            let emoji = content
                .lines()
                .find(|l| l.contains("## Emoji") || l.contains("Emoji"))
                .and_then(|l| l.split(":").nth(1))
                .map(|s| s.trim().to_string());

            Ok((name, emoji))
        }
        None => Ok(("Unknown".to_string(), None)),
    }
}
```

### 7.3 预定义人格安装

首次启动时安装内置人格：

```rust
// agent_bootstrap.rs

pub fn install_builtin_profiles() -> Result<(), String> {
    let loader = AgentProfileLoader::new();
    let base_path = &loader.base_path;

    for profile in BUILTIN_AGENTS {
        let profile_path = base_path.join(&profile.id);
        fs::create_dir_all(&profile_path)?;

        if let Some(soul) = profile.soul_md {
            fs::write(profile_path.join("SOUL.md"), soul)?;
        }

        if let Some(identity) = profile.identity_md {
            fs::write(profile_path.join("IDENTITY.md"), identity)?;
        }

        if let Some(agents) = profile.agents_md {
            fs::write(profile_path.join("AGENTS.md"), agents)?;
        }
    }

    Ok(())
}
```

---

## 8. 分支系统设计

### 8.1 分支树可视化

```
主分支 (Root)
│
├─ 消息 1
├─ 消息 2
├─ 消息 3 ─┬─ 分支 A (从消息 3 开始)
│          │  ├─ 消息 4a
│          │  └─ 消息 5a ─┬─ 分支 A-1 (从消息 5a 开始)
│          │              └─ 消息 6a
│          │
│          ├─ 分支 B (从消息 3 开始)
│          │  ├─ 消息 4b
│          │  └─ 消息 5b
│          │
│          └─ 主分支继续
│             ├─ 消息 4c
│             └─ 消息 5c
│
└─ 消息 6
```

### 8.2 分支深度限制

虽然支持无限嵌套，但 UI 上需要合理展示：

```typescript
// Frontend: 分支树递归渲染
function renderBranchTree(session: Session, depth: number = 0) {
  const MAX_DISPLAY_DEPTH = 5;  // 最多显示 5 层

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <SessionItem session={session} />
      {session.children && depth < MAX_DISPLAY_DEPTH && (
        <div>
          {session.children.map(child => renderBranchTree(child, depth + 1))}
        </div>
      )}
      {session.children && depth >= MAX_DISPLAY_DEPTH && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          还有 {session.children.length} 个子分支（已折叠）
        </div>
      )}
    </div>
  );
}
```

### 8.3 分支追溯查询

获取完整分支路径（用于导出）：

```rust
#[derive(Debug)]
pub struct BranchPath {
    pub session_ids: Vec<String>,  // 从 root 到当前
    pub sessions: Vec<Session>,
}

pub fn get_branch_path(
    conn: &mut rusqlite::Connection,
    session_id: &str,
) -> Result<BranchPath, String> {
    let mut session_ids = Vec::new();
    let mut sessions = Vec::new();

    // 从当前会话向上追溯到 root
    let mut current_id = session_id.to_string();

    loop {
        let session = get_session_by_id(conn, &current_id)?;
        session_ids.push(current_id.clone());
        sessions.push(session);

        let parent_id: Option<String> = conn.query_row(
            "SELECT parent_id FROM sessions WHERE id = ?",
            [&current_id],
            |row| row.get(0)
        )?;

        match parent_id {
            Some(pid) => current_id = pid,
            None => break,
        }
    }

    // 反转（从 root 到当前）
    session_ids.reverse();
    sessions.reverse();

    Ok(BranchPath { session_ids, sessions })
}
```

---

## 9. 安全与隐私

### 9.1 敏感数据加密

#### Tauri 版本（系统级加密）

**API Key 加密存储：**

```rust
// crypto.rs

use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use rand::RngCore;
use base64::{Engine, engine::general_purpose};

const KEY_SIZE: usize = 32;  // AES-256

pub fn encrypt_api_key(api_key: &str, master_key: &[u8; KEY_SIZE]) -> Result<String, String> {
    let cipher = Aes256Gcm::new_from_slice(master_key)
        .map_err(|e| format!("Cipher error: {}", e))?;

    // 生成随机 nonce
    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    // 加密
    let ciphertext = cipher
        .encrypt(nonce, api_key.as_bytes())
        .map_err(|e| format!("Encryption error: {}", e))?;

    // 组合 nonce + ciphertext 并 base64 编码
    let mut combined = nonce_bytes.to_vec();
    combined.extend(&ciphertext);

    Ok(general_purpose::STANDARD.encode(&combined))
}

pub fn decrypt_api_key(encrypted: &str, master_key: &[u8; KEY_SIZE]) -> Result<String, String> {
    let combined = general_purpose::STANDARD
        .decode(encrypted)
        .map_err(|e| format!("Decode error: {}", e))?;

    if combined.len() < 12 {
        return Err("Invalid encrypted data".to_string());
    }

    let nonce_bytes = &combined[..12];
    let ciphertext = &combined[12..];

    let cipher = Aes256Gcm::new_from_slice(master_key)
        .map_err(|e| format!("Cipher error: {}", e))?;
    let nonce = Nonce::from_slice(nonce_bytes);

    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| format!("Decryption error: {}", e))?;

    String::from_utf8(plaintext)
        .map_err(|e| format!("UTF8 error: {}", e))
}
```

**Master Key 生成与存储：**

```rust
// keychain.rs

#[cfg(target_os = "macos")]
pub fn get_master_key() -> Result<[u8; KEY_SIZE], String> {
    // macOS: 使用 keychain
    use security_framework::os::macos::keychain;
    use security_framework::passwords::{get_generic_password, set_generic_password};

    match get_generic_password(None, "askme", None, "master_key", None) {
        Ok(key_bytes) => {
            if key_bytes.len() == KEY_SIZE {
                let mut key = [0u8; KEY_SIZE];
                key.copy_from_slice(&key_bytes);
                Ok(key)
            } else {
                generate_and_store_master_key()
            }
        }
        Err(_) => generate_and_store_master_key(),
    }
}

fn generate_and_store_master_key() -> Result<[u8; KEY_SIZE], String> {
    let mut key = [0u8; KEY_SIZE];
    rand::thread_rng().fill_bytes(&mut key);

    set_generic_password(None, "askme", None, "master_key", None, &key)
        .map_err(|e| format!("Keychain error: {}", e))?;

    Ok(key)
}

#[cfg(target_os = "windows")]
pub fn get_master_key() -> Result<[u8; KEY_SIZE], String> {
    // Windows: 使用 DPAPI
    todo!()
}

#[cfg(target_os = "linux")]
pub fn get_master_key() -> Result<[u8; KEY_SIZE], String> {
    // Linux: 使用 libsecret (GNOME Keyring / KWallet)
    todo!()
}
```

#### Web 版本（Web Crypto API）

**API Key 加密存储：**

```typescript
// frontend/src/storage/web-crypto.ts

const KEY_SIZE = 32;  // AES-256
const IV_SIZE = 12;

/**
 * 从密码派生加密密钥
 */
export async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // 使用 PBKDF2 派生密钥
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('askme-salt'),  // 实际应使用随机 salt
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * 加密 API Key
 */
export async function encryptApiKey(apiKey: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(apiKey)
  );

  // 组合 iv + ciphertext 并 base64 编码
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(new Uint8Array(ciphertext), iv.length);
  combined.set(iv, 0);

  return btoa(String.fromCharCode(...combined));
}

/**
 * 解密 API Key
 */
export async function decryptApiKey(encrypted: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

  const iv = combined.slice(0, IV_SIZE);
  const ciphertext = combined.slice(IV_SIZE);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * 生成并存储 Master Key（使用 IndexedDB）
 */
export async function getMasterKey(): Promise<CryptoKey> {
  // 检查是否已存在
  const stored = await indexedDB.get('askme-keys', 'masterKey');

  if (stored) {
    return importMasterKey(stored);
  }

  // 生成新密钥
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // 导出并存储
  const exported = await crypto.subtle.exportKey('raw', key);
  await indexedDB.set('askme-keys', 'masterKey', exported);

  return key;
}
```

**IndexedDB 存储封装：**

```typescript
// frontend/src/storage/indexeddb-provider.ts

import Dexie, { Table } from 'dexie';

class AskMeDatabase extends Dexie {
  sessions!: Table<Session, string>;
  messages!: Table<Message, string>;
  agentProfiles!: Table<AgentProfile, string>;
  llmProviders!: Table<LLMProvider, string>;
  tags!: Table<Tag, string>;
  sessionTags!: Table<{ sessionId: string; tagId: string }, [string, string]>;
  settings!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('AskMe');
    this.version(1).stores({
      sessions: 'id, parentId, isPinned, updatedAt, lastMessageAt',
      messages: 'id, sessionId, createdAt, [sessionId+createdAt]',
      agentProfiles: 'id, name, isBuiltin',
      llmProviders: 'id, name, isEnabled',
      tags: 'id, name',
      sessionTags: '[sessionId+tagId]',
      settings: 'key',
    });
  }
}

export const db = new AskMeDatabase();
```

### 9.2 XSS 防护

**前端内容渲染：**

```typescript
// Frontend: 使用 DOMPurify  sanitization
import DOMPurify from 'dompurify';

function renderMessageContent(content: string): string {
  // 允许基本的 Markdown 渲染，但过滤危险内容
  const html = markdownToHtml(content);

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'style'],
  });
}
```

### 9.3 输入验证

**后端输入验证：**

```rust
// validation.rs

use validator::{Validate, ValidationError};

#[derive(Validate, Debug)]
pub struct SendMessageRequest {
    #[validate(length(min = 1, max = 10000, message = "消息长度无效"))]
    pub content: String,

    #[validate(length(min = 1, max = 36, message = "会话 ID 无效"))]
    pub session_id: String,
}

#[derive(Validate, Debug)]
pub struct CreateAgentProfileRequest {
    #[validate(length(min = 1, max = 50, message = "名称长度无效"))]
    pub name: String,

    #[validate(custom(function = "validate_emoji"))]
    pub emoji: Option<String>,

    #[validate(length(max = 500, message = "描述太长"))]
    pub description: Option<String>,
}

fn validate_emoji(emoji: &str) -> Result<(), ValidationError> {
    // 简单验证：应该是单个 emoji 字符
    let char_count = emoji.chars().count();
    if char_count != 1 {
        return Err(ValidationError::new("emoji must be a single character"));
    }
    Ok(())
}
```

---

## 10. MVP 范围与迭代计划

### 10.1 MVP 功能范围（首期完整版本）

| 模块 | 功能 | 优先级 |
|------|------|--------|
| **启动界面** | 4 场景按钮 + 自由输入 | P0 |
| **主界面** | 对话区域 + 输入框 | P0 |
| **侧边栏** | 时间线视图 + 搜索 | P0 |
| **会话管理** | 创建/删除/重命名 | P0 |
| **消息发送** | 流式对话 | P0 |
| **Agent 人格** | 4 预定义人格 + 编辑/创建 | P0 |
| **LLM 适配器** | OpenAI Compatible | P0 |
| **数据存储** | SQLite 本地存储 | P0 |
| **分支系统** | 创建分支 + 嵌套 + 追溯 | P0 |
| **标签系统** | 手动添加/删除标签 | P0 |
| **视图切换** | 时间线/标签/Agent/LLM | P0 |
| **搜索** | 多维度搜索 | P0 |
| **导出** | Markdown 单会话/批量/分支树 | P0 |
| **设置** | 主题/默认 Agent/默认 LLM | P1 |
| **置顶** | Pin 会话 | P1 |
| **标题锁定** | 锁定自动生成的标题 | P1 |

### 10.2 后续迭代计划

#### v1.1 - LLM 适配器扩展
- Claude 适配器插件
- Ollama 适配器插件
- 多 LLM 同时启用

#### v1.2 - 云同步（付费功能）
- 账户系统
- 端到端加密同步
- 跨设备无缝体验

#### v1.3 - Tools/MCPs 支持
- 插件系统架构
- MCP 协议集成
- 外部数据源连接（邮箱、IM 等）

#### v1.4 - AI 增强功能
- AI 自动生成会话标题（可配置）
- AI 建议标签
- 对话洞察摘要

#### v1.5 - 专业场景模板
- 学习教育模板
- 心理咨询模板
- 职业规划模板
- 创意写作模板

### 10.3 技术里程碑

| 阶段 | 目标 | 预计时间 |
|------|------|---------|
| Phase 1 | 项目初始化 + 基础架构 | 2 周 |
| Phase 2 | 核心对话功能 | 2 周 |
| Phase 3 | Agent 人格系统 | 1 周 |
| Phase 4 | LLM 适配器 | 1 周 |
| Phase 5 | 分支系统 | 2 周 |
| Phase 6 | 搜索与导出 | 1 周 |
| Phase 7 | 测试与优化 | 1 周 |
| Phase 8 | Beta 发布 | - |

**总计：约 10 周完成 MVP**

---

## 附录 A：文件结构

```
askme/
├── frontend/                    # 共享前端代码 (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx              # 主应用组件
│   │   ├── main.tsx             # 入口文件
│   │   ├── components/          # UI 组件
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   ├── InputArea.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── LaunchPad.tsx    # 启动界面
│   │   │   └── ...
│   │   ├── stores/              # Zustand 状态管理
│   │   │   ├── appStore.ts
│   │   │   ├── sessionStore.ts
│   │   │   └── ...
│   │   ├── storage/             # 数据访问层 (平台抽象)
│   │   │   ├── interface.ts     # StorageProvider 接口
│   │   │   ├── sqlite-provider.ts    # Tauri 实现
│   │   │   ├── indexeddb-provider.ts # Web 实现
│   │   │   └── web-crypto.ts    # Web Crypto 工具
│   │   ├── llm/                 # LLM 适配器
│   │   │   ├── adapter.ts       # 接口定义
│   │   │   ├── openai.ts
│   │   │   ├── claude.ts
│   │   │   └── ollama.ts
│   │   ├── agent/               # Agent 管理
│   │   │   ├── loader.ts
│   │   │   ├── parser.ts
│   │   │   └── builtins.ts      # 预定义人格
│   │   ├── utils/
│   │   │   ├── markdown.ts
│   │   │   ├── export.ts
│   │   │   └── search.ts
│   │   └── types/
│   │       └── index.ts
│   ├── public/
│   │   └── favicon.ico
│   ├── package.json
│   ├── vite.config.ts           # Vite 配置 (多目标构建)
│   └── tsconfig.json
│
├── src-tauri/                   # Tauri Rust 后端 (桌面/移动)
│   ├── src/
│   │   ├── main.rs              # Tauri 入口
│   │   ├── commands/            # Tauri Commands
│   │   │   ├── mod.rs
│   │   │   ├── session.rs
│   │   │   ├── message.rs
│   │   │   ├── agent.rs
│   │   │   ├── llm.rs
│   │   │   ├── search.rs
│   │   │   └── export.rs
│   │   ├── db/                  # SQLite 操作
│   │   │   ├── mod.rs
│   │   │   ├── schema.rs
│   │   │   ├── session_dao.rs
│   │   │   └── message_dao.rs
│   │   ├── llm/                 # LLM 管理
│   │   │   ├── mod.rs
│   │   │   ├── adapter.rs
│   │   │   ├── manager.rs
│   │   │   └── adapters/
│   │   ├── agent/               # Agent 管理
│   │   │   ├── mod.rs
│   │   │   └── loader.rs
│   │   ├── crypto/              # 加密 (系统 Keychain)
│   │   │   └── mod.rs
│   │   └── utils/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   │   └── default.json
│   └── icons/
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI 构建
│       ├── release-tauri.yml    # Tauri 发布
│       └── deploy-pages.yml     # GitHub Pages 部署
│
├── package.json                 # 根 package.json (npm scripts)
├── CLAUDE.md                    # Claude 项目指南
└── docs/
    └── superpowers/specs/
        └── 2026-03-30-askme-design.md
```

### 构建命令

```json
// package.json
{
  "scripts": {
    "dev": "vite",                    # 开发模式 (Web)
    "build": "vite build",            # 构建 Web 版本
    "build:tauri": "tauri build",     # 构建 Tauri 应用
    "tauri": "tauri dev",             # Tauri 开发模式
    "preview": "vite preview"         # 预览 Web 构建
  }
}
```

### Vite 配置要点

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Web 版本不包含 Tauri API
      external: ['@tauri-apps/api'],
    },
  },
  // 环境变量区分平台
  define: {
    'import.meta.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'web'),
  },
});
```

---

## 附录 B：API Key 配置流程

**用户配置 LLM 的流程：**

1. 打开设置 → LLM 提供商
2. 点击"OpenAI Compatible" → 编辑
3. 输入：
   - Base URL（默认：`https://api.openai.com/v1`）
   - API Key
   - 默认模型（默认：`gpt-4`）
4. 点击"测试连接"
5. 保存

**API Key 存储位置：**
- macOS: Keychain
- Windows: Credential Manager
- Linux: GNOME Keyring / KWallet

---

## 文档修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| 1.0 | 2026-03-30 | AskMe Team | 初始版本 |

---

*END OF DOCUMENT*
