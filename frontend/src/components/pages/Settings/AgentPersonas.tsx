/**
 * Agent 人格设置页面 - 手机版设计
 * 采用垂直卡片列表布局，遵循"Digital Curator"设计规范
 * - 无边框设计，使用 surface 层级区分
 * - 激活状态使用 primary 容器背景和光晕
 * - 每个人格卡片展示核心特质和提问风格
 */

import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { Card, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { BUILTIN_AGENTS, BuiltinAgentDefinition } from '../../../agent/builtins';
import type { AgentProfile } from '../../../types';
import { BottomNav } from '../../BottomNav';

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
 * 单个人格卡片组件 - 手机版设计
 */
interface PersonaCardProps {
  agent: BuiltinAgentDefinition;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onActivate: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
}

function PersonaCard({
  agent,
  isActive,
  isExpanded,
  onToggleExpand,
  onActivate,
  onEdit,
  onCopy,
}: PersonaCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 mb-4',
        'border-0 bg-surface-container-lowest',
        isActive
          ? 'ring-2 ring-primary/30 shadow-lg'
          : 'hover:bg-surface-container',
      )}
      variant="interactive"
    >
      {/* 激活状态光晕背景 */}
      {isActive && (
        <div className="absolute inset-0 bg-primary/5 animate-glow pointer-events-none" />
      )}

      <CardContent className="relative z-10 p-4">
        {/* 头部：Emoji + 名称 + 激活指示器 */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200',
            isActive
              ? 'bg-primary-container text-on-primary'
              : 'bg-surface-container-high text-on-surface-variant'
          )}>
            <span className="text-2xl">{agent.emoji}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-display font-semibold text-on-surface">
                {agent.name}
              </CardTitle>
              {isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-xs font-medium">
                  ACTIVE
                </span>
              )}
            </div>
            <CardDescription className="text-xs mt-1 text-on-surface-variant">
              {getPersonaSubtitle(agent.id)}
            </CardDescription>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-sm text-on-surface-variant mb-3 leading-relaxed">
          {agent.description}
        </p>

        {/* 特质标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {extractTraits(agent.soulMd).slice(0, 3).map((trait, idx) => (
            <span
              key={idx}
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
                isActive
                  ? 'bg-primary-container/20 text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              )}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* 展开面板 */}
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in-up">
            {/* SOUL 摘要 */}
            <div className="bg-surface-container rounded-lg p-3">
              <h4 className="text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                Core Traits
              </h4>
              <p className="text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
                {extractCoreTraits(agent.soulMd)}
              </p>
            </div>

            {/* 提问风格 */}
            <div className="bg-surface-container rounded-lg p-3">
              <h4 className="text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                Question Style
              </h4>
              <p className="text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
                {extractQuestionStyle(agent.soulMd)}
              </p>
            </div>
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-on-surface-variant"
          >
            {isExpanded ? '收起' : '详情'}
          </Button>

          <div className="flex gap-2">
            {!isActive && (
              <Button
                variant="primary"
                size="sm"
                onClick={onActivate}
                className="bg-primary-container text-on-primary hover:bg-primary-fixed"
              >
                Select Persona
              </Button>
            )}
            {onEdit && !agent.isBuiltin && (
              <Button variant="ghost" size="sm">编辑</Button>
            )}
            {onCopy && (
              <Button variant="ghost" size="sm">复制</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * AgentPersonas 主组件
 */
export function AgentPersonas({
  activeAgentId,
  onActivateAgent,
  onEditAgent,
  onCopyAgent,
  onDeleteAgent: _onDeleteAgent,
  onCreateAgent,
}: AgentPersonasProps) {
  // 状态：展开的卡片 ID
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // 切换展开状态
  const handleToggleExpand = (agentId: string) => {
    setExpandedCardId(expandedCardId === agentId ? null : agentId);
  };

  // 激活人格
  const handleActivate = (agentId: string) => {
    if (onActivateAgent) {
      onActivateAgent(agentId);
    }
  };

  // 编辑人格
  const handleEdit = (agent: BuiltinAgentDefinition) => {
    if (onEditAgent) {
      const now = Date.now();
      onEditAgent({
        ...agent,
        id: `${agent.id}_copy_${Date.now()}`,
        name: `${agent.name} (副本)`,
        isBuiltin: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  };

  // 复制人格
  const handleCopy = (agent: BuiltinAgentDefinition) => {
    if (onCopyAgent) {
      const now = Date.now();
      onCopyAgent({
        ...agent,
        id: `${agent.id}_copy_${Date.now()}`,
        name: `${agent.name} (副本)`,
        isBuiltin: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <p className="text-xs text-primary font-medium uppercase tracking-widest mb-1">
            SYSTEM PREFERENCES
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface flex items-center gap-2">
            Agent Personas
            <span className="text-on-surface-variant/50">人格</span>
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Define how your AI assistant interacts, thinks, and responds. Choose from curated intellectual profiles or create your own custom expert.
          </p>
        </div>
      </header>

      {/* 人格列表 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-32">
        {BUILTIN_AGENTS.map((agent) => (
          <PersonaCard
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
            isExpanded={expandedCardId === agent.id}
            onToggleExpand={() => handleToggleExpand(agent.id)}
            onActivate={() => handleActivate(agent.id)}
            onEdit={agent.isBuiltin ? undefined : () => handleEdit(agent)}
            onCopy={() => handleCopy(agent)}
          />
        ))}

        {/* 创建新人格卡片 */}
        {onCreateAgent && (
          <button
            onClick={onCreateAgent}
            className="w-full py-8 border-2 border-dashed border-outline-variant/30 rounded-2xl
              flex flex-col items-center justify-center gap-2
              hover:bg-surface-container hover:border-primary/30 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="text-2xl text-on-surface-variant">+</span>
            </div>
            <span className="text-sm font-display font-medium text-on-surface-variant">
              Create New Persona
            </span>
          </button>
        )}

        {/* Persona Logic 说明卡片 */}
        <div className="mt-6 bg-surface-container-low rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-on-surface mb-2">
            Persona Logic
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
            Our personas are powered by a custom cognitive architecture that adjusts
            temperature and system prompts dynamically.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest rounded-lg p-3">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Temperature
              </p>
              <p className="text-sm font-display font-semibold text-on-surface">
                0.7 - Balanced
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-3">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Context Window
              </p>
              <p className="text-sm font-display font-semibold text-on-surface">
                128k Tokens
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="profile" onNavigate={() => {}} />
    </div>
  );
}

/**
 * 辅助函数：获取人格副标题
 */
function getPersonaSubtitle(agentId: string): string {
  const subtitles: Record<string, string> = {
    gentle_guide: '温和引导式提问',
    socrates: '苏格拉底式追问',
    neutral_explorer: '中立探索式协助',
    inspiration_catalyst: '创意激发式引导',
  };
  return subtitles[agentId] || 'AI 人格助手';
}

/**
 * 辅助函数：从 SOUL.md 提取核心特质
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
  return [' thoughtful', 'empathetic', 'insightful'];
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
