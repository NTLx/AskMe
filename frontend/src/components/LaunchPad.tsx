/**
 * LaunchPad 启动台页面
 * 像素级对齐 UI Reference: stitch_askme_web-dark/3
 *
 * 设计规范:
 * - 居中 Hero Section: gradient text 标题
 * - Bento Grid 场景卡片: 4 列 (1:2:1 比例)
 * - 底部 Pill 形输入框 + Agent/Memory 图标
 * - 背景装饰: 大型模糊渐变圆球
 */

import { useState } from 'react';
import { ScenarioType } from '../types';
import { cn } from '../utils/cn';

// 场景卡片配置
const SCENARIOS: Array<{
  type: ScenarioType;
  icon: string;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  colSpan: string;
  isPopular?: boolean;
  isFullWidth?: boolean;
}> = [
  {
    type: 'problem_solving',
    icon: 'ads_click',
    title: '理清思路',
    subtitle: '🎯 Problem Solving',
    iconBg: 'bg-primary-container/10',
    iconColor: 'text-primary',
    colSpan: 'col-span-1',
  },
  {
    type: 'learning',
    icon: 'menu_book',
    title: '深入学习',
    subtitle: '📚 Learning Exploration',
    iconBg: 'bg-tertiary-container/10',
    iconColor: 'text-tertiary',
    colSpan: 'md:col-span-2',
    isPopular: true,
  },
  {
    type: 'deep_chat',
    icon: 'forum',
    title: '深度对话',
    subtitle: '💭 Deep Chat',
    iconBg: 'bg-secondary-container/30',
    iconColor: 'text-secondary',
    colSpan: 'col-span-1',
  },
  {
    type: 'inspiration',
    icon: 'lightbulb',
    title: '寻求启发',
    subtitle: '✨ Inspiration Catalyst: Generate unexpected connections and creative sparks.',
    iconBg: '',
    iconColor: '',
    colSpan: 'md:col-span-4',
    isFullWidth: true,
  },
];

interface LaunchPadProps {
  onStartSession: (scenarioType: ScenarioType | null, initialContent?: string) => void;
}

