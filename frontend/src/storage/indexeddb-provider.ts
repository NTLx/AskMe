/**
 * IndexedDB 存储提供者实现
 *
 * 使用 Dexie.js 操作 IndexedDB
 * 用于 Web 版本（GitHub Pages）
 */

import Dexie, { Table } from 'dexie';
import type {
  Session,
  SessionListItem,
  Message,
  AgentProfile,
  LLMProvider,
  Tag,
  SearchRequest,
  SearchResult,
  SearchDimension,
} from '../types';
import type { StorageProvider, ListSessionsOptions } from './interface';
import {
  generateMasterKey,
  exportMasterKey,
  importMasterKey,
  encryptApiKey,
  decryptApiKey,
  generateId,
  timestampMs,
} from './web-crypto';

// ============ 数据库 Schema ============

interface SessionTag {
  sessionId: string;
  tagId: string;
}

interface Setting {
  key: string;
  value: string;
}

interface MasterKeyData {
  id: 'masterKey';
  keyData: Uint8Array;
}

class AskMeDatabase extends Dexie {
  sessions!: Table<Session, string>;
  messages!: Table<Message, string>;
  agentProfiles!: Table<AgentProfile, string>;
  llmProviders!: Table<LLMProvider, string>;
  tags!: Table<Tag, string>;
  sessionTags!: Table<SessionTag, [string, string]>;
  settings!: Table<Setting, string>;
  masterKeys!: Table<MasterKeyData, string>;

  constructor() {
    super('AskMe');

    this.version(1).stores({
      sessions: 'id, parentId, agentProfileId, llmProviderId, isPinned, updatedAt, lastMessageAt, createdAt',
      messages: 'id, sessionId, createdAt, [sessionId+createdAt]',
      agentProfiles: 'id, name, isBuiltin, isActive',
      llmProviders: 'id, name, isEnabled, isDefault',
      tags: 'id, name',
      sessionTags: '[sessionId+tagId], sessionId, tagId',
      settings: 'key',
      masterKeys: 'id',
    });
  }
}

// ============ IndexedDB Provider 实现 ============

export class IndexedDBProvider implements StorageProvider {
  private db: AskMeDatabase;
  private masterKey: CryptoKey | null = null;

  constructor() {
    this.db = new AskMeDatabase();
  }

  // ============ 初始化 ============

  /** 初始化 Master Key */
  private async initMasterKey(): Promise<CryptoKey> {
    if (this.masterKey) {
      return this.masterKey;
    }

    // 检查是否已存在
    const stored = await this.db.masterKeys.get('masterKey');

    if (stored) {
      this.masterKey = await importMasterKey(stored.keyData);
      return this.masterKey;
    }

    // 生成新密钥
    const key = await generateMasterKey();
    const keyData = await exportMasterKey(key);

    await this.db.masterKeys.add({
      id: 'masterKey',
      keyData,
    });

    this.masterKey = key;
    return key;
  }

  // ============ 会话操作 ============

  async createSession(session: Session): Promise<string> {
    const id = session.id || generateId();
    const now = timestampMs();

    const newSession: Session = {
      ...session,
      id,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: null,
      messageCount: 0,
      branchCount: 0,
    };

    await this.db.sessions.add(newSession);
    return id;
  }

  async getSession(id: string): Promise<Session | null> {
    const session = await this.db.sessions.get(id);
    if (!session) return null;

    // 加载关联数据
    const agent = await this.getAgentProfile(session.agentProfileId);
    const llm = await this.getLLMProvider(session.llmProviderId);
    const tags = await this.getSessionTags(id);

    return {
      ...session,
      agent: agent || undefined,
      llm: llm || undefined,
      tags,
    };
  }

  async updateSession(session: Session): Promise<void> {
    const now = timestampMs();
    await this.db.sessions.update(session.id, {
      ...session,
      updatedAt: now,
    });
  }

  async deleteSession(id: string): Promise<void> {
    // 删除会话及其关联数据
    await this.db.messages.where('sessionId').equals(id).delete();
    await this.db.sessionTags.where('sessionId').equals(id).delete();
    await this.db.sessions.delete(id);

    // 如果是父会话，更新其 branchCount
    const deletedSession = await this.db.sessions.get(id);
    if (deletedSession?.parentId) {
      await this.db.sessions.update(deletedSession.parentId, {
        branchCount: await this.db.sessions.where('parentId').equals(deletedSession.parentId).count(),
      });
    }
  }

