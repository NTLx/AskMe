# AskMe 前端全面重构设计文档

## 1. 项目概述

### 1.1 背景与目标
基于 UI_Reference 中的四套设计稿（Web 浅色/深色、手机浅色/深色）对 AskMe 项目前端进行全面重构，实现像素级设计还原。

### 1.2 设计系统变体
| 变体 | 创意名称 | Primary Color | Surface Base |
|------|----------|---------------|--------------|
| Web Light | The Editorial Academic | #6750a5 (Purple) | #fbf8fc |
| Web Dark | The Intellectual Canvas | #ddccff (Violet) | #0e0e11 |
| Phone Light | The Intellectual Atelier | #004f51 (Teal) | #f8f9fa |
| Phone Dark | The Digital Nocturne | #57f1db (Teal) | #0b1326 |

---

## 2. 颜色系统

### 2.1 Web Light - The Editorial Academic

```css
/* Primary */
--primary: #6750a5;
--primary-dim: #5b4497;
--primary-container: #bba2fd;
--primary-fixed: #bba2fd;
--on-primary: #fdf7ff;
--on-primary-container: #381e72;

/* Secondary */
--secondary: #625c71;
--secondary-container: #e8def8;
--on-secondary: #fdf7ff;
--on-secondary-container: #554f63;

/* Tertiary */
--tertiary: #7b5270;
--tertiary-container: #f4bfe3;
--on-tertiary: #fff7f9;
--on-tertiary-container: #5f3956;

/* Surface */
--background: #fbf8fc;
--surface: #fbf8fc;
--surface-container-low: #f5f3f8;
--surface-container-lowest: #ffffff;
--surface-container: #efedf3;
--surface-container-high: #e9e7ee;
--surface-container-highest: #e3e1e9;
--surface-variant: #e3e1e9;
--surface-dim: #dad9e1;
--surface-bright: #fbf8fc;

/* Text */
--on-surface: #313238;
--on-surface-variant: #5e5e65;
--on-surface-muted: #9e9ca0;

/* Outline */
--outline: #7a7a81;
--outline-variant: #b2b1b8;

/* Shadows */
--shadow: rgba(49, 50, 56, 0.06);
--shadow-lg: 0 20px 50px rgba(49, 50, 56, 0.12);
--shadow-glow: rgba(103, 80, 165, 0.2);
```

### 2.2 Web Dark - The Intellectual Canvas

```css
/* Primary */
--primary: #ddccff;
--primary-dim: #c3aef0;
--primary-container: #4f378b;
--primary-fixed: #ddccff;
--on-primary: #381e72;
--on-primary-container: #eaddff;

/* Secondary */
--secondary: #e8def8;
--secondary-container: #4a4458;
--on-secondary: #332d41;
--on-secondary-container: #e8def8;

/* Tertiary */
--tertiary: #fec5d6;
--tertiary-container: #633b48;
--on-tertiary: #492532;
--on-tertiary-container: #ffd9e3;

/* Surface */
--background: #0e0e11;
--surface: #0e0e11;
--surface-container-low: #141317;
--surface-container-lowest: #000000;
--surface-container: #1a191e;
--surface-container-high: #201f25;
--surface-container-highest: #26252c;
--surface-variant: #26252c;
--surface-dim: #0a0a0d;
--surface-bright: #2d2b33;

/* Text */
--on-surface: #e8e4ee;
--on-surface-variant: #cac4d0;
--on-surface-muted: #6f6b78;

/* Outline */
--outline: #938f99;
--outline-variant: #49474f;

/* Shadows */
--shadow: rgba(221, 204, 255, 0.04);
--shadow-lg: 0 32px 32px rgba(221, 204, 255, 0.08);
--shadow-glow: rgba(221, 204, 255, 0.3);
```

### 2.3 Phone Light - The Intellectual Atelier

```css
/* Primary */
--primary: #004f51;
--primary-dim: #00696b;
--primary-container: #00696b;
--primary-fixed: #a1f0f2;
--on-primary: #ffffff;
--on-primary-container: #96e5e7;

/* Secondary */
--secondary: #795900;
--secondary-container: #ffbf00;
--on-secondary: #ffffff;
--on-secondary-container: #6d5000;

/* Tertiary */
--tertiary: #1f4f3c;
--tertiary-container: #386753;
--on-tertiary: #ffffff;
--on-tertiary-container: #b0e3c9;

/* Surface */
--background: #f8f9fa;
--surface: #f8f9fa;
--surface-container-low: #f3f4f5;
--surface-container-lowest: #ffffff;
--surface-container: #edeeef;
--surface-container-high: #e7e8e9;
--surface-container-highest: #e1e3e4;
--surface-variant: #e1e3e4;
--surface-dim: #d9dadb;
--surface-bright: #f8f9fa;

/* Text */
--on-surface: #191c1d;
--on-surface-variant: #3e4949;
--on-surface-muted: #5e6969;

/* Outline */
--outline: #6e7979;
--outline-variant: #bec9c8;

/* Shadows */
--shadow: rgba(0, 79, 81, 0.08);
--shadow-lg: 0 12px 32px -4px rgba(0, 79, 81, 0.08);
--shadow-glow: rgba(255, 185, 95, 0.3);
```

