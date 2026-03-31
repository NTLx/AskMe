/**
 * Agent 人格加载器
 *
 * 负责加载和管理 Agent Profile
 *
 * Web 版本：从 IndexedDB 加载
 * Tauri 版本：通过 Tauri Command 从文件系统加载
 */

import type { AgentProfile } from '../types';
import {
  getBuiltinAgentProfiles,
  getBuiltinAgentById,
  isBuiltinAgentId,
  BUILTIN_AGENT_IDS,
  BUILTIN_AGENTS,
} from './builtins';
import { buildSystemPrompt } from './parser';

/**
 * Agent 加载器接口
 */
export interface AgentLoader {
  /**
   * 获取所有 Agent Profiles
   */
  listProfiles(): Promise<AgentProfile[]>;

  /**
   * 根据 ID 获取单个 Agent Profile
   */
  getProfile(id: string): Promise<AgentProfile | null>;

  /**
   * 保存 Agent Profile
   */
  saveProfile(profile: AgentProfile): Promise<void>;

  /**
   * 删除 Agent Profile（仅限自定义）
   */
  deleteProfile(id: string): Promise<void>;

  /**
   * 获取 Agent 的系统提示
   */
  getSystemPrompt(id: string): Promise<string | null>;
}

/**
 * 内存中的 Agent Profile 存储（用于开发/测试）
 */
class InMemoryAgentLoader implements AgentLoader {
  private profiles: Map<string, AgentProfile> = new Map();

  constructor() {
    // 初始化内置人格
    for (const profile of getBuiltinAgentProfiles()) {
      this.profiles.set(profile.id, profile);
    }
  }

  async listProfiles(): Promise<AgentProfile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfile(id: string): Promise<AgentProfile | null> {
    return this.profiles.get(id) || null;
  }

  async saveProfile(profile: AgentProfile): Promise<void> {
    this.profiles.set(profile.id, {
      ...profile,
      updatedAt: Date.now(),
    });
  }

  async deleteProfile(id: string): Promise<void> {
    if (isBuiltinAgentId(id)) {
      throw new Error('无法删除内置人格');
    }
    this.profiles.delete(id);
  }

  async getSystemPrompt(id: string): Promise<string | null> {
    const profile = await this.getProfile(id);
    if (!profile) {
      return null;
    }
    return buildSystemPrompt(profile);
  }
}

/**
 * 全局 Agent 加载器实例
 */
let globalLoader: AgentLoader | null = null;

/**
 * 获取 Agent 加载器实例
 */
export function getAgentLoader(): AgentLoader {
  if (!globalLoader) {
    globalLoader = new InMemoryAgentLoader();
  }
  return globalLoader;
}

/**
 * 设置自定义 Agent 加载器
 */
export function setAgentLoader(loader: AgentLoader): void {
  globalLoader = loader;
}

/**
 * 便捷方法：获取所有 Agent Profiles
 */
export async function listAgentProfiles(): Promise<AgentProfile[]> {
  return getAgentLoader().listProfiles();
}

/**
 * 便捷方法：获取单个 Agent Profile
 */
export async function getAgentProfile(id: string): Promise<AgentProfile | null> {
  return getAgentLoader().getProfile(id);
}

/**
 * 便捷方法：获取系统提示
 */
export async function getAgentSystemPrompt(id: string): Promise<string | null> {
  return getAgentLoader().getSystemPrompt(id);
}

/**
 * 便捷方法：保存 Agent Profile
 */
export async function saveAgentProfile(profile: AgentProfile): Promise<void> {
  return getAgentLoader().saveProfile(profile);
}

/**
 * 便捷方法：删除自定义 Agent Profile
 */
export async function deleteAgentProfile(id: string): Promise<void> {
  return getAgentLoader().deleteProfile(id);
}

/**
 * 创建自定义 Agent Profile
 */
export async function createCustomAgentProfile(
  name: string,
  emoji?: string,
  description?: string,
  soulMd?: string,
  identityMd?: string,
  agentsMd?: string
): Promise<AgentProfile> {
  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = Date.now();

  const profile: AgentProfile = {
    id,
    name,
    emoji,
    description,
    isBuiltin: false,
    isActive: false,
    soulMd,
    identityMd: identityMd || `# IDENTITY - ${name}\n\n## 角色定位\n自定义 Agent\n\n## Emoji\n${emoji || '🤖'}`,
    agentsMd,
    createdAt: now,
    updatedAt: now,
  };

  await saveAgentProfile(profile);
  return profile;
}

/**
 * 复制 Agent Profile（用于创建新人格）
 */
export async function cloneAgentProfile(
  sourceId: string,
  newName: string
): Promise<AgentProfile> {
  const source = await getAgentProfile(sourceId);
  if (!source) {
    throw new Error('源 Agent Profile 不存在');
  }

  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = Date.now();

  const profile: AgentProfile = {
    ...source,
    id,
    name: newName,
    isBuiltin: false,
    isActive: false,
    createdAt: now,
    updatedAt: now,
  };

  await saveAgentProfile(profile);
  return profile;
}

/**
 * 获取默认 Agent Profile ID
 */
export function getDefaultAgentProfileId(): string {
  return 'gentle_guide'; // 默认使用温和引导者
}

/**
 * 检查 Agent Profile 是否存在
 */
export async function agentProfileExists(id: string): Promise<boolean> {
  const profile = await getAgentProfile(id);
  return profile !== null;
}

/**
 * 导出 Agent Profile 配置文件
 */
export function exportAgentProfileFiles(profile: AgentProfile): Record<string, string> {
  const files: Record<string, string> = {};

  if (profile.identityMd) {
    files['IDENTITY.md'] = profile.identityMd;
  }
  if (profile.soulMd) {
    files['SOUL.md'] = profile.soulMd;
  }
  if (profile.agentsMd) {
    files['AGENTS.md'] = profile.agentsMd;
  }
  if (profile.userMd) {
    files['USER.md'] = profile.userMd;
  }
  if (profile.toolsMd) {
    files['TOOLS.md'] = profile.toolsMd;
  }

  return files;
}

/**
 * 重新导出内置人格相关内容
 */
export {
  getBuiltinAgentProfiles,
  getBuiltinAgentById,
  isBuiltinAgentId,
  BUILTIN_AGENT_IDS,
  BUILTIN_AGENTS,
};