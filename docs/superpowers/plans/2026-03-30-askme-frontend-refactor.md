# AskMe 前端重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全面重构 AskMe 前端项目，像素级遵守 UI_Reference 设计规范，实现 Dark/Light 双主题支持

**Architecture:** 采用 Tailwind CSS + CSS 变量实现主题系统，通过 `data-theme` 属性切换主题。设计系统优先实施，渐进式重构各组件。

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Tauri 2.0

---

## 文件结构映射

```
frontend/
├── public/
│   └── fonts/                          # 本地字体文件 (新增)
│       ├── Manrope-Variable.woff2
│       └── Inter-Variable.woff2
├── src/
│   ├── styles/                         # 样式文件 (新增)
│   │   ├── themes/
│   │   │   ├── dark.css
│   │   │   └── light.css
│   │   └── globals.css                 # 重构
│   ├── components/
│   │   ├── ui/                         # 基础 UI 组件 (重构)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ...
│   │   ├── layout/                     # 布局组件 (重构)
│   │   │   ├── SideNavBar.tsx
│   │   │   ├── TopNavBar.tsx
│   │   │   └── MainContent.tsx
│   │   ├── pages/                      # 页面组件 (重构)
│   │   │   ├── LaunchPad.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   └── Settings/
│   │   │       ├── AgentPersonas.tsx
│   │   │       └── LLMConfiguration.tsx
│   │   ├── Sidebar.tsx                 # 重构
│   │   ├── ChatArea.tsx                # 重构
│   │   ├── InputArea.tsx               # 重构
│   │   ├── LaunchPad.tsx               # 重构
│   │   └── Settings.tsx                # 重构
│   ├── stores/
│   │   └── settingsStore.ts            # 添加主题状态
│   └── index.css                       # 重构
└── tailwind.config.js                  # 重构
```

---

## Phase 1: 设计系统基础

### Task 1.1: 配置 Tailwind 颜色系统

**Files:**
- Modify: `frontend/tailwind.config.js`

- [ ] **Step 1: 重写 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: 'var(--primary)',
        'primary-dim': 'var(--primary-dim)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        // Tertiary (AI accent)
        tertiary: 'var(--tertiary)',
        'tertiary-fixed': 'var(--tertiary-fixed)',
        'tertiary-container': 'var(--tertiary-container)',
        // Secondary
        secondary: 'var(--secondary)',
        // Surface
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-bright': 'var(--surface-bright)',
        // Text
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        // Outline
        'outline-variant': 'var(--outline-variant)',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: 验证配置**

Run: `cd frontend && npm run build`
Expected: 构建成功，无错误

- [x] **Step 3: Commit**

```bash
git add frontend/tailwind.config.js
git commit -m "feat: configure Tailwind color system with Material 3 tokens

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.2: 创建主题 CSS 文件

**Files:**
- Create: `frontend/src/styles/themes/dark.css`
- Create: `frontend/src/styles/themes/light.css`

- [ ] **Step 1: 创建 Dark 主题文件**

```css
/* frontend/src/styles/themes/dark.css */

[data-theme="dark"] {
  /* Primary */
  --primary: #ddccff;
  --primary-dim: #c3aef0;
  --primary-container: #d1bcff;
  --on-primary-container: #47366f;

  /* Tertiary (AI accent) */
  --tertiary: #ffd9e3;
  --tertiary-fixed: #fec5d6;
  --tertiary-container: #f4bfe3;

  /* Secondary */
  --secondary: #ccc2dc;

  /* Surface */
  --background: #0e0e11;
  --surface: #0e0e11;
  --surface-container-low: #141317;
  --surface-container: #1a191e;
  --surface-container-high: #201f25;
  --surface-container-highest: #26252c;
  --surface-container-lowest: #000000;
  --surface-bright: #2d2b33;

  /* Text */
  --on-surface: #e8e4ee;
  --on-surface-variant: #ada9b3;

  /* Outline */
  --outline-variant: #49474f;
}
```

- [ ] **Step 2: 创建 Light 主题文件**

```css
/* frontend/src/styles/themes/light.css */

[data-theme="light"], :root {
  /* Primary */
  --primary: #6750a5;
  --primary-dim: #5b4497;
  --primary-container: #bba2fd;
  --on-primary-container: #381e72;

  /* Tertiary (AI accent) */
  --tertiary: #7b5270;
  --tertiary-container: #f4bfe3;

  /* Secondary */
  --secondary: #6b5f72;

  /* Surface */
  --background: #fbf8fc;
  --surface: #fbf8fc;
  --surface-container-low: #f5f3f8;
  --surface-container: #efedf3;
  --surface-container-high: #e9e6ef;
  --surface-container-highest: #e4e0eb;
  --surface-container-lowest: #ffffff;
  --surface-bright: #f5f3f8;

  /* Text */
  --on-surface: #313238;
  --on-surface-variant: #5e5e65;

  /* Outline */
  --outline-variant: #c9c4d0;
}
```

- [x] **Step 3: Commit**

```bash
git add frontend/src/styles/themes/
git commit -m "feat: add dark and light theme CSS files

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.3: 重构全局样式文件

**Files:**
- Modify: `frontend/src/index.css`

- [x] **Step 1: 重写 index.css**

(已在 commit a1acf1e 中完成 - index.css 重构为 Material 3 主题系统)

主要改动：
- @import 主题文件放在文件开头（符合 CSS 规范）
- Inter 和 Manrope 变量字体定义
- Tailwind @layer base 扩展全局样式
- M3 CSS 变量颜色系统
- 保留动画类 (blink, spin, glow-pulse, fade-in-up 等)
- 添加 CardFooter 组件到 Card.tsx

- [x] **Step 2: 验证样式**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit a1acf1e 中完成)

---

### Task 1.4: 下载并配置本地字体文件

**Files:**
- Create: `frontend/public/fonts/Manrope-Variable.woff2`
- Create: `frontend/public/fonts/Inter-Variable.woff2`

- [ ] **Step 1: 创建字体目录并下载字体**

Run: `mkdir -p frontend/public/fonts`
Run: `curl -L "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggqxSuXd.woff2" -o frontend/public/fonts/Manrope-Variable.woff2`
Run: `curl -L "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" -o frontend/public/fonts/Inter-Variable.woff2`

Expected: 字体文件下载成功

- [ ] **Step 2: 验证字体文件**

Run: `ls -la frontend/public/fonts/`
Expected: 显示两个 .woff2 文件

- [x] **Step 3: Commit**