  async listSessions(options?: ListSessionsOptions): Promise<SessionListItem[]> {
    const {
      pinnedOnly = false,
      orderBy = 'updatedAt',
      orderDirection = 'desc',
      limit = 100,
      offset = 0,
    } = options || {};

    let collection = this.db.sessions.toCollection();

    if (pinnedOnly) {
      collection = this.db.sessions.where('isPinned').equals(1);
    }

    // 获取总数（用于分页）
    void await collection.count();

    // 排序
    const sessions = await collection
      .sortBy(orderBy)
      .then((items) => (orderDirection === 'desc' ? items.reverse() : items));

    // 分页
    const paginated = sessions.slice(offset, offset + limit);

    // 转换为 SessionListItem
    const items: SessionListItem[] = [];

    for (const session of paginated) {
      const agent = await this.db.agentProfiles.get(session.agentProfileId);
      const llm = await this.db.llmProviders.get(session.llmProviderId);
      const tags = await this.getSessionTags(session.id);
      const hasChildren = await this.db.sessions.where('parentId').equals(session.id).count() > 0;

      items.push({
        id: session.id,
        title: session.title,
        isPinned: session.isPinned,
        isLocked: session.titleLocked,
        agentName: agent?.name || 'Unknown',
        agentEmoji: agent?.emoji || '',
        llmName: llm?.name || 'Unknown',
        llmIcon: llm?.type || '',
        tags: tags.map((t) => t.name),
        lastActiveAt: session.lastMessageAt || session.updatedAt,
        messageCount: session.messageCount,
        hasParent: !!session.parentId,
        hasChildren,
      });
    }

    return items;
  }

  // ============ 消息操作 ============

  async createMessage(message: Message): Promise<string> {
    const id = message.id || generateId();
    const now = timestampMs();

    const newMessage: Message = {
      ...message,
      id,
      createdAt: now,
      isBranchPoint: false,
    };

    await this.db.messages.add(newMessage);

    // 更新会话
    await this.db.sessions.update(message.sessionId, {
      lastMessageAt: now,
      updatedAt: now,
      messageCount: await this.db.messages.where('sessionId').equals(message.sessionId).count(),
    });

    return id;
  }

  async getMessages(sessionId: string, limit?: number): Promise<Message[]> {
    let messages = await this.db.messages
      .where('sessionId')
      .equals(sessionId)
      .sortBy('createdAt');

    if (limit) {
      messages = messages.slice(-limit);
    }

    return messages;
  }

  async updateMessage(message: Message): Promise<void> {
    await this.db.messages.update(message.id, message);
  }

  // ============ Agent Profile ============

  async getAgentProfile(id: string): Promise<AgentProfile | null> {
    return await this.db.agentProfiles.get(id) || null;
  }

  async listAgentProfiles(): Promise<AgentProfile[]> {
    return await this.db.agentProfiles.toArray();
  }

  async saveAgentProfile(profile: AgentProfile): Promise<void> {
    const now = timestampMs();

    const existing = await this.db.agentProfiles.get(profile.id);

    if (existing) {
      await this.db.agentProfiles.update(profile.id, {
        ...profile,
        updatedAt: now,
      });
    } else {
      await this.db.agentProfiles.add({
        ...profile,
        createdAt: profile.createdAt || now,
        updatedAt: now,
      });
    }
  }

  // ============ LLM Provider ============

  async getLLMProvider(id: string): Promise<LLMProvider | null> {
    const provider = await this.db.llmProviders.get(id);
    if (!provider) return null;

    // 解密 API Key
    if (provider.apiKey) {
      const key = await this.initMasterKey();
      try {
        provider.apiKey = await decryptApiKey(provider.apiKey, key);
      } catch {
        // 解密失败，返回空
        provider.apiKey = undefined;
      }
    }

    return provider;
  }

  async listLLMProviders(): Promise<LLMProvider[]> {
    const providers = await this.db.llmProviders.toArray();

    // 解密所有 API Key
    const key = await this.initMasterKey();
    for (const provider of providers) {
      if (provider.apiKey) {
        try {
          provider.apiKey = await decryptApiKey(provider.apiKey, key);
        } catch {
          provider.apiKey = undefined;
        }
      }
    }

    return providers;
  }

  async saveLLMProvider(provider: LLMProvider): Promise<void> {
    const now = timestampMs();

    // 加密 API Key
    if (provider.apiKey) {
      const key = await this.initMasterKey();
      provider.apiKey = await encryptApiKey(provider.apiKey, key);
    }

    const existing = await this.db.llmProviders.get(provider.id);

    if (existing) {
      await this.db.llmProviders.update(provider.id, {
        ...provider,
        updatedAt: now,
      });
    } else {
      await this.db.llmProviders.add({
        ...provider,
        createdAt: provider.createdAt || now,
        updatedAt: now,
      });
    }
  }