### 2.4 Phone Dark - The Digital Nocturne

```css
/* Primary */
--primary: #57f1db;
--primary-dim: #2dd4bf;
--primary-container: #2dd4bf;
--primary-fixed: #57f1db;
--on-primary: #003731;
--on-primary-container: #e0f9f4;

/* Secondary */
--secondary: #ffb95f;
--secondary-container: #ffbf00;
--on-secondary: #000000;
--on-secondary-container: #fff8e6;

/* Tertiary */
--tertiary: #3cddc7;
--tertiary-container: #2dd4bf;
--on-tertiary: #003731;

/* Surface */
--background: #0b1326;
--surface: #0b1326;
--surface-container-low: #131b2e;
--surface-container-lowest: #060e20;
--surface-container: #171f33;
--surface-container-high: #222a3d;
--surface-container-highest: #2d3449;
--surface-bright: #31394d;
--surface-dim: #0f1628;

/* Text */
--on-surface: #dae2fd;
--on-surface-variant: #bacac5;
--on-surface-muted: #8a9aa0;

/* Outline */
--outline: #859490;
--outline-variant: #3c4a46;

/* Shadows */
--shadow: rgba(60, 221, 199, 0.1);
--shadow-lg: 0 12px 32px -4px rgba(60, 221, 199, 0.1);
--shadow-glow: 0 0 20px rgba(87, 241, 219, 0.3);
```

---

## 3. 字体系统

### 3.1 字体选择
- **Display & Headlines**: Manrope (技术精确 + 现代感)
- **Body**: Inter (高可读性) / Manrope (手机版)
- **Labels**: Manrope

### 3.2 字号规范

| 样式 | Web 字号 | Phone 字号 | 字重 | 行高 |
|------|---------|-----------|------|------|
| display-lg | 3rem (48px) | 2.5rem (40px) | 800 | 1.1 |
| display-md | 2.25rem (36px) | 2rem (32px) | 700 | 1.2 |
| headline-lg | 1.5rem (24px) | 1.375rem (22px) | 600 | 1.3 |
| headline-md | 1.25rem (20px) | 1.125rem (18px) | 600 | 1.3 |
| title-lg | 1.125rem (18px) | 1rem (16px) | 500 | 1.4 |
| title-md | 1rem (16px) | 0.875rem (14px) | 500 | 1.4 |
| body-lg | 1.125rem (18px) | 1rem (16px) | 400 | 1.6-1.8 |
| body-md | 1rem (16px) | 0.875rem (14px) | 400 | 1.6 |
| label-lg | 0.875rem (14px) | 0.8125rem (13px) | 500 | 1.4 |
| label-md | 0.75rem (12px) | 0.6875rem (11px) | 500 | 1.4 |

### 3.3 字间距
- Display/Headline: `tracking-tight` (-0.02em)
- Labels: `tracking-widest` (0.1em) 大写时

---

## 4. 布局系统

### 4.1 断点
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: ≥ 1024px

### 4.2 导航布局

#### Desktop (≥768px)
```
┌─────────────────────────────────────────┐
│ TopNavBar (h: 64px, sticky, backdrop-blur) │
├────────────┬────────────────────────────┤
│            │                            │
│  Sidebar   │       Main Content         │
│  w: 280px  │                            │
│  (fixed)   │                            │
│            │                            │
│  - Logo    │  [Page Content]            │
│  - Nav     │                            │
│  - User    │                            │
│            ├────────────────────────────┤
│            │  InputArea (fixed bottom)  │
└────────────┴────────────────────────────┘
```

#### Mobile (<768px)
```
┌─────────────────────────┐
│     TopNavBar           │
├─────────────────────────┤
│                         │
│   [Page Content]        │
│                         │
│                         │
│                         │
├─────────────────────────┤
│  BottomNav (h: 80px,    │
│  glassmorphism)         │
└─────────────────────────┘
```

### 4.3 间距系统
- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)
- `--spacing-20`: 5rem (80px)
- `--spacing-24`: 6rem (96px)

### 4.4 圆角系统
- `--radius-sm`: 0.25rem (4px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)
- `--radius-2xl`: 1.5rem (24px)
- `--radius-3xl`: 2rem (32px)
- `--radius-full`: 9999px (pill)

---

## 5. 组件规范

### 5.1 SideNavBar (桌面侧边栏)

#### 结构
```tsx
<aside class="w-[280px] h-screen fixed left-0 top-0 bg-surface-container flex flex-col">
  {/* Logo Section */}
  <div class="py-8 px-6">
    <h1 class="text-xl font-bold text-primary">The Curator</h1>
    <p class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Academic Scholar</p>
  </div>
  
  {/* Navigation */}
  <nav class="flex-1 px-4 space-y-2">
    {/* Nav Item */}
    <a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-[surface-container-lowest]/50 rounded-lg transition-all">
      <span class="material-symbols-outlined">icon</span>
      <span class="text-sm font-medium tracking-tight">Label</span>
    </a>
    
    {/* Active Nav Item */}
    <a class="flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-container-lowest rounded-lg">
      <span class="material-symbols-outlined">icon</span>
      <span class="text-sm tracking-tight">Label</span>
    </a>
  </nav>
  
  {/* User Section */}
  <div class="py-6 px-4 border-t border-outline-variant/10">
    {/* User Avatar + Info */}
  </div>
</aside>
```

#### 样式规范
- 背景：`surface-container` (#efedf3 light / #141317 dark)
- 无边框，通过背景色区分层级
- Logo 区域底部 margin: 2.5rem (40px)
- 导航项高度：48px (py-3 + py-3)
- 激活项：白色背景 + primary 文字 + 粗体

### 5.2 TopNavBar (顶部导航栏)

#### 结构
```tsx
<header class="sticky top-0 z-50 h-16 bg-surface/70 backdrop-blur-xl flex items-center justify-between px-10 shadow-lg">
  {/* Left: Logo + Current Session */}
  <div class="flex items-center gap-4">
    <h1 class="text-lg font-extrabold tracking-tight text-on-surface">AskMe AI</h1>
    <span class="h-4 w-px bg-outline-variant/30"></span>
    <nav class="hidden md:flex">
      <a class="text-sm font-semibold text-primary border-b-2 border-primary">Session Name</a>
    </nav>
  </div>
  
  {/* Right: Actions */}
  <div class="flex items-center gap-3">
    <button class="p-2 text-on-surface-variant hover:text-primary transition-colors">
      <span class="material-symbols-outlined">icon</span>
    </button>
  </div>
</header>
```

#### 样式规范
- 高度：64px
- 背景：`surface` 70% opacity + `backdrop-blur-xl` (20px)
- 阴影：`0 8px 32px 0 rgba(49, 50, 56, 0.06)` (light) / `0 8px 32px 0 rgba(221, 204, 255, 0.04)` (dark)
- 水平内边距：40px (desktop) / 24px (mobile)

### 5.3 BottomNav (手机底部导航)

#### 结构
```tsx
<nav class="md:hidden fixed bottom-0 w-full h-20 bg-surface-container-lowest/85 backdrop-blur-xl flex justify-around items-center px-4 pb-safe shadow-[0_-12px_32px_-4px_rgba(0,79,81,0.08)] rounded-t-3xl">
  <button class="flex flex-col items-center p-3">
    <span class="material-symbols-outlined">icon</span>
  </button>
  {/* Primary FAB Button */}
  <button class="bg-secondary-container text-on-secondary-container rounded-2xl p-3">
    <span class="material-symbols-outlined">add</span>
  </button>
  {/* More items... */}
</nav>
```

#### 样式规范
- 高度：80px + safe-area-bottom
- 背景：`surface-container-lowest` 85% opacity + `backdrop-blur-xl`
- 圆角：顶部 `rounded-t-3xl`
- 阴影：使用 primary 色调的阴影
- 选中项：amber 背景高亮

### 5.4 LaunchPad (启动台)

#### 结构
```tsx
<section class="mb-16">
  {/* Hero */}
  <h2 class="text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
    智识的起点<br/>
    <span class="text-primary-dim opacity-90">The Starting Point of Knowledge.</span>
  </h2>
  <p class="text-lg text-on-surface-variant max-w-2xl font-medium leading-relaxed">
    Explore, construct, and evolve...
  </p>
  
  {/* Scenario Cards Bento Grid */}
  <div class="grid grid-cols-12 gap-6">
    {/* Standard Card */}
    <div class="col-span-12 md:col-span-4 group cursor-pointer bg-surface-container-low hover:bg-surface-container-lowest p-8 rounded-xl transition-all duration-300">
      {/* Card Content */}
    </div>
    
    {/* Featured Card (Most Popular) */}
    <div class="col-span-12 md:col-span-4 group cursor-pointer bg-primary-container/10 hover:bg-primary-container/20 p-8 rounded-xl relative overflow-hidden">
      <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
        Most Popular
      </div>
    </div>
    
    {/* Full Width Card */}
    <div class="col-span-12 group cursor-pointer bg-surface-container-high hover:bg-surface-container-lowest p-10 flex items-center gap-8 min-h-[160px]">
      {/* Card Content */}
    </div>
  </div>
</section>
```

#### 样式规范
- Hero 标题：display-lg (48px), font-extrabold, tracking-tight
- 副标题：primary-dim 90% opacity
- 卡片网格：12 列，gap-6 (24px)
- 卡片悬停：背景色变化 + 阴影，无 Y 轴位移
- "Most Popular" 标签：10px, uppercase, tracking-widest

### 5.5 ChatArea (对话区域)

#### 结构
```tsx
<div class="flex-1 overflow-y-auto custom-scrollbar px-10 py-12 space-y-10">
  {/* System Annotation */}
  <div class="relative pl-12">
    <div class="absolute left-0 top-0 text-tertiary">
      <span class="material-symbols-outlined">auto_awesome</span>
    </div>
    <p class="text-xs italic text-tertiary mb-2">Academic context initialized...</p>
    <div class="h-px w-24 bg-tertiary/20"></div>
  </div>
  
  {/* AI Message */}
  <div class="flex flex-col items-start max-w-[85%]">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <span class="material-symbols-outlined text-sm">forum</span>
      </div>
      <span class="text-xs font-bold uppercase tracking-widest">AskMe Assistant</span>
    </div>
    <div class="bg-surface-container text-on-surface p-5 rounded-2xl rounded-tl-none">
      <p class="text-base leading-relaxed">Message content...</p>
    </div>
    <span class="text-[10px] text-on-surface-variant mt-2">Sent via Agent • 10:24 AM</span>
  </div>
  
  {/* User Message */}
  <div class="flex flex-col items-end self-end max-w-[85%]">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-xs font-bold uppercase tracking-widest">You</span>
    </div>
    <div class="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none">
      <p class="text-base leading-relaxed">User message...</p>
    </div>
  </div>
  
  {/* AI Thinking Indicator */}
  <div class="flex justify-center my-8">
    <div class="bg-surface-container-low px-6 py-3 rounded-full border border-outline-variant/10 flex items-center gap-3">
      <span class="material-symbols-outlined text-primary text-sm">tips_and_updates</span>
      <p class="text-xs text-on-surface-variant">Analyzing your response...</p>
    </div>
  </div>
</div>
```

#### 样式规范
- AI 消息：无容器，直接显示在 background 上，左侧 2px tertiary 竖线 accent bar
- 用户消息：`primary` 背景 + `rounded-tr-none` 不对称圆角
- 消息最大宽度：85%
- 时间戳：10px，muted 颜色

### 5.6 InputArea (输入框)

#### 结构
```tsx
<div class="fixed bottom-10 left-[calc(280px+2.5rem)] right-10 z-50">
  <div class="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-lg p-2 flex items-center gap-2 border border-outline-variant/10">
    <button class="p-3 text-on-surface-variant hover:text-primary">
      <span class="material-symbols-outlined">attach_file</span>
    </button>
    <input 
      class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline py-4 px-2"
      placeholder="Start your inquiry here..."
    />
    <button class="p-3 text-on-surface-variant hover:text-primary">
      <span class="material-symbols-outlined">mic</span>
    </button>
    <button class="w-12 h-12 bg-primary hover:bg-primary-dim rounded-xl flex items-center justify-center text-on-primary transition-all active:scale-95 shadow-lg shadow-primary/20">
      <span class="material-symbols-outlined">arrow_upward</span>
    </button>
  </div>
</div>
```

#### 样式规范
- 位置：fixed bottom-10 (40px)
- 背景：`surface-container-lowest` + 阴影
- 圆角：rounded-2xl (24px)
- 边框：`outline-variant` 10% opacity (Ghost Border)
- 发送按钮：primary 背景 + 阴影 + hover scale
- 聚焦状态：2px ring primary 20% opacity

### 5.7 Settings 页面

#### 结构
```tsx
<div class="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-12">
  {/* Header */}
  <div class="space-y-2">
    <div class="flex items-center gap-2 text-primary font-bold">
      <span class="material-symbols-outlined text-sm">settings</span>
      <span class="text-xs uppercase tracking-widest">System Preferences</span>
    </div>
    <h3 class="text-4xl md:text-5xl font-extrabold text-on-surface">
      Agent Personas <span class="text-on-surface-variant/40 font-normal">人格</span>
    </h3>
  </div>
  
  {/* Agent Grid */}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Agent Card */}
    <div class="group p-8 rounded-[2rem] bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high transition-all">
      <div class="space-y-6">
        <div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center">
          <span class="text-3xl">🧠</span>
        </div>
        <div>
          <h4 class="text-2xl font-bold text-on-surface mb-2">Socratic Mentor</h4>
          <p class="text-on-surface-variant leading-relaxed">Description...</p>
        </div>
        <div class="flex gap-3 pt-4">
          <button class="flex-1 bg-primary text-on-primary px-4 py-3 rounded-xl font-bold text-sm">Select</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 样式规范
- 页面内边距：24px (mobile) / 48px (desktop)
- 标题：4xl (mobile) / 5xl (desktop)
- Agent 卡片：rounded-[2rem] (32px)
- 卡片间距：gap-8 (32px)
- 激活卡片：border-primary + ring-2 ring-primary

---

## 6. 动效系统

### 6.1 过渡动画
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### 6.2 组件动效规范

| 组件 | 动效类型 | 持续时间 | 缓动函数 |
|------|---------|---------|---------|
| Button hover | scale + background | 200ms | ease-in-out |
| Card hover | background-color | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Nav item | color + background | 200ms | ease-in-out |
| Input focus | ghost border + glow | 200ms | ease-out |
| Modal | fade + scale | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Page transition | fade + slide | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |

### 6.3 特殊动效

#### Ghost Border (输入框)
```css
.input:focus {
  border: 1px solid var(--primary);
  border-opacity: 0.2;
  box-shadow: 0 0 4px var(--primary);
  /* 从中心向外扩散 */
  animation: ghost-border-expand 200ms ease-out;
}

@keyframes ghost-border-expand {
  from {
    border-width: 0;
  }
  to {
    border-width: 1px;
  }
}
```

#### Card Hover (无位移 tonal)
```css
.card {
  transition: background-color var(--transition-base), 
              border-color var(--transition-base),
              box-shadow var(--transition-base);
}

.card:hover {
  background-color: var(--surface-container-highest);
  /* 不使用 transform: translateY */
}
```

#### Primary Gradient (按钮)
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dim));
}
```

---

## 7. 页面清单

| 页面 | 文件 | 说明 |
|------|------|------|
| LaunchPad | LaunchPad.tsx | 启动台首页，包含 Hero + Scenario Cards |
| ChatArea | ChatArea.tsx | 对话页面，包含消息列表 + 输入框 |
| Sidebar | Sidebar.tsx | 桌面侧边栏导航 |
| Settings | Settings.tsx | 设置页面（LLM配置等） |
| AgentPersonas | AgentPersonas.tsx | Agent人格选择 |
| Tags | Tags.tsx | 标签管理页面 |
| Timeline | Timeline.tsx | 时间线/历史记录 |
| LLM Configuration | LLMConfiguration.tsx | LLM 配置页面 |

---

## 8. 实现顺序

1. **设计令牌系统** - CSS 变量 + Tailwind 主题配置
2. **布局组件** - SideNavBar, TopNavBar, BottomNav
3. **基础 UI 组件** - Button, Input, Card (按设计系统重构)
4. **页面组件** - LaunchPad → ChatArea → Settings
5. **响应式适配** - 桌面/手机布局切换
6. **动效增强** - 过渡动画 + 特殊动效

---

## 9. 验收标准

- [ ] 四套主题颜色精确匹配设计稿
- [ ] 字体字号符合规范（Manrope/Inter）
- [ ] 无边框设计（通过背景色区分层级）
- [ ] 毛玻璃效果在导航栏正确实现
- [ ] 所有过渡动画使用 300ms cubic-bezier
- [ ] 响应式布局在 768px 断点正确切换
- [ ] Ghost Border 在输入框聚焦状态正确显示
- [ ] Scenario Cards 悬停效果为 tonal 而非位移
- [ ] 对话气泡符合 AI 消息(左侧 accent bar)/用户消息(asymmetric)规范
- [ ] 手机版 BottomNav 实现正确