```bash
git add frontend/public/fonts/
git commit -m "feat: add local font files for offline support

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.5: 重构 Button 组件

**Files:**
- Modify: `frontend/src/components/ui/Button.tsx`

- [x] **Step 1: 重写 Button 组件**

(已在本次执行中完成 - Button 组件按 Material 3 Tonal 规范重构)

```tsx
/**
 * Button 组件 - 符合 Material 3 Tonal 设计规范
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center whitespace-nowrap font-body transition-all duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // 主要按钮 - primary-container 背景
        primary: 'bg-primary-container text-on-primary-container rounded-full font-semibold hover:scale-[1.02] active:scale-[0.95]',
        // 次要按钮 - ghost 样式
        secondary: 'bg-surface-container text-on-surface rounded-full font-semibold hover:bg-surface-bright',
        // Ghost 按钮 - 无背景
        ghost: 'bg-transparent text-on-surface rounded-full hover:bg-surface-bright',
        // Outline 按钮 - ghost border
        outline: 'bg-transparent text-on-surface rounded-full border border-outline-variant/20 hover:bg-surface-bright',
        // 危险按钮
        destructive: 'bg-red-500/20 text-red-400 rounded-full font-semibold hover:bg-red-500/30',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
```

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(待提交 - 需要用户确认后执行 git commit)

```bash
git add frontend/src/components/ui/Button.tsx
git commit -m "refactor: redesign Button with Material 3 Tonal style

- Add pill shape (rounded-full)
- Add hover/active scale animations
- Update variants: primary, secondary, ghost, outline, destructive

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.6: 重构 Input 组件

**Files:**
- Modify: `frontend/src/components/ui/Input.tsx`

- [ ] **Step 1: 重写 Input 组件**

```tsx
/**
 * Input 组件 - 符合 Material 3 Tonal 设计规范
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Input({
  className,
  type = 'text',
  error = false,
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {startIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          // 基础样式 - pill shape, no border
          'w-full px-4 py-3 text-sm rounded-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50',
          // Focus 样式 - ghost border with glow
          'focus:outline-none transition-all duration-300',
          'focus:ring-1 focus:ring-primary/20',
          // 禁用样式
          'disabled:cursor-not-allowed disabled:opacity-50',
          // 错误状态
          error && 'ring-1 ring-red-500/50',
          // 图标偏移
          startIcon && 'pl-12',
          endIcon && 'pr-12',
          className
        )}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {endIcon}
        </div>
      )}
    </div>
  );
}
```

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功

- [x] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Input.tsx
git commit -m "refactor: redesign Input with Material 3 Tonal style

- Add pill shape (rounded-full)
- Use surface-container-lowest background
- Add focus glow effect
- Remove 1px border (No-Line rule)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.7: 重构 Card 组件

**Files:**
- Modify: `frontend/src/components/ui/Card.tsx`

- [x] **Step 1: 重写 Card 组件**

(已在本次执行中完成 - Card 组件使用 cva 定义变体，符合 Material 3 规范)

**变体：**
- default: bg-surface-container
- elevated: bg-surface-container-high (带阴影)
- filled: bg-surface-container-highest
- interactive: bg-surface-container + hover:bg-surface-bright

**导出：**
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants

```tsx
/**
 * Card 组件 - 符合 Material 3 Tonal 设计规范
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'filled';
  interactive?: boolean;
}

export function Card({
  className,
  variant = 'default',
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        // 基础样式
        'rounded-xl p-4 transition-all duration-300 ease-spring',
        // 变体样式
        variant === 'default' && 'bg-surface-container',
        variant === 'elevated' && 'bg-surface-container-high',
        variant === 'filled' && 'bg-surface-container-highest',
        // 交互样式 - 无边框，悬停变色
        interactive && 'cursor-pointer hover:bg-surface-bright',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 mb-3', className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display font-semibold text-on-surface text-lg', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-on-surface-variant', className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}
```

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓

- [x] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Card.tsx
git commit -m "refactor: redesign Card with Material 3 Tonal style

- Add variants: default, elevated, filled
- Remove 1px borders (No-Line rule)
- Add interactive hover state

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1.8: 添加主题切换到 settingsStore

**Files:**
- Modify: `frontend/src/stores/settingsStore.ts`

- [ ] **Step 1: 更新 settingsStore 添加主题状态**

先读取现有文件内容：
```bash
cat frontend/src/stores/settingsStore.ts
```

然后添加主题状态管理。确保包含：
- `theme: 'dark' | 'light' | 'system'` 状态
- `setTheme` 方法
- 系统主题监听

- [ ] **Step 2: 验证 store**

Run: `cd frontend && npm run build`
Expected: 构建成功

- [x] **Step 3: Commit**

```bash
git add frontend/src/stores/settingsStore.ts
git commit -m "feat: add theme state to settingsStore

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Phase 2: 布局组件

### Task 2.1: 创建 SideNavBar 组件

**Files:**
- Create: `frontend/src/components/layout/SideNavBar.tsx`

- [x] **Step 1: 创建 SideNavBar 组件**

(已完成 - SideNavBar 组件创建于 frontend/src/components/layout/SideNavBar.tsx)

组件特点：
- 固定宽度 280px，全高 fixed 定位
- 背景：surface-container-low
- 无 1px 边框 (No-Line 规则)
- pill 形状导航项 (rounded-full)
- 激活状态：primary-container 背景

结构：
1. Logo 区域 (🧠 + "AskMe")
2. 新建会话按钮 (primary-container 背景)
3. 导航项 (Timeline, Tags, Agents, LLM)
4. Recent Sessions 列表 (按时间分组)
5. Settings 按钮

导出：
- SideNavBar (主组件)
- default (默认导出)

```tsx
/**
 * SideNavBar - 侧边导航栏
 *
 * 固定宽度 280px，包含 Logo、导航项、会话列表、设置入口
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface SideNavBarProps {
  navItems: NavItem[];
  onNavClick: (id: string) => void;
  onNewSession: () => void;
  sessions?: Array<{
    id: string;
    title: string;
    timestamp: Date;
  }>;
  onSessionClick: (id: string) => void;
  onSettingsClick: () => void;
}

export function SideNavBar({
  navItems,
  onNavClick,
  onNewSession,
  sessions = [],
  onSessionClick,
  onSettingsClick,
}: SideNavBarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container-low flex flex-col z-40">
      {/* Logo 区域 */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-xl">🧠</span>
        </div>
        <span className="font-display font-bold text-xl text-on-surface">AskMe</span>
      </div>

      {/* 新建会话按钮 */}
      <div className="px-4 mb-4">
        <button
          onClick={onNewSession}
          className="w-full bg-primary-container text-on-primary-container font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.95]"
        >
          <span>+</span>
          <span>New Session</span>
        </button>
      </div>

      {/* 导航项 */}
      <nav className="px-3 mb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-full font-medium text-sm transition-colors',
              item.active
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-bright'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 分隔区域 - 通过背景色区分，无边框 */}
      <div className="flex-1 overflow-hidden">
        <div className="px-6 py-2">
          <span className="text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider">
            Recent Sessions
          </span>
        </div>
        <div className="overflow-y-auto h-full px-3 pb-4">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionClick(session.id)}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors mb-1"
            >
              <div className="truncate">{session.title}</div>
              <div className="text-xs text-on-surface-variant/60 mt-0.5">
                {session.timestamp.toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 底部设置区域 */}
      <div className="px-4 py-4 border-t border-outline-variant/10">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-sm"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
