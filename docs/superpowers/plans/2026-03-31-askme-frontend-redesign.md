# AskMe Frontend UI 像素级重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全面审查并纠正 `LaunchPad`, `Settings/AgentPersonas`, `Settings/LLMConfiguration` 三个核心组件的 UI 退化问题，将其 100% 像素级对齐至 `UI_Reference` 提供的原型代码。同时确保适配 Web/Phone 和 Light/Dark 四套主题系统。

**Architecture:** 直接提取 `UI_Reference/**/*.html` 的类名（尤其是涉及 `bg-surface-container-*`, `ring-*`, `shadow-*`, 间距, flex/grid 结构 等 Tailwind 类），替换现有 React 组件中为了逻辑拼接而导致的松散且廉价的布局代码。

**Tech Stack:** React, Tailwind CSS

---

### Task 1: 像素级重构 LaunchPad (场景启动台)

**Files:**
- Read: `UI_Reference/stitch_askme_web-dark/3/code.html` (Reference)
- Modify: `frontend/src/components/LaunchPad.tsx`

- [ ] **Step 1: 重新审查参考结构与边距**
仔细阅读 `UI_Reference/stitch_askme_web-dark/3/code.html` 和 `UI_Reference/stitch_askme_phone-dark/3/code.html`，提取出精确的 CSS 雷达。特别是：
- "智识的起点" 文字的 `bg-gradient-to-*`。
- Bento Grid（宫格卡片）的高宽比（Aspect ratio）、内边距（padding）、悬停动画（hover scale/translate）和原生的 SVG / Material Icons 的粗细设定。
- "MOST POPULAR" 标签的边框、字距（tracking-widest）。
- 底部胶囊搜索框（Pill input）的 `shadow-2xl`，输入框侧边圆角和对齐，底边的快捷键小红点（或者细线/图标）布局。

- [ ] **Step 2: 重构 LaunchPad 组件**
用参考 HTML 的结构完全替换 `frontend/src/components/LaunchPad.tsx` 中 `SCENARIOS.map` 循环渲染的 DOM 结构，还原纯正的视觉层次。

- [ ] **Step 3: 测试并验证**
Run: `cd frontend && npm run build`
Expected: 编译无错误。

- [ ] **Step 4: Commit**
```bash
git add frontend/src/components/LaunchPad.tsx
git commit -m "style: pixel-perfect redesign of LaunchPad to match UI_Reference"
```

### Task 2: 像素级重构 AgentPersonas (配置人格页面)

**Files:**
- Read: `UI_Reference/stitch_askme_web-dark/1/code.html` (Reference)
- Modify: `frontend/src/components/pages/Settings/AgentPersonas.tsx`

- [ ] **Step 1: 提取正确的 CSS 属性与布局网格**
仔细比对截图 2 中发生的崩坏：那可怕的虚线边框、拉成纵向长条被压缩的容器黑影。读取 `code.html`。
目标特征提取：
- "Curate your intellectual companions" 和 "CONFIGURATION" 的版面对齐位置。
- Agent 卡片的正常宽度/高度比例。
- "Create New Persona" 正确的加号图标大小、虚线颜色及 hover 交互。
- "Need a specialist?" 底部横幅的底色与圆角。

- [ ] **Step 2: 应用到 React 组件**
覆盖 `frontend/src/components/pages/Settings/AgentPersonas.tsx` 中不和谐的 Grid 和卡片定义。修复 `AgentCard` 组件里面的行距和 Tags (`bg-primary-container/20` 等透明色阶) 外观。

- [ ] **Step 3: 测试并验证**
Run: `npm run build`

- [ ] **Step 4: Commit**
```bash
git add frontend/src/components/pages/Settings/AgentPersonas.tsx
git commit -m "style: accurately restore Agent Personas grid layout and typography"
```

### Task 3: 像素级重构 LLMConfiguration (模型设置页面)

**Files:**
- Read: `UI_Reference/stitch_askme_web-dark/2/code.html` (Reference)
- Modify: `frontend/src/components/pages/Settings/LLMConfiguration.tsx`

- [ ] **Step 1: 处理输入框拥挤与白底失效问题**
参考截图 3 中的惨状，读取 `UI_Reference/.../2/code.html` 查找原始设计师是怎么做表单的。
找出：
- "Base URL" / "API KEY" 等标签使用的颜色和粗细。
- `input` 和 `select` 元素的背景颜色（必须是 `bg-surface-container-***`，而不能是默认的白色或者低对比度灰色）。
- "Cognitive Load Overview" 等数据展示卡片的三列排版（2.4ms / 142k / 99.9%）的大字号 `text-3xl` 和 `tracking` 取值。

- [ ] **Step 2: 重构界面代码**
修改 `LLMConfiguration.tsx`。替换掉原来为了把逻辑写通而丢弃样式的结构，应用提取出来的精致的 Tailwind utility array。

- [ ] **Step 3: 测试并验证**
Run: `npm run build`

- [ ] **Step 4: Commit**
```bash
git add frontend/src/components/pages/Settings/LLMConfiguration.tsx
git commit -m "style: fix form inputs and typography on LLMConfiguration to match reference"
```

### Task 4: 兜底暗色/浅色/响应式规范支持

**Files:**
- Modify: `frontend/src/styles/themes/*.css` / `frontend/tailwind.config.js` (如果有遗漏的主题变量)

- [ ] **Step 1: 后置审计**
确认以上修改的 DOM 类在四个 CSS 主题变量文件（`phone-dark`, `phone-light`, `web-dark`, `web-light`）中没有引起未知崩溃。检查移动端排版的 `md:` 前缀是否正确添加，从而不至于在手机上看到错位的左右两列。

- [ ] **Step 2: 提交审查**
Run: `npm run build`

- [ ] **Step 3: Commit**
```bash
git commit --allow-empty -m "chore: responsive theme check completed"
```
