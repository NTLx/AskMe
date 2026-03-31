# AskMe 前端重构设计规格

**版本:** 1.0
**日期:** 2026-03-30
**状态:** 已确认

---

## 1. 概述

### 1.1 项目目标

全面重构 AskMe 前端项目，像素级遵守 UI_Reference 文件夹中的设计规范，实现 Dark 和 Light 双主题支持。

### 1.2 设计理念

**"The Digital Curator"** — 将 AI 定位为深思熟虑的知识策展人，而非玩具式聊天机器人。

核心原则：
- **No-Line 规则**：禁止使用 1px solid 边框分隔区域，通过背景色层级区分
- **Organic Layering**：有机分层，通过 surface 层级创造深度感
- **Asymmetric Balance**：非对称平衡，打破传统网格模板感

### 1.3 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **桌面框架**: Tauri 2.0
- **样式**: Tailwind CSS
- **状态管理**: Zustand

---

## 2. 设计系统

### 2.1 颜色系统 (Material 3 Tonal)

#### Dark 主题

| Token | 值 | 用途 |
|-------|-----|------|
| `primary` | `#ddccff` | 主要交互元素 |
| `primary-dim` | `#c3aef0` | 渐变终点 |
| `primary-container` | `#d1bcff` | 按钮背景、激活状态 |
| `on-primary-container` | `#47366f` | 按钮文字 |
| `tertiary` | `#ffd9e3` | AI 消息高亮 |
| `tertiary-fixed` | `#fec5d6` | AI accent bar |
| `secondary` | `#ccc2dc` | 次要元素 |
| `background` | `#0e0e11` | 页面背景 |
| `surface` | `#0e0e11` | 基础表面 |
| `surface-container-low` | `#141317` | 侧边栏 |
| `surface-container` | `#1a191e` | 卡片 |
| `surface-container-high` | `#201f25` | 用户消息气泡 |
| `surface-container-highest` | `#26252c` | 弹窗、下拉 |
| `surface-bright` | `#2d2b33` | 悬停状态 |
| `surface-container-lowest` | `#000000` | 输入框内背景 |
| `on-surface` | `#e8e4ee` | 主要文字 |
| `on-surface-variant` | `#ada9b3` | 次要文字 |
| `outline-variant` | `#49474f` | Ghost Border |

#### Light 主题

| Token | 值 | 用途 |
|-------|-----|------|
| `primary` | `#6750a5` | 主要交互元素 |
| `primary-dim` | `#5b4497` | 渐变终点 |
| `primary-container` | `#bba2fd` | 按钮背景 |
| `on-primary-container` | `#381e72` | 按钮文字 |
| `tertiary` | `#7b5270` | AI 消息高亮 |
| `tertiary-container` | `#f4bfe3` | AI accent bar |
| `background` | `#fbf8fc` | 页面背景 |
| `surface-container-low` | `#f5f3f8` | 侧边栏 |
| `surface-container` | `#efedf3` | 卡片 |
| `surface-container-lowest` | `#ffffff` | 输入框内背景 |
| `on-surface` | `#313238` | 主要文字 |
| `on-surface-variant` | `#5e5e65` | 次要文字 |

### 2.2 表面层级系统

**"No-Line" 规则**：通过背景色区分层级，禁止 1px 边框。

```
Layer 0: background (#0e0e11)        — 页面基础
Layer 1: surface-container-low       — 侧边栏
Layer 2: surface-container           — 卡片、内容区
Layer 3: surface-container-high      — 用户消息、输入框容器
Layer 4: surface-container-highest   — 弹窗、下拉菜单
Layer 5: surface-container-lowest    — 输入框内部 (#000)
```

### 2.3 字体系统

| Token | 字体 | 字重 | 用途 |
|-------|------|------|------|
| `display-lg` | Manrope | 800 | 首页大标题 |
| `display-md` | Manrope | 700 | 页面标题 |
| `title-lg` | Manrope | 600 | AI 生成的标题 |
| `title-md` | Manrope | 600 | 卡片标题 |
| `body-lg` | Inter | 400 | 用户消息 |
| `body-md` | Inter | 400 | AI 响应 |
| `label-md` | Inter | 500 | 标签、导航项 |

**字体文件**：本地部署，确保 Tauri 离线可用。