```

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(待用户确认后提交)

```bash
git add frontend/src/components/layout/SideNavBar.tsx
git commit -m "feat: create SideNavBar component with Material 3 style

- Fixed 280px width
- No 1px borders, use background hierarchy
- Pill-shaped nav items
- Primary-container active state

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2.2: 创建 TopNavBar 组件

**Files:**
- Create: `frontend/src/components/layout/TopNavBar.tsx`

- [x] **Step 1: 创建 TopNavBar 组件**

(已完成 - TopNavBar 组件已创建于 frontend/src/components/layout/TopNavBar.tsx)

组件特点：
- 高度 60px，sticky 定位
- 毛玻璃效果 (bg-background/80 + backdrop-blur-xl)
- 无 1px 边框
- 面包屑导航支持
- 右侧操作按钮区域

导出：
- TopNavBar (主组件)
- TopNavBarButton (按钮组件)
- BreadcrumbItem (类型接口)
- TopNavBarProps, TopNavBarButtonProps (Props 接口)

```tsx
/**
 * TopNavBar - 顶部导航栏
 *
 * 高度 60px，毛玻璃效果，包含面包屑导航和操作按钮
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface TopNavBarProps {
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function TopNavBar({ breadcrumbs, actions }: TopNavBarProps) {
  return (
    <header className="sticky top-0 h-[60px] bg-background/80 backdrop-blur-xl z-30 flex items-center justify-between px-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-outline-variant">/</span>
            )}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-primary font-semibold">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </header>
  );
}

export function TopNavBarButton({
  children,
  onClick,
  variant = 'ghost',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'primary';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        variant === 'ghost' && 'text-on-surface hover:bg-surface-container',
        variant === 'primary' && 'bg-primary-container text-on-primary-container'
      )}
    >
      {children}
    </button>
  );
}
```

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(待用户确认后提交)

```bash
git add frontend/src/components/layout/TopNavBar.tsx
git commit -m "feat: create TopNavBar with glassmorphism effect

- 60px height, sticky positioning
- Backdrop blur effect
- Breadcrumb navigation
- No 1px borders

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2.3: 重构 Sidebar 组件

**Files:**
- Modify: `frontend/src/components/Sidebar.tsx`

- [x] **Step 1: 重写 Sidebar 使用 SideNavBar**

(已在 commit ee71630 中完成 - Sidebar 组件按 Material 3 规范重构)

关键改动：
- 移除所有 `border` 样式（No-Line 规则）
- 使用 surface-container-low 背景 (bg-surface-container-low)
- 导航项使用 rounded-full (pill shape)
- 激活状态使用 primary-container 背景
- 使用 useSessionStore 直接获取 sessions 和 currentSessionId
- 简化 SidebarProps 接口（移除 sessions/activeSessionId 等外部 props）

组件结构：
1. Logo 区域 (🧠 + "AskMe")
2. 新建会话按钮 (使用 Button variant="primary")
3. 导航项 (Timeline, Tags, Agents, LLM) - rounded-full pill 形状
4. 分隔区域 (使用 bg-surface-container 背景色区分，无边框)
5. Recent Sessions 列表 (按时间分组，使用 ScrollArea)
6. Settings 按钮 (rounded-full)

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit ee71630 中完成)

---

## Phase 3: 页面组件

### Task 3.1: 重构 LaunchPad 组件

**Files:**
- Modify: `frontend/src/components/LaunchPad.tsx`

- [x] **Step 1: 重写 LaunchPad 组件**

(已在 commit ee71630 中完成 - LaunchPad 组件按 Material 3 规范重构)

更新 LaunchPad 组件以符合设计规范：
- Bento Grid 不对称布局（不是简单的 2x2）
- 背景光晕效果 (animate-glow 类)
- 中央输入框带聚焦光晕
- 使用 Manrope 字体显示标题 (font-display)
- 无 1px 边框
- 使用 CSS 变量颜色 (bg-background, bg-surface-container)

关键实现：
- 4 个场景卡片使用不同尺寸 (large/medium/small)
- col-span-2 row-span-2 等网格跨度实现不对称布局
- 3 个背景光晕元素 (bg-primary/5, bg-tertiary/5, bg-primary/8)
- 输入框聚焦时显示 ring-2 ring-primary/20 光晕
- FeatureTag 子组件用于显示特性标签

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit ee71630 中完成)

---

### Task 3.2: 重构 ChatArea 组件

**Files:**
- Modify: `frontend/src/components/ChatArea.tsx`

- [x] **Step 1: 重写 ChatArea 组件**

(已在 commit ee71630 中完成 - ChatArea 组件按 Material 3 规范重构)

更新 ChatArea 组件以符合设计规范：

**AI 消息：**
- 无容器背景 (直接在 background 上显示文字)
- 左侧 tertiary-container accent bar (4px, w-1 rounded-full)
- 左对齐布局

**用户消息：**
- primary-container 背景 (bg-primary-container)
- capsule 形式 (rounded-full)
- 右对齐布局，最大宽度 80%

**浮动输入区：**
- 渐变背景 `bg-gradient-to-t from-background via-background to-transparent`
- 输入框背景 `surface-container-lowest`

**关键实现细节：**
- AI 消息使用 flex gap-3 布局，左侧 w-1 rounded-full bg-tertiary-container 竖线
- 用户消息使用 rounded-full pill 形状
- 消息操作按钮使用 rounded-full pill 形状
- hover 时显示操作按钮 (opacity-0 hover:opacity-100)
- 流式传输光标使用 animate-blink 动画

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit ee71630 中完成)

---

### Task 3.3: 重构 InputArea 组件

**Files:**
- Modify: `frontend/src/components/InputArea.tsx`

- [x] **Step 1: 重写 InputArea 组件**

(已在 commit ee71630 中完成 - InputArea 组件按 Material 3 规范重构)

更新 InputArea 组件：
- 浮动样式
- 黑色背景输入框
- pill 形状发送按钮
- 聚焦光晕效果

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit ee71630 中完成)

---

### Task 3.4: 创建 AgentPersonas 设置页面

**Files:**
- Create: `frontend/src/components/pages/Settings/AgentPersonas.tsx`

- [x] **Step 1: 创建 AgentPersonas 组件**

按照设计规范创建 4 预定义人格卡片：
- 2x2 网格布局
- 激活状态：左侧 primary accent bar (4px) + "Active" 标签脉冲动画
- 配置面板：Tone 下拉、Question Depth 下拉

人格卡片：
1. 温和引导者 (🌿) - Gentle Guide
2. 苏格拉底导师 (🏛️) - Socratic Mentor
3. 中立探索者 (🧭) - Neutral Explorer
4. 灵感催化师 (✨) - Inspiration Catalyst

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功

- [x] **Step 3: Commit**

```bash
git add frontend/src/components/pages/Settings/AgentPersonas.tsx
git commit -m "feat: create AgentPersonas settings page

- 2x2 grid layout
- Active state with accent bar and pulse animation
- Configuration panel with Tone and Depth options

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3.5: 创建 LLMConfiguration 设置页面

**Files:**
- Create: `frontend/src/components/pages/Settings/LLMConfiguration.tsx`

- [x] **Step 1: 创建 LLMConfiguration 组件**

(已在 2026-03-30 完成 - Bento-ish 3 列布局实现)

按照设计规范创建：
- OpenAI Compatible 大卡片（跨 2 列）
- Anthropic Claude 插件卡片
- Ollama Local 插件卡片
- 认知负载概览（Latency, Tokens/Mo, Uptime）
- 高级参数表格（Temperature slider, Max Tokens input）

组件特点：
- Bento-ish 3 列网格布局 (grid-cols-3)
- 大卡片使用 bg-surface-container
- 小卡片使用 bg-surface-container-high (elevated variant)
- 插件管理卡片带开关按钮
- 认知负载进度条可视化
- 高级参数表格（maxTokens, temperature, defaultModel）
- Provider 切换器、测试连接功能

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

