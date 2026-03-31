/**
 * Agent Personas 设置页面
 * 像素级对齐 UI Reference: stitch_askme_web-dark/1
 *
 * 设计规范:
 * - "CONFIGURATION" label + display 标题 "Curate your intellectual companions."
 * - 3 列卡片网格 (含 Create New Persona)
 * - 卡片: surface-container 背景, rounded-xl, emoji 头像 + 名称 + 描述 + 特质 tags
 * - 底部 CTA: "Need a specialist?" + "Explore Marketplace" 按钮
 * - 无边框设计
 */

import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { BUILTIN_AGENTS, BuiltinAgentDefinition } from '../../../agent/builtins';
import type { AgentProfile } from '../../../types';

interface AgentPersonasProps {
  activeAgentId?: string;
  onActivateAgent?: (agentId: string) => void;
  onEditAgent?: (agent: AgentProfile) => void;
  onCopyAgent?: (agent: AgentProfile) => void;
  onDeleteAgent?: (agentId: string) => void;
  onCreateAgent?: () => void;
}

export function AgentPersonas({
  activeAgentId,
  onActivateAgent: _onActivateAgent,
  onEditAgent: _onEditAgent,
  onCopyAgent: _onCopyAgent,
  onDeleteAgent: _onDeleteAgent,
  onCreateAgent,
}: AgentPersonasProps) {
  const [_expandedCardId, _setExpandedCardId] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        {/* CONFIGURATION label */}
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
          Configuration
        </p>

        {/* 大标题 */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-display tracking-tight leading-tight mb-4">
          Curate your <em className="italic text-primary-dim">intellectual<br />companions</em>.
        </h2>

        {/* 描述 */}
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed">
          Select and customize the personality of your AI. Each agent
          employs a unique questioning strategy designed to challenge your
          perspective.
        </p>
      </div>

      {/* Agent Grid - 3 列 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Create New Persona Card */}
        <button
          onClick={onCreateAgent}
          className={cn(
            'group p-8 rounded-xl',
            'border-2 border-dashed border-outline-variant/30',
            'bg-transparent',
            'hover:border-primary/30 hover:bg-primary-container/5',
            'transition-all duration-300',
            'flex flex-col items-center justify-center text-center',
            'cursor-pointer min-h-[320px]'
          )}
        >
          <div className="w-14 h-14 rounded-full border-2 border-outline-variant/40 text-on-surface-variant flex items-center justify-center mb-6 group-hover:border-primary group-hover:text-primary transition-all duration-300">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h4 className="text-lg font-bold text-on-surface mb-2">Create New Persona</h4>
          <p className="text-on-surface-variant text-sm max-w-[200px]">
            Define custom traits, biases, and inquiry frameworks for a bespoke experience.
          </p>
        </button>

        {/* Agent Cards */}
        {BUILTIN_AGENTS.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
          />
        ))}
      </div>

      {/* Bottom CTA - "Need a specialist?" */}
      <div className="bg-surface-container-low rounded-xl p-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1">Need a specialist?</h3>
          <p className="text-on-surface-variant text-sm">
            Browse the community marketplace for niche personas.
          </p>
        </div>
        <button className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-primary-dim transition-colors">
          Explore Marketplace
        </button>
      </div>
    </div>
  );
}

/**
 * 单个 Agent 卡片
 */
interface AgentCardProps {
  agent: BuiltinAgentDefinition;
  isActive: boolean;
}

function AgentCard({ agent, isActive }: AgentCardProps) {
  // 提取特质
  const traits = extractTraits(agent.soulMd);

  return (
    <div
      className={cn(
        'relative group p-6 rounded-xl transition-all duration-300',
        'bg-surface-container',
        'hover:bg-surface-bright',
        isActive && 'ring-2 ring-primary bg-surface-container-lowest'
      )}
    >
      {/* 顶部: Emoji + 操作按钮 */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          isActive
            ? 'bg-primary-container'
            : 'bg-surface-container-high'
        )}>
          <span className="text-2xl">{agent.emoji}</span>
        </div>

        {/* Edit / Copy 按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
        </div>
      </div>

      {/* 名称 */}
      <h4 className="text-xl font-bold text-on-surface mb-2">{agent.name}</h4>

      {/* 描述 */}
      <p className="text-on-surface-variant text-sm leading-relaxed mb-4 min-h-[60px]">
        {agent.description}
      </p>

      {/* 特质标签 */}
      <div className="flex flex-wrap gap-2">
        {traits.slice(0, 3).map((trait, idx) => (
          <span
            key={idx}
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider',
              isActive
                ? 'bg-primary-container/20 text-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            )}
          >
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 从 SOUL.md 提取特质标签
 */
function extractTraits(soulMd: string): string[] {
  const match = soulMd.match(/## 核心特质\n([\s\S]*?)(?=\n##|$)/);
  if (match) {
    return match[1]
      .trim()
      .split('\n')
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((line) => line.length > 0 && line.length < 20);
  }
  return ['Empathetic', 'Soft-paced', 'Supportive'];
}

export default AgentPersonas;