### 2.4 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| `DEFAULT` | `4px` | 微小圆角 |
| `lg` | `8px` | 小元素 |
| `xl` | `12px` | 卡片 |
| `2xl` | `16px` | 大卡片 |
| `full` | `9999px` | 按钮、输入框 (pill 样式) |

---

## 3. 布局组件

### 3.1 SideNavBar

**尺寸**: 固定宽度 `280px`，全高固定定位

**结构**:
```
┌─────────────────────────┐
│ Logo + 品牌名            │
├─────────────────────────┤
│ [+ New Session] 按钮     │
├─────────────────────────┤
│ 导航项                   │
│  • Timeline (激活)       │
│  • Tags                  │
│  • Agents                │
│  • LLM                   │
├─────────────────────────┤
│ Recent Sessions         │
│  • 会话列表...           │
├─────────────────────────┤
│ Settings | Help          │
│ 用户信息卡片             │
└─────────────────────────┘
```

**样式**:
- 背景: `surface-container-low`
- 激活状态: `primary-container` 背景 + `on-primary-container` 文字
- 悬停: `surface-bright` 背景
- 导航项圆角: `full` (9999px)

### 3.2 TopNavBar

**尺寸**: 高度 `60px`，sticky 定位

**样式**:
- 背景: `background` + 80% 透明度
- 毛玻璃: `backdrop-filter: blur(20px)`
- 边框: 无（通过背景变化区分）

**结构**:
```
┌──────────────────────────────────────────────────┐
│ 面包屑导航          │  Share │ Export │ ⋮ │ Avatar │
└──────────────────────────────────────────────────┘
```

### 3.3 主内容区布局

```css
.main-content {
  margin-left: 280px;
  min-height: 100vh;
  background: var(--background);
}
```

---

## 4. 页面组件

### 4.1 LaunchPad (首页)

**布局**: Bento Grid 不对称 4 列布局

**结构**:
```
┌─────────────────────────────────────────────────┐
│               智识的起点 (Hero)                  │
│          探索、构建与进化...                      │
├─────────┬───────────────────────┬───────────────┤
│ 理清思路 │     深入学习 (大卡片)    │  深度对话      │
│  🎯     │  📚 MOST POPULAR       │   💭         │
├─────────┴───────────────────────┴───────────────┤
│            寻求启发 (横跨整行)                    │
│   ✨ Inspiration Catalyst                        │
├─────────────────────────────────────────────────┤
│            中央输入框 (带光晕)                    │
│  🧠 💾 | 输入你想探讨的问题... | ↑              │
│       Custom Settings | Recent Drafts           │
└─────────────────────────────────────────────────┘
```

**背景光晕**:
- 右下角: `rgba(221, 204, 255, 0.05)` blur 120px
- 左上角: `rgba(254, 197, 214, 0.05)` blur 100px

**输入框聚焦效果**:
- 外部光晕: `blur(16px)` + gradient
- Ghost Border: `primary` 20% opacity

### 4.2 ChatArea (聊天界面)

**AI 消息**:
- 无容器
- 左侧 `tertiary-fixed` accent bar (2px)
- 文字直接在 `background` 上

**用户消息**:
- `surface-container-high` 背景
- 圆角: `1.5rem`，右上角无圆角
- 最大宽度: 80%

