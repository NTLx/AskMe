/**
 * SQLite 存储提供者实现（存根）
 *
 * 通过 Tauri IPC 调用 Rust 后端的 SQLite 操作
 * 用于桌面/移动版本
 *
 * 注意：此文件仅定义接口，实际数据操作在 src-tauri 中实现
 */

import type {
  Session,
  SessionListItem,
  Message,
  AgentProfile,
  LLMProvider,
  Tag,
  SearchRequest,
  SearchResult,
} from '../types';
import type { StorageProvider, ListSessionsOptions } from './interface';

// ============ Tauri IPC 类型定义 ============

/** Tauri invoke 函数类型 */
type TauriInvoke = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;

/** 检测是否在 Tauri 环境中 */
function isTauriEnvironment(): boolean {
  // 检测 window.__TAURI__ 是否存在
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/** 获取 Tauri invoke 函数 */
async function getTauriInvoke(): Promise<TauriInvoke | null> {
  if (!isTauriEnvironment()) {
    return null;
  }

  try {
    // 动态导入 @tauri-apps/api
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke as TauriInvoke;
  } catch {
    console.warn('Tauri API not available, falling back to IndexedDB');
    return null;
  }
}

// ============ SQLite Provider 实现 ============

export class SQLiteProvider implements StorageProvider {
  private invoke: TauriInvoke | null = null;
  private initialized = false;

  constructor() {
    // 延迟初始化 invoke 函数
    this.init();
  }

  private async init(): Promise<void> {
    if (this.initialized) return;

    this.invoke = await getTauriInvoke();
    this.initialized = true;
  }

  /** 确保 invoke 可用 */
  private async ensureInvoke(): Promise<TauriInvoke> {
    await this.init();

    if (!this.invoke) {
      throw new Error('Tauri environment not available. Use IndexedDBProvider for web.');
    }

    return this.invoke;
  }

  /** 调用 Tauri Command */
  private async call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    const invoke = await this.ensureInvoke();
    return invoke(cmd, args) as Promise<T>;
  }

  // ============ 会话操作 ============

  async createSession(session: Session): Promise<string> {
    return this.call<string>('create_session', { session });
  }

  async getSession(id: string): Promise<Session | null> {
    return this.call<Session | null>('get_session', { id });
  }

  async updateSession(session: Session): Promise<void> {
    return this.call<void>('update_session', { session });
  }

  async deleteSession(id: string): Promise<void> {
    return this.call<void>('delete_session', { id });
  }

  async listSessions(options?: ListSessionsOptions): Promise<SessionListItem[]> {
    return this.call<SessionListItem[]>('list_sessions', { options });
  }

  // ============ 消息操作 ============

  async createMessage(message: Message): Promise<string> {
    return this.call<string>('create_message', { message });
  }

  async getMessages(sessionId: string, limit?: number): Promise<Message[]> {
    return this.call<Message[]>('get_messages', { sessionId, limit });
  }

  async updateMessage(message: Message): Promise<void> {
    return this.call<void>('update_message', { message });
  }

  // ============ Agent Profile ============

  async getAgentProfile(id: string): Promise<AgentProfile | null> {
    return this.call<AgentProfile | null>('get_agent_profile', { id });
  }

  async listAgentProfiles(): Promise<AgentProfile[]> {
    return this.call<AgentProfile[]>('list_agent_profiles');
  }

  async saveAgentProfile(profile: AgentProfile): Promise<void> {
    return this.call<void>('save_agent_profile', { profile });
  }

  // ============ LLM Provider ============

  async getLLMProvider(id: string): Promise<LLMProvider | null> {
    return this.call<LLMProvider | null>('get_llm_provider', { id });
  }

  async listLLMProviders(): Promise<LLMProvider[]> {
    return this.call<LLMProvider[]>('list_llm_providers');
  }

  async saveLLMProvider(provider: LLMProvider): Promise<void> {
    return this.call<void>('save_llm_provider', { provider });
  }

  // ============ 标签 ============

  async getTags(): Promise<Tag[]> {
    return this.call<Tag[]>('get_tags');
  }

  async addTag(tag: Tag): Promise<void> {
    return this.call<void>('add_tag', { tag });
  }

  async linkTag(sessionId: string, tagId: string): Promise<void> {
    return this.call<void>('link_tag', { sessionId, tagId });
  }

  async unlinkTag(sessionId: string, tagId: string): Promise<void> {
    return this.call<void>('unlink_tag', { sessionId, tagId });
  }

  // ============ 搜索 ============

  async searchSessions(query: SearchRequest): Promise<SearchResult> {
    return this.call<SearchResult>('search_sessions', { query });
  }

  // ============ 加密 ============

  async encryptApiKey(apiKey: string): Promise<string> {
    return this.call<string>('encrypt_api_key', { apiKey });
  }

  async decryptApiKey(encrypted: string): Promise<string> {
    return this.call<string>('decrypt_api_key', { encrypted });
  }

  // ============ 设置 ============

  async getSetting(key: string): Promise<string | null> {
    return this.call<string | null>('get_setting', { key });
  }

  async setSetting(key: string, value: string): Promise<void> {
    return this.call<void>('set_setting', { key, value });
  }
}

// ============ 导出 ============

/** 创建 SQLite Provider */
export function createSQLiteProvider(): StorageProvider {
  return new SQLiteProvider();
}

/** 检测是否可用 */
export async function isSQLiteProviderAvailable(): Promise<boolean> {
  const invoke = await getTauriInvoke();
  return invoke !== null;
}