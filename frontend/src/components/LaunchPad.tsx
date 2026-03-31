/**
 * LaunchPad 启动台页面
 * Material Design 3 + Bento Grid 布局
 * Hero Section + Scenario Cards + Annotation Contextual
 */

import { ScenarioType } from '../types';
import { BottomNav } from './BottomNav';

// 场景卡片配置
const SCENARIOS: Array<{
  type: ScenarioType;
  emoji: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  prompt: string;
  isPopular?: boolean;
  isFullWidth?: boolean;
}> = [
  {
    type: 'problem_solving',
    emoji: '🎯',
    title: '解决问题',
    titleEn: 'Problem Solving',
    description: '理清思路找答案',
    descriptionEn: 'Clear your mind and find structured answers to complex challenges.',
    prompt: '我有事情需要咨询，请通过提问帮助我理清思路、找到答案',
  },
  {
    type: 'learning',
    emoji: '📚',
    title: '学习探索',
    titleEn: 'Learning & Exploration',
    description: '深入学习建立理解',
    descriptionEn: 'Deeply learn new concepts and build a resilient mental framework.',
    prompt: '我想进行学习，请通过提问帮助我深入理解一个主题',
  },
  {
    type: 'deep_chat',
    emoji: '💭',
    title: '深度对话',
    titleEn: 'Deep Dialogue',
    description: '反思自我发现洞察',
    descriptionEn: 'Reflect on self and find insights through philosophical questioning.',
    prompt: '我想来一场深度对话，请通过提问引导我反思和发现洞察',
    isPopular: true,
  },
  {
    type: 'inspiration',
    emoji: '✨',
    title: '灵感催化',
    titleEn: 'Inspiration Catalyst',
    description: '打破常规获得灵感',
    descriptionEn: 'Break conventional thinking and get sparks of creative inspiration.',
    prompt: '我需要一些启发，请通过提问帮助我打破常规思维',
    isFullWidth: true,
  },
];

interface LaunchPadProps {
  onStartSession: (scenarioType: ScenarioType | null, initialContent?: string) => void;
}

export function LaunchPad({ onStartSession }: LaunchPadProps) {
  // 处理场景卡片点击
  const handleScenarioClick = (scenario: typeof SCENARIOS[0]) => {
    onStartSession(scenario.type, scenario.prompt);
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤔</span>
            <div>
              <h1 className="font-display text-lg font-bold text-on-surface">AskMe</h1>
              <p className="text-xs text-on-surface-variant">让 AI 向你提问</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors duration-200"
              aria-label="搜索"
            >
              🔍
            </button>
            <button
              className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors duration-200"
              aria-label="设置"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <section className="mb-16">
          <h2 className="font-display text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
            智识的起点
            <br />
            <span className="text-primary-dim opacity-90">The Starting Point of Knowledge.</span>
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Explore, construct, and evolve. I am your intellectual companion, ready for a deep inquiry?
          </p>
        </section>

        {/* Scenario Cards - Bento Grid */}
        <section className="grid grid-cols-12 gap-6">
          {SCENARIOS.map((scenario) => {
            // 全宽卡片样式
            if (scenario.isFullWidth) {
              return (
                <div
                  key={scenario.type}
                  className="col-span-12 group cursor-pointer bg-surface-container-high hover:bg-surface-container-lowest p-10 rounded-xl transition-all duration-300 flex items-center gap-8 min-h-[160px]"
                  onClick={() => handleScenarioClick(scenario)}
                >
                  <div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {scenario.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                      {scenario.title}
                      <span className="text-on-surface-variant font-normal ml-2">
                        {scenario.titleEn}
                      </span>
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-snug">
                      {scenario.descriptionEn}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-muted">
                    <span>💡</span>
                    <span>Explore the unknown</span>
                  </div>
                </div>
              );
            }

            // Most Popular 卡片样式
            if (scenario.isPopular) {
              return (
                <div
                  key={scenario.type}
                  className="col-span-12 md:col-span-4 group cursor-pointer bg-primary-container/10 hover:bg-primary-container/20 p-8 rounded-xl transition-all duration-300 relative overflow-hidden"
                  onClick={() => handleScenarioClick(scenario)}
                >
                  {/* Most Popular 标签 */}
                  <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                  {/* 图标 */}
                  <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {scenario.emoji}
                  </div>
                  {/* 标题 */}
                  <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                    {scenario.title}
                  </h3>
                  {/* 英文副标题 */}
                  <p className="text-sm text-primary-dim font-medium mb-2">{scenario.titleEn}</p>
                  {/* 描述 */}
                  <p className="text-sm text-on-surface-variant leading-snug">
                    {scenario.descriptionEn}
                  </p>
                </div>
              );
            }

            // 标准卡片样式
            return (
              <div
                key={scenario.type}
                className="col-span-12 md:col-span-4 group cursor-pointer bg-surface-container-low hover:bg-surface-container-lowest p-8 rounded-xl transition-all duration-300"
                onClick={() => handleScenarioClick(scenario)}
              >
                {/* 图标 */}
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                  {scenario.emoji}
                </div>
                {/* 标题 */}
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                  {scenario.title}
                </h3>
                {/* 英文副标题 */}
                <p className="text-sm text-on-surface-variant font-medium mb-2">
                  {scenario.titleEn}
                </p>
                {/* 描述 */}
                <p className="text-sm text-on-surface-variant leading-snug">
                  {scenario.descriptionEn}
                </p>
              </div>
            );
          })}
        </section>

        {/* Annotation Contextual */}
        <div className="mt-8 italic text-tertiary text-sm max-w-lg opacity-80">
          "Knowledge is not just data; it's the structured understanding we build through inquiry."
          <span className="ml-2 not-italic font-medium">— The Curator</span>
        </div>
      </main>

      {/* 底部悬浮新建按钮 */}
      <div className="fixed bottom-20 right-4 z-40 md:bottom-8">
        <button
          className="w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => onStartSession(null, '')}
          aria-label="新建会话"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      </div>

      {/* 手机底部导航栏 */}
      <BottomNav activeItem="timeline" onNavigate={() => {}} />
    </div>
  );
}

export default LaunchPad;