**浮动输入区**:
- 背景: 渐变 `linear-gradient(to top, background, transparent)`
- 输入框: `surface-container-lowest` (#000)
- 按钮样式: pill

**快捷操作按钮**:
- 位置: `bottom: 8rem; right: -1rem`
- 尺寸: 48px × 48px
- 光晕效果

### 4.3 Settings - Agent Personas

**人格卡片**: 2 × 2 网格

**激活状态指示**:
- 左侧 `primary` accent bar (4px)
- "Active" 标签 + 脉冲动画

**配置面板**:
- Tone 下拉
- Question Depth 下拉

### 4.4 Settings - LLM Configuration

**提供商卡片**: Bento-ish 布局 (3 列)

**OpenAI Compatible 大卡片**:
- 跨 2 列
- 左侧 `primary` accent bar
- 配置字段: Base URL, API Key, Model Selection

**插件卡片**:
- 单列
- "Install Plugin" 按钮

**统计概览**:
- Latency, Tokens/Mo, Uptime
- 同步动画

**高级参数表格**:
- Temperature: range slider
- Max Tokens: number input

---

## 5. 动画与交互

### 5.1 过渡动画

| 元素 | 属性 | 时长 | 缓动函数 |
|------|------|------|----------|
| 卡片背景 | background-color | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 按钮缩放 | transform | 150ms | `ease-out` |
| 输入框聚焦 | box-shadow | 300ms | `ease` |
| 消息操作按钮 | opacity | 300ms | `ease` |
| 主题切换 | color, background | 200ms | `ease` |

### 5.2 悬停状态

**卡片**:
- 背景: `surface-container` → `surface-bright`
- 图标: 向右移动 4px

**按钮**:
- 悬停: `scale(1.02)`
- 点击: `scale(0.95)`

**导航项**:
- 激活: `primary-container` 背景 + `on-primary-container` 文字
- 悬停: `surface-bright` 背景

### 5.3 光晕效果

**背景光晕**:
```css
.glow-primary {
  background: rgba(221, 204, 255, 0.05);
  filter: blur(100-120px);
  border-radius: 50%;
}

.glow-tertiary {
  background: rgba(254, 197, 214, 0.05);
  filter: blur(80-100px);
  border-radius: 50%;
}
```

**输入框聚焦光晕**:
```css
.input-focus-glow {
  background: linear-gradient(135deg,
    rgba(221, 204, 255, 0.2),
    rgba(254, 197, 214, 0.2));
  filter: blur(16px);
}
```

---

## 6. 主题切换机制

### 6.1 实现方案

通过 `data-theme` 属性切换主题：

```html
<html data-theme="dark">
```

### 6.2 CSS 变量映射

```css
:root {
  --primary: #6750a5;
  /* Light theme defaults */
}

[data-theme="dark"] {
  --primary: #ddccff;
  /* Dark theme overrides */
}
```

### 6.3 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dim': 'var(--primary-dim)',
        // ... 其他颜色 token
      }
    }
  }
}
```

---

## 7. 本地字体配置

### 7.1 字体文件

存放路径: `frontend/public/fonts/`

- `Manrope-Variable.woff2`
- `Inter-Variable.woff2`

### 7.2 CSS 引入

```css
@font-face {
  font-family: 'Manrope';
  src: url('/fonts/Manrope-Variable.woff2') format('woff2');
  font-weight: 400 800;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 400 600;
  font-display: swap;
}
```

---

## 8. 文件结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── SideNavBar.tsx
│   │   │   ├── TopNavBar.tsx
│   │   │   └── MainContent.tsx
│   │   ├── pages/
│   │   │   ├── LaunchPad.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   └── Settings/
│   │   │       ├── AgentPersonas.tsx
│   │   │       └── LLMConfiguration.tsx
│   │   └── ...
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── dark.css
│   │   │   └── light.css
│   │   └── globals.css
│   └── ...
├── public/
│   └── fonts/
│       ├── Manrope-Variable.woff2
│       └── Inter-Variable.woff2
└── tailwind.config.js
```

---

## 9. 实施计划

采用 **方案 B: 设计系统优先** 的渐进式实施策略：

1. **Phase 1**: 设计系统基础
   - Tailwind 配置（颜色、字体、圆角）
   - 主题切换机制（data-theme）
   - 本地字体文件引入
   - 基础 UI 组件库

2. **Phase 2**: 布局组件
   - SideNavBar（固定宽度 280px）
   - TopNavBar（毛玻璃效果）
   - 主内容区布局容器

3. **Phase 3**: 页面组件
   - LaunchPad（Bento Grid）
   - ChatArea（消息流）
   - Settings（Agent/LLM 配置）

4. **Phase 4**: 细节打磨
   - 动画过渡效果
   - 交互状态（hover/active）
   - 光晕背景效果

---

## 10. 验收标准

- [ ] 所有颜色 token 正确实现
- [ ] 双主题切换正常工作
- [ ] 无 1px solid 边框分隔区域
- [ ] Surface 层级正确应用
- [ ] 字体正确加载（离线可用）
- [ ] 所有圆角符合规范
- [ ] 动画效果流畅
- [ ] 悬停状态正确
- [ ] 光晕效果正确渲染
- [ ] 响应式布局正确

---

**Co-Authored-By: Claude Code <noreply@anthropic.com>**