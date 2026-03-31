/**
 * Agent 人格解析器
 *
 * 解析 OpenClaw 格式的 Agent Profile 文件
 */

import type { AgentProfile } from '../types';

/**
 * 解析结果
 */
export interface ParsedAgentProfile {
  name: string;
  emoji?: string;
  description?: string;
  agentsMd?: string;
  soulMd?: string;
  identityMd?: string;
  userMd?: string;
  toolsMd?: string;
}

/**
 * 从 IDENTITY.md 解析名称和 emoji
 */
export function parseIdentityMd(identityMd: string | undefined): {
  name: string;
  emoji?: string;
} {
  if (!identityMd) {
    return { name: 'Unknown' };
  }

  // 查找名称：格式为 "# IDENTITY - {name}"
  const nameMatch = identityMd.match(/^#\s*IDENTITY\s*-\s*(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

  // 查找 emoji：查找 "## Emoji" 后面的内容
  const emojiMatch = identityMd.match(/##\s*Emoji\s*\n?\s*(.+)$/m);
  const emoji = emojiMatch ? emojiMatch[1].trim() : undefined;

  // 或者直接查找末尾的 emoji（有些格式是直接写 emoji）
  if (!emoji) {
    const lastLineEmojiMatch = identityMd.match(/Emoji\n\s*([^\s]+)\s*$/m);
    if (lastLineEmojiMatch) {
      return { name, emoji: lastLineEmojiMatch[1].trim() };
    }
  }

  return { name, emoji };
}

/**
 * 从 SOUL.md 解析描述
 */
export function parseSoulMd(soulMd: string | undefined): string | undefined {
  if (!soulMd) {
    return undefined;
  }

  // 查找标题：格式为 "# SOUL - {name}"
  const titleMatch = soulMd.match(/^#\s*SOUL\s*-\s*(.+)$/m);
  if (!titleMatch) {
    return undefined;
  }

  // 描述通常是第一段非标题内容
  const lines = soulMd.split('\n');
  let descriptionStart = -1;

  for (let i = 0; i < lines.length; i++) {
    // 找到第一个非标题、非空行的内容块
    if (!lines[i].startsWith('#') && lines[i].trim() !== '') {
      descriptionStart = i;
      break;
    }
  }

  if (descriptionStart === -1) {
    return undefined;
  }

  // 收集描述内容（直到下一个标题或空行后的标题）
  const descriptionLines: string[] = [];
  for (let i = descriptionStart; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#')) {
      break;
    }
    if (line.trim() !== '') {
      descriptionLines.push(line.trim());
    }
  }

  return descriptionLines.join(' ').slice(0, 100); // 限制长度
}

/**
 * 从 AGENTS.md 解析核心行为规则
 */
export function parseAgentsMd(agentsMd: string | undefined): string[] {
  if (!agentsMd) {
    return [];
  }

  const rules: string[] = [];
  const lines = agentsMd.split('\n');

  let inRulesSection = false;
  for (const line of lines) {
    if (line.match(/^##\s*行为规则/)) {
      inRulesSection = true;
      continue;
    }
    if (line.match(/^##\s*/)) {
      inRulesSection = false;
      continue;
    }
    if (inRulesSection && line.match(/^\d+\.\s*/)) {
      rules.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }

  return rules;
}

/**
 * 构建系统提示
 *
 * 组合 SOUL + IDENTITY + AGENTS 等内容
 */
export function buildSystemPrompt(profile: AgentProfile): string {
  const parts: string[] = [];

  // 核心指令（始终包含）
  parts.push(`=== CORE INSTRUCTION ===
你是一个 AskMe AI 助手。你的核心行为模式是：主动向用户提问，而不是直接给出答案。
通过提问引导用户思考、学习、探索或自我发现。
每次回应后，都要提出一个开放性的问题，推动对话继续。

当前人格：${profile.name} ${profile.emoji || ''}`);

  // IDENTITY
  if (profile.identityMd) {
    parts.push(`=== IDENTITY ===\n${profile.identityMd}`);
  }

  // SOUL
  if (profile.soulMd) {
    parts.push(`=== SOUL ===\n${profile.soulMd}`);
  }

  // AGENTS
  if (profile.agentsMd) {
    parts.push(`=== AGENTS ===\n${profile.agentsMd}`);
  }

  // USER（用户自定义信息）
  if (profile.userMd) {
    parts.push(`=== USER ===\n${profile.userMd}`);
  }

  // TOOLS（工具说明）
  if (profile.toolsMd) {
    parts.push(`=== TOOLS ===\n${profile.toolsMd}`);
  }

  return parts.join('\n\n');
}

/**
 * 解析完整的 Agent Profile
 */
export function parseAgentProfile(
  _id: string, // ID 用于未来扩展，当前未使用
  files: {
    agentsMd?: string;
    soulMd?: string;
    identityMd?: string;
    userMd?: string;
    toolsMd?: string;
  }
): ParsedAgentProfile {
  const { name, emoji } = parseIdentityMd(files.identityMd);
  const description = parseSoulMd(files.soulMd);

  return {
    name,
    emoji,
    description,
    agentsMd: files.agentsMd,
    soulMd: files.soulMd,
    identityMd: files.identityMd,
    userMd: files.userMd,
    toolsMd: files.toolsMd,
  };
}

/**
 * 验证 Agent Profile 是否有效
 */
export function validateAgentProfile(profile: ParsedAgentProfile): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!profile.name || profile.name === 'Unknown') {
    errors.push('缺少有效的名称（IDENTITY.md 格式错误）');
  }

  if (!profile.soulMd) {
    errors.push('缺少 SOUL.md');
  }

  if (!profile.identityMd) {
    errors.push('缺少 IDENTITY.md');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}