  // ============ 标签 ============

  async getTags(): Promise<Tag[]> {
    const tags = await this.db.tags.toArray();

    // 计算每个标签的会话数
    for (const tag of tags) {
      tag.sessionCount = await this.db.sessionTags.where('tagId').equals(tag.id).count();
    }

    return tags;
  }

  async addTag(tag: Tag): Promise<void> {
    const id = tag.id || generateId();
    await this.db.tags.add({
      ...tag,
      id,
    });
  }

  async linkTag(sessionId: string, tagId: string): Promise<void> {
    await this.db.sessionTags.add({ sessionId, tagId });
  }

  async unlinkTag(sessionId: string, tagId: string): Promise<void> {
    await this.db.sessionTags.delete([sessionId, tagId]);
  }

  private async getSessionTags(sessionId: string): Promise<Tag[]> {
    const links = await this.db.sessionTags.where('sessionId').equals(sessionId).toArray();
    const tags: Tag[] = [];

    for (const link of links) {
      const tag = await this.db.tags.get(link.tagId);
      if (tag) tags.push(tag);
    }

    return tags;
  }

  // ============ 搜索 ============

  async searchSessions(query: SearchRequest): Promise<SearchResult> {
    const { query: searchText, dimensions, limit = 100 } = query;
    const queryLower = searchText.toLowerCase();

    // 获取所有会话
    let sessions = await this.db.sessions.toArray();

    // 过滤
    if (searchText && dimensions.length > 0) {
      // 使用 async 过滤
      const matchResults = await Promise.all(
        sessions.map(async (session) => {
          for (const dim of dimensions) {
            if (await this.matchDimension(session, dim, queryLower)) {
              return true;
            }
          }
          return false;
        })
      );
      sessions = sessions.filter((_, index) => matchResults[index]);
    }

    // 排序（置顶优先，然后按更新时间降序）
    sessions.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return b.updatedAt - a.updatedAt;
    });

    // 分页
    const paginated = sessions.slice(0, limit);

    // 转换为 SessionListItem
    const items: SessionListItem[] = [];

    for (const session of paginated) {
      const agent = await this.db.agentProfiles.get(session.agentProfileId);
      const llm = await this.db.llmProviders.get(session.llmProviderId);
      const tags = await this.getSessionTags(session.id);
      const hasChildren = await this.db.sessions.where('parentId').equals(session.id).count() > 0;

      items.push({
        id: session.id,
        title: session.title,
        isPinned: session.isPinned,
        isLocked: session.titleLocked,
        agentName: agent?.name || 'Unknown',
        agentEmoji: agent?.emoji || '',
        llmName: llm?.name || 'Unknown',
        llmIcon: llm?.type || '',
        tags: tags.map((t) => t.name),
        lastActiveAt: session.lastMessageAt || session.updatedAt,
        messageCount: session.messageCount,
        hasParent: !!session.parentId,
        hasChildren,
      });
    }

    return {
      sessions: items,
      total: sessions.length,
    };
  }

  private async matchDimension(
    session: Session,
    dimension: SearchDimension,
    queryLower: string
  ): Promise<boolean> {
    switch (dimension) {
      case 'name':
        return session.title.toLowerCase().includes(queryLower);

      case 'content':
        const messages = await this.db.messages.where('sessionId').equals(session.id).toArray();
        return messages.some((m) => m.content.toLowerCase().includes(queryLower));

      case 'tag':
        const tags = await this.getSessionTags(session.id);
        return tags.some((t) => t.name.toLowerCase().includes(queryLower));

      case 'agent':
        const agent = await this.db.agentProfiles.get(session.agentProfileId);
        return agent?.name.toLowerCase().includes(queryLower) || false;

      case 'llm':
        const llm = await this.db.llmProviders.get(session.llmProviderId);
        return llm?.name.toLowerCase().includes(queryLower) || false;

      default:
        return false;
    }
  }

  // ============ 加密 ============

  async encryptApiKey(apiKey: string): Promise<string> {
    const key = await this.initMasterKey();
    return encryptApiKey(apiKey, key);
  }

  async decryptApiKey(encrypted: string): Promise<string> {
    const key = await this.initMasterKey();
    return decryptApiKey(encrypted, key);
  }

  // ============ 设置 ============

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.db.settings.get(key);
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.db.settings.put({ key, value });
  }
}

// ============ 导出 ============

/** 创建 IndexedDB Provider */
export function createIndexedDBProvider(): StorageProvider {
  return new IndexedDBProvider();
}