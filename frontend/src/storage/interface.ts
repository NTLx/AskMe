/**
 * 存储提供者接口 - 由不同平台实现
 *
 * Web 版本使用 IndexedDB + Web Crypto API
 * Tauri 版本使用 SQLite + 系统 Keychain (通过 IPC)
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

export interface StorageProvider {
  // ============ 会话操作 ============

  /** 创建新会话 */
  createSession(session: Session): Promise<string>;

  /** 获取单个会话 */
  getSession(id: string): Promise<Session | null>;

  /** 更新会话 */
  updateSession(session: Session): Promise<void>;

  /** 删除会话 */
  deleteSession(id: string): Promise<void>;

  /** 获取会话列表 */
  listSessions(options?: ListSessionsOptions): Promise<SessionListItem[]>;

  // ============ 消息操作 ============

  /** 创建新消息 */
  createMessage(message: Message): Promise<string>;

  /** 获取会话的消息列表 */
  getMessages(sessionId: string, limit?: number): Promise<Message[]>;

  /** 更新消息 */
  updateMessage(message: Message): Promise<void>;

  // ============ Agent Profile ============

  /** 获取单个 Agent Profile */
  getAgentProfile(id: string): Promise<AgentProfile | null>;

  /** 获取所有 Agent Profiles */
  listAgentProfiles(): Promise<AgentProfile[]>;

  /** 保存 Agent Profile */
  saveAgentProfile(profile: AgentProfile): Promise<void>;

  // ============ LLM Provider ============

  /** 获取单个 LLM Provider */
  getLLMProvider(id: string): Promise<LLMProvider | null>;

  /** 获取所有 LLM Providers */
  listLLMProviders(): Promise<LLMProvider[]>;

  /** 保存 LLM Provider */
  saveLLMProvider(provider: LLMProvider): Promise<void>;

  // ============ 标签 ============

  /** 获取所有标签 */
  getTags(): Promise<Tag[]>;

  /** 添加标签 */
  addTag(tag: Tag): Promise<void>;

  /** 关联标签到会话 */
  linkTag(sessionId: string, tagId: string): Promise<void>;

  /** 解除标签与会话的关联 */
  unlinkTag(sessionId: string, tagId: string): Promise<void>;

  // ============ 搜索 ============

  /** 搜索会话 */
  searchSessions(query: SearchRequest): Promise<SearchResult>;

  // ============ 加密 ============

  /** 加密 API Key */
  encryptApiKey(apiKey: string): Promise<string>;

  /** 解密 API Key */
  decryptApiKey(encrypted: string): Promise<string>;

  // ============ 设置 ============

  /** 获取设置值 */
  getSetting(key: string): Promise<string | null>;

  /** 设置值 */
  setSetting(key: string, value: string): Promise<void>;
}

/** 会话列表查询选项 */
export interface ListSessionsOptions {
  /** 只获取置顶的会话 */
  pinnedOnly?: boolean;
  /** 按更新时间排序（默认降序） */
  orderBy?: 'updatedAt' | 'createdAt' | 'lastMessageAt';
  /** 排序方向 */
  orderDirection?: 'asc' | 'desc';
  /** 分页限制 */
  limit?: number;
  /** 分页偏移 */
  offset?: number;
}

/** 存储提供者工厂函数 */
export type StorageProviderFactory = () => StorageProvider;