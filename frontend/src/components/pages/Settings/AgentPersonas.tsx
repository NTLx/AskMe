/**
 * Agent Personas 设置页面
 * 像素级对齐 UI Reference: stitch_askme_web-dark/1
 *
 * 设计规范:
 * - "CONFIGURATION" label + display 标题 "Curate your intellectual companions."
 * - 3 列卡片网格 (含 Create New Persona)
 * - 卡片: surface-container 背景, rounded-3xl, emoji 头像 + 名称 + 描述 + 特质 tags
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
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Hero Section / Editorial Header */}
      <section className="mb-16">
        <div className="flex flex-col gap-4">
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase">
            Configuration
          </span>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface max-w-2xl leading-tight">
            Curate your <span className="text-primary italic">intellectual companions</span>.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Select and customize the personality of your AI. Each agent employs a unique questioning strategy designed to challenge your perspective.
          </p>
        </div>
      </section>

      {/* Bento Grid of Agent Personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Persona Card (Asymmetric Entry) */}
        <div
          onClick={onCreateAgent}
          className="lg:col-span-1 group relative overflow-hidden bg-surface-container rounded-3xl border border-dashed border-outline-variant/30 hover:border-primary/50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-8 min-h-[320px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-container transition-all duration-500">
            <span className="material-symbols-outlined text-3xl text-primary group-hover:text-on-primary-container">add</span>
          </div>
          <h3 className="text-xl font-bold font-headline text-on-surface">Create New Persona</h3>
          <p className="text-on-surface-variant text-center mt-2 text-sm px-4">
            Define custom traits, biases, and inquiry frameworks for a bespoke experience.
          </p>
        </div>

        {/* Agent Cards */}
        {BUILTIN_AGENTS.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
            index={index}
          />
        ))}
      </div>

      {/* Experimental Section Footer */}
      <section className="mt-24 border-t border-outline-variant/10 pt-12 pb-24">
        <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="text-xl font-bold font-headline text-on-surface">Need a specialist?</h4>
            <p className="text-on-surface-variant text-sm mt-1">Browse the community marketplace for niche personas.</p>
          </div>
          <button className="px-8 py-3 rounded-full bg-secondary-container text-secondary font-bold hover:bg-secondary hover:text-on-secondary transition-all active:scale-95">
            Explore Marketplace
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * 单个 Agent 卡片
 */
interface AgentCardProps {
  agent: BuiltinAgentDefinition;
  isActive: boolean;
  index: number;
}

function AgentCard({ agent, isActive, index }: AgentCardProps) {
  // 提取特质
  const traits = extractTraits(agent.soulMd);

  // Inspiration Catalyst 特殊布局处理（假设为第四个内置Agent，即索引为3）
  const isSpecialCard = index === 3;

  // 根据索引轮换不同的背景色主题
  const bgColors = [
    'bg-tertiary-container',
    'bg-primary-container',
    'bg-secondary-container',
    'bg-tertiary-fixed-dim'
  ];
  const iconBgClass = bgColors[index % bgColors.length];

  return (
    <div
      className={cn(
        'group bg-surface-container rounded-3xl p-8 flex flex-col transition-all duration-300 hover:bg-surface-bright relative overflow-hidden',
        isActive && 'ring-2 ring-primary bg-surface-container-lowest',
        isSpecialCard && 'md:col-span-2 lg:col-span-2'
      )}
    >
      {/* 背景光晕层 (非特殊卡片显示右上角光晕，特殊卡片显示底部渐变) */}
      {!isSpecialCard ? (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary-container/5 to-transparent pointer-events-none"></div>
      )}

      {/* Emoji & 操作按钮 */}
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl',
          iconBgClass
        )}>
          {agent.emoji}
        </div>
        <div className="flex gap-1 relative z-10">
          <button className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined text-lg">content_copy</span>
          </button>
        </div>
      </div>

      {isSpecialCard ? (
        <div className="flex flex-col lg:flex-row lg:gap-12 relative z-10 flex-grow">
          <div className="flex-1 flex flex-col">
            <h3 className="text-2xl font-bold font-headline text-on-surface mb-3">{agent.name}</h3>
            <p className="text-on-surface-variant leading-relaxed flex-grow">
              {agent.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {traits.slice(0, 3).map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-surface-container-low text-[10px] font-bold text-outline uppercase tracking-wider"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-48 h-32 rounded-2xl overflow-hidden mt-4">
            <img
              alt="Creative sparks"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGudTMHhdoS2hVIB5QThtOZjJFJ7V6DBUdATFouFpfZsVFkUQUltbaqJU6_8UhwlxIB-ARJWtaGdvjAJLN9hdaV0nvmBJsex9OVnIVaN0ZEggVWYfixG4DPv3189aPc6S7szkMC7AJw4OcOnjwTkKSnlGBj8NwFdyMVMBO0CRmbGW0b8ZmcRsPGg1_MC820YfX7CgeXQXIceU0_8Va7EcMUpMOahNX1d4Pr7RT4kXftnZ_tR9tKgC5izrNUmdhwQ1WsJMzBZ1_8a76"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold font-headline text-on-surface mb-3">{agent.name}</h3>
          <p className="text-on-surface-variant leading-relaxed flex-grow">
            {agent.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {traits.slice(0, 3).map((trait, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-surface-container-low text-[10px] font-bold text-outline uppercase tracking-wider"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
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