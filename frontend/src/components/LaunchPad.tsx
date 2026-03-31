/**
 * 启动界面 - 用户打开应用后看到的第一个界面
 * 采用 Bento Grid 不对称布局，Material Design 3 主题系统
 * 手机版优化设计
 */

import { ScenarioType } from '../types';
import { Card } from './ui/Card';
import { BottomNav } from './BottomNav';

// 场景按钮配置
const SCENARIOS: Array<{
  type: ScenarioType;
  emoji: string;
  title: string;
  description: string;
  prompt: string;
}> = [
  {
    type: 'problem_solving',
    emoji: '🎯',
    title: 'Problem Solving',
    description: '理清思路找答案',
    prompt: '我有事情需要咨询，请通过提问帮助我理清思路、找到答案',
  },
  {
    type: 'learning',
    emoji: '📚',
    title: 'Learning & Exploration',
    description: '深入学习建立理解',
    prompt: '我想进行学习，请通过提问帮助我深入理解一个主题',
  },
  {
    type: 'deep_chat',
    emoji: '💭',
    title: 'Deep Dialogue',
    description: '反思自我发现洞察',
    prompt: '我想来一场深度对话，请通过提问引导我反思和发现洞察',
  },
  {
    type: 'inspiration',
    emoji: '✨',
    title: 'Seek Inspiration',
    description: '打破常规获得灵感',
    prompt: '我需要一些启发，请通过提问帮助我打破常规思维',
  },
];

interface LaunchPadProps {
  onStartSession: (scenarioType: ScenarioType | null, initialContent?: string) => void;
}

export function LaunchPad({ onStartSession }: LaunchPadProps) {
  // 处理场景按钮点击
  const handleScenarioClick = (scenario: typeof SCENARIOS[0]) => {
    onStartSession(scenario.type, scenario.prompt);
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤔</span>
            <div>
              <h1 className="font-display text-lg font-semibold text-on-surface">AskMe</h1>
              <p className="text-xs text-on-surface-variant">让 AI 向你提问</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant">
              🔍
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24">
        {/* 欢迎语 */}
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-on-surface mb-2">
            Hello, what would you like to explore today?
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Choose a focused path below to begin your curated inquiry session. AskMe will probe your thoughts to uncover deeper clarity.
          </p>
        </div>

        {/* 场景卡片列表 */}
        <div className="space-y-3">
          {SCENARIOS.map((scenario) => (
            <Card
              key={scenario.type}
              variant="interactive"
              className="w-full p-5 flex items-start gap-4 hover:shadow-md transition-all duration-200 group cursor-pointer bg-surface-container-lowest"
              onClick={() => handleScenarioClick(scenario)}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {scenario.emoji}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-on-surface mb-1">
                  {scenario.title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-1">
                  {scenario.description}
                </p>
                <p className="text-xs text-on-surface-variant/70 line-clamp-2">
                  {scenario.type === 'problem_solving' && 'Clear your mind and find structured answers to complex challenges.'}
                  {scenario.type === 'learning' && 'Deeply learn new concepts and build a resilient mental framework.'}
                  {scenario.type === 'deep_chat' && 'Reflect on self and find insights through philosophical questioning.'}
                  {scenario.type === 'inspiration' && 'Break conventional thinking and get sparks of creative inspiration.'}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* 特性提示 */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span>🔮</span>
            <span>Adaptive Persona</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>Session Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <span>Custom Settings</span>
          </div>
        </div>
      </main>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          className="w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-200"
          onClick={() => onStartSession(null, '')}
          aria-label="新建会话"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      {/* 底部导航栏 */}
      <BottomNav activeItem="explore" onNavigate={() => {}} />
    </div>
  );
}

export default LaunchPad;