export function LaunchPad({ onStartSession }: LaunchPadProps) {
  const [inputValue, setInputValue] = useState('');

  const handleScenarioClick = (scenario: typeof SCENARIOS[0]) => {
    const prompts: Record<ScenarioType, string> = {
      problem_solving: '我有事情需要咨询，请通过提问帮助我理清思路、找到答案',
      learning: '我想进行学习，请通过提问帮助我深入理解一个主题',
      deep_chat: '我想来一场深度对话，请通过提问引导我反思和发现洞察',
      inspiration: '我需要一些启发，请通过提问帮助我打破常规思维',
    };
    onStartSession(scenario.type, prompts[scenario.type]);
  };

  const handleSendInput = () => {
    if (inputValue.trim()) {
      onStartSession(null, inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendInput();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -z-10 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full px-12 pb-24">
        {/* Hero Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold font-display mb-4 bg-gradient-to-b from-on-surface to-on-surface-variant bg-clip-text text-transparent tracking-tight">
            智识的起点
          </h2>
          <p className="text-lg text-on-surface-variant font-body max-w-xl mx-auto">
            探索、构建与进化。我是您的智识策展人，准备好开始一次深度的逆向对话了吗？
          </p>
        </div>

        {/* Bento Grid Scenario Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-12">
          {SCENARIOS.map((scenario) => {
            // 全宽卡片 (Inspiration)
            if (scenario.isFullWidth) {
              return (
                <button
                  key={scenario.type}
                  className={cn(
                    'col-span-1 md:col-span-4',
                    'group relative overflow-hidden',
                    'bg-surface-container rounded-xl p-5',
                    'text-left transition-all duration-300',
                    'hover:bg-surface-bright',
                    'border border-transparent hover:border-primary/20',
                    'flex items-center gap-6'
                  )}
                  onClick={() => handleScenarioClick(scenario)}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-on-primary group-hover:rotate-12 transition-transform">
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {scenario.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-on-surface font-bold text-lg">{scenario.title}</h3>
                    <p className="text-on-surface-variant text-sm">{scenario.subtitle}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors pr-4">
                    keyboard_command_key
                  </span>
                </button>
              );
            }

            // Most Popular 宽卡片 (Learning)
            if (scenario.isPopular) {
              return (
                <button
                  key={scenario.type}
                  className={cn(
                    'col-span-1', scenario.colSpan,
                    'group relative overflow-hidden',
                    'bg-surface-container rounded-xl p-6',
                    'text-left transition-all duration-300',
                    'hover:bg-surface-bright',
                    'border border-transparent hover:border-primary/20',
                    'flex flex-col justify-between'
                  )}
                  onClick={() => handleScenarioClick(scenario)}
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      scenario.iconBg, scenario.iconColor,
                      'group-hover:scale-110 transition-transform'
                    )}>
                      <span className="material-symbols-outlined text-2xl">{scenario.icon}</span>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-surface-container-highest text-[10px] text-tertiary border border-tertiary/20">
                      MOST POPULAR
                    </span>
                  </div>
                  <div>
                    <h3 className="text-on-surface font-bold text-xl mb-1">{scenario.title}</h3>
                    <p className="text-on-surface-variant text-sm">{scenario.subtitle}</p>
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    <span className="material-symbols-outlined text-tertiary text-2xl">trending_flat</span>
                  </div>
                </button>
              );
            }

            // 标准卡片
            return (
              <button
                key={scenario.type}
                className={cn(
                  'col-span-1', scenario.colSpan,
                  'group relative overflow-hidden',
                  'bg-surface-container rounded-xl p-6',
                  'text-left transition-all duration-300',
                  'hover:bg-surface-bright',
                  'border border-transparent hover:border-primary/20'
                )}
                onClick={() => handleScenarioClick(scenario)}
              >
                <div className={cn(
                  'mb-8 w-12 h-12 rounded-lg flex items-center justify-center',
                  scenario.iconBg, scenario.iconColor,
                  'group-hover:scale-110 transition-transform'
                )}>
                  <span className="material-symbols-outlined text-2xl">{scenario.icon}</span>
                </div>
                <h3 className="text-on-surface font-bold text-lg mb-1">{scenario.title}</h3>
                <p className="text-on-surface-variant text-sm">{scenario.subtitle}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={cn('material-symbols-outlined text-sm', scenario.iconColor)}>
                    arrow_forward
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Input Area */}
        <div className="w-full max-w-3xl mx-auto relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

          <div className="relative bg-surface-container-lowest border border-outline-variant/10 rounded-full flex items-center p-2 focus-within:border-primary/30 transition-all shadow-2xl">
            {/* 左侧图标按钮 */}
            <div className="pl-6 flex gap-3 text-on-surface-variant">
              <button className="hover:text-primary transition-colors" title="Adaptive Persona">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </button>
              <button className="hover:text-primary transition-colors" title="Session Memory">
                <span className="material-symbols-outlined text-[20px]">memory</span>
              </button>
            </div>

            {/* 输入框 */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface px-4 py-3 placeholder:text-on-surface-variant/50 font-body"
              placeholder="直接输入你想探讨的问题或想法..."
            />

            {/* 发送按钮 */}
            <button
              onClick={handleSendInput}
              className={cn(
                'mr-1 w-12 h-12 rounded-full flex items-center justify-center',
                'transition-all shadow-lg',
                'hover:scale-105 active:scale-95',
                inputValue.trim()
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant/50'
              )}
            >
              <span className="material-symbols-outlined font-bold">arrow_upward</span>
            </button>
          </div>

          {/* Input Context Bar */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-[11px] text-on-surface-variant hover:text-on-surface cursor-pointer border border-transparent hover:border-outline-variant transition-all">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              Custom Settings
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-[11px] text-on-surface-variant hover:text-on-surface cursor-pointer border border-transparent hover:border-outline-variant transition-all">
              <span className="material-symbols-outlined text-[14px]">history_edu</span>
              Recent Drafts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchPad;