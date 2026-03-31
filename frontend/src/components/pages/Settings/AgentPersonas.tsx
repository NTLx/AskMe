/**
 * Agent 人格设置页面 - Material Design 3 设计规范
 * - 页面内边距：24px (mobile) / 48px (desktop)
 * - Agent 卡片：rounded-[2rem] (32px)
 * - 激活卡片：border + ring-2 ring-primary
 * - 响应式：2 列网格 → 单列
 */

import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/Button';
import { BottomNav } from '../../BottomNav';
import { BUILTIN_AGENTS, BuiltinAgentDefinition } from '../../../agent/builtins';
import type { AgentProfile } from '../../../types';

/**
 * AgentPersonas 组件 Props
 */
interface AgentPersonasProps {
  /** 当前激活的 Agent ID */
  activeAgentId?: string;
  /** 切换激活 Agent 的回调 */
  onActivateAgent?: (agentId: string) => void;
  /** 编辑 Agent 的回调 */
  onEditAgent?: (agent: AgentProfile) => void;
  /** 复制 Agent 的回调 */
  onCopyAgent?: (agent: AgentProfile) => void;
  /** 删除 Agent 的回调 */
  onDeleteAgent?: (agentId: string) => void;
  /** 创建新 Agent 的回调 */
  onCreateAgent?: () => void;
}

/**
 * AgentPersonas 主组件
 */
export function AgentPersonas({
  activeAgentId,
  onActivateAgent,
  onEditAgent: _onEditAgent,
  onCopyAgent,
  onDeleteAgent: _onDeleteAgent,
  onCreateAgent,
}: AgentPersonasProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleToggleExpand = (agentId: string) => {
    setExpandedCardId(expandedCardId === agentId ? null : agentId);
  };

  const handleActivate = (agentId: string) => {
    onActivateAgent?.(agentId);
  };

  const handleCopy = (agent: BuiltinAgentDefinition) => {
    if (onCopyAgent) {
      const now = Date.now();
      onCopyAgent({
        ...agent,
        id: `${agent.id}_copy_${now}`,
        name: `${agent.name} (副本)`,
        isBuiltin: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
          {/* System Preferences 标签 */}
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-xs uppercase tracking-widest">System Preferences</span>
          </div>

          {/* 页面标题 */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface">
            Agent Personas
            <span className="text-on-surface-variant/40 font-normal ml-2">人格</span>
          </h3>

          {/* 描述 */}
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed mt-3">
            Define how your AI assistant interacts, thinks, and responds. Choose from curated intellectual profiles or create your own custom expert.
          </p>
        </div>
      </header>

      {/* Agent Grid */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {BUILTIN_AGENTS.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isActive={activeAgentId === agent.id}
              isExpanded={expandedCardId === agent.id}
              onToggleExpand={() => handleToggleExpand(agent.id)}
              onActivate={() => handleActivate(agent.id)}
              onCopy={() => handleCopy(agent)}
            />
          ))}

          {/* Add New Persona Card */}
          {onCreateAgent && (
            <button
              onClick={onCreateAgent}
              className="group p-8 rounded-[2rem] border-2 border-dashed border-outline-variant bg-transparent
                hover:border-primary hover:bg-primary-container/5 transition-all duration-300
                flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px]"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary text-primary
                flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl">add</span>
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-2">Create New Persona</h4>
              <p className="text-on-surface-variant text-sm max-w-[240px]">
                Supports file upload (SOUL.md, IDENTITY.md) or manual configuration
              </p>
            </button>
          )}
        </div>

        {/* Persona Logic Section */}
        <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-outline-variant/10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* 左侧说明 */}
            <div className="md:w-1/3">
              <h5 className="font-bold text-lg text-primary mb-2">Persona Logic</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Our personas are powered by a custom cognitive architecture that adjusts temperature and system prompts dynamically based on your chosen intellectual profile.
              </p>
            </div>

            {/* 右侧参数展示 */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-container-lowest rounded-2xl">
                <span className="block text-xs uppercase tracking-tighter font-bold text-outline mb-1">
                  Temperature
                </span>
                <span className="text-xl font-bold text-on-surface">0.7 - Balanced</span>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-2xl">
                <span className="block text-xs uppercase tracking-tighter font-bold text-outline mb-1">
                  Context Window
                </span>
                <span className="text-xl font-bold text-on-surface">128k Tokens</span>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-2xl hidden md:block">
                <span className="block text-xs uppercase tracking-tighter font-bold text-outline mb-1">
                  Response Style
                </span>
                <span className="text-xl font-bold text-on-surface">Inquiry-Based</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="settings" onNavigate={() => {}} />
    </div>
  );
}

/**
 * 单个人格卡片组件
 */
interface AgentCardProps {
  agent: BuiltinAgentDefinition;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onActivate: () => void;
  onCopy?: () => void;
}

function AgentCard({
  agent,
  isActive,
  isExpanded,
  onToggleExpand,
  onActivate,
  onCopy,
}: AgentCardProps) {
  return (
    <div
      className={cn(
        'relative group p-8 rounded-[2rem] transition-all duration-300',
        'bg-surface-container-low border border-outline-variant/15',
        'hover:bg-surface-container-high',
        isActive && 'border-primary/20 shadow-lg ring-2 ring-primary bg-surface-container-lowest'
      )}
    >
      {/* Active 标签 */}
      {isActive && (
        <div className="absolute top-6 right-6">
          <span className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Active
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Emoji Icon */}
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200',
          isActive
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest'
        )}>
          <span className="text-3xl">{agent.emoji}</span>
        </div>

        {/* 名称和描述 */}
        <div>
          <h4 className="text-2xl font-bold text-on-surface mb-2">{agent.name}</h4>
          <p className="text-on-surface-variant leading-relaxed">{agent.description}</p>
        </div>

        {/* 特质标签 */}
        <div className="flex flex-wrap gap-2">
          {extractTraits(agent.soulMd).slice(0, 3).map((trait, idx) => (
            <span
              key={idx}
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
                isActive
                  ? 'bg-primary-container/20 text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              )}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* 展开详情 */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in-up">
            {/* SOUL 摘要 */}
            <div className="bg-surface-container rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                Core Traits
              </h4>
              <p className="text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
                {extractCoreTraits(agent.soulMd)}
              </p>
            </div>

            {/* 提问风格 */}
            <div className="bg-surface-container rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                Question Style
              </h4>
              <p className="text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
                {extractQuestionStyle(agent.soulMd)}
              </p>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-4">
          {isActive ? (
            <Button
              variant="primary"
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              disabled
            >
              Current Choice
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              onClick={onActivate}
            >
              Select Persona
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-surface-container-highest"
            onClick={onToggleExpand}
          >
            <span className="material-symbols-outlined text-sm">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </Button>
          {onCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-surface-container-highest"
              onClick={onCopy}
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 辅助函数：从 SOUL.md 提取特质标签
 */
function extractTraits(soulMd: string): string[] {
  const match = soulMd.match(/## 核心特质\n([\s\S]*?)(?=\n##|$)/);
  if (match) {
    return match[1]
      .trim()
      .split('\n')
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((line) => line.length > 0);
  }
  return ['thoughtful', 'empathetic', 'insightful'];
}

/**
 * 辅助函数：从 SOUL.md 提取核心特质
 */
function extractCoreTraits(soulMd: string): string {
  const match = soulMd.match(/## 核心特质\n([\s\S]*?)(?=\n##|$)/);
  if (match) {
    return match[1]
      .trim()
      .split('\n')
      .map((line) => line.replace(/^-\s*/, ''))
      .join('\n');
  }
  return '';
}

/**
 * 辅助函数：从 SOUL.md 提取提问风格
 */
function extractQuestionStyle(soulMd: string): string {
  const match = soulMd.match(/## 提问风格\n([\s\S]*?)(?=\n##|$)/);
  if (match) {
    return match[1]
      .trim()
      .split('\n')
      .map((line) => line.replace(/^-\s*/, ''))
      .join('\n');
  }
  return '';
}

export default AgentPersonas;