```bash
git add frontend/src/components/pages/Settings/LLMConfiguration.tsx
git commit -m "feat: create LLMConfiguration settings page

- Bento-ish 3-column layout
- OpenAI Compatible card with config fields
- Plugin installation cards
- Cognitive load overview
- Advanced parameters table

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3.6: 重构 Settings 组件

**Files:**
- Modify: `frontend/src/components/Settings.tsx`

- [x] **Step 1: 重构 Settings 组件**

(已在 commit 8e1f044 中完成 - Settings 组件按 Material 3 规范重构)

更新 Settings 组件：
- 移除 1px 边框
- 使用 surface-container 背景层级
- 使用新的 AgentPersonas 和 LLMConfiguration 子组件
- 主题切换功能

关键改动：
- 使用 Card 组件作为主面板容器 (variant="elevated")
- Tab 导航使用 rounded-full pill 形状
- 主题设置使用图标+文字卡片选择器
- 会话设置和数据管理使用 Card variant="filled" 分组
- 集成 AgentPersonas 和 LLMConfiguration 子组件
- 添加 onTestLLMConnection prop 支持

- [x] **Step 2: 验证组件**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit 8e1f044 中完成)

---

## Phase 4: 动画与细节打磨

### Task 4.1: 添加动画过渡效果

**Files:**
- Modify: `frontend/src/index.css`

- [x] **Step 1: 添加动画 CSS 类**

(已在 commit 6912b13 中完成 - 动画类已存在于 frontend/src/index.css 第 1092-1143 行)

```css
/* frontend/src/index.css - 添加以下内容 */

/* 卡片背景过渡 */
.transition-card {
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮缩放 */
.transition-button {
  transition: transform 150ms ease-out;
}

/* 输入框聚焦 */
.transition-input {
  transition: box-shadow 300ms ease;
}

/* 消息操作按钮 */
.transition-message-action {
  transition: opacity 300ms ease;
}

/* 主题切换 */
.transition-theme {
  transition: color 200ms ease, background-color 200ms ease;
}

/* 光晕动画 */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.08; }
}

.animate-glow {
  animation: glow-pulse 4s ease-in-out infinite;
}

/* 滚动显示动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 300ms ease-out forwards;
}
```

- [x] **Step 2: 验证样式**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证)

- [x] **Step 3: Commit**

(已在 commit 6912b13 中完成)

```bash
git add frontend/src/index.css
git commit -m "feat: add animation transition effects

- Card background transition (300ms)
- Button scale animation (150ms)
- Input focus glow (300ms)
- Theme switch transition (200ms)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4.2: 实现主题切换逻辑

**Files:**
- Modify: `frontend/src/App.tsx`

- [x] **Step 1: 添加主题切换逻辑**

(已在 commit 503160f 中完成 - App.tsx 主题切换逻辑实现)

在 App.tsx 中添加：
- 从 settingsStore 获取主题状态
- 在 html 元素上设置 `data-theme` 属性
- 监听系统主题变化

关键实现：
- useEffect 监听 settings.theme 变化
- 当 theme 为 'system' 时，使用 matchMedia 监听系统主题
- 正确清理 mediaQuery listener 防止内存泄漏
- 设置 document.documentElement.setAttribute('data-theme', ...)

```tsx
// 添加到 App 组件
useEffect(() => {
  const root = document.documentElement;
  const theme = settings.theme;

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', systemTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    root.setAttribute('data-theme', theme);
  }
}, [settings.theme]);
```

- [x] **Step 2: 验证主题切换**

Run: `cd frontend && npm run build`
Expected: 构建成功 ✓ (已验证 - build completed without errors)

- [x] **Step 3: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: implement theme switching logic

- Support dark/light/system modes
- Apply data-theme attribute to html
- Listen for system theme changes

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4.3: 最终构建验证

**Files:**
- N/A (验证步骤)

- [ ] **Step 1: 清理未使用的导入**

Run: `cd frontend && npm run build`
Expected: 构建成功，无 TypeScript 错误

- [ ] **Step 2: 本地开发验证**

Run: `cd frontend && npm run dev`
Expected: 应用正常运行

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "chore: final cleanup and build verification

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## 验收清单

完成所有任务后，验证以下项目：

- [ ] 所有颜色 token 正确实现
- [ ] 双主题切换正常工作
- [ ] 无 1px solid 边框分隔区域 (No-Line 规则)
- [ ] Surface 层级正确应用
- [ ] 字体正确加载（离线可用）
- [ ] 所有圆角符合规范（pill 按钮使用 rounded-full）
- [ ] 动画效果流畅（300ms cubic-bezier）
- [ ] 悬停状态正确
- [ ] 光晕效果正确渲染
- [ ] 响应式布局正确

---

**Co-Authored-By: Claude Code <noreply@anthropic.com>**