// ============ 核心类型 ============

export type ScenarioType = 'problem_solving' | 'learning' | 'deep_chat' | 'inspiration';

export type MessageRole = 'user' | 'assistant' | 'system';

// ============ 会话 ============

export interface Session {
  id: string;
  parentId: string | null;
  title: string;
  titleLocked: boolean;
  agentProfileId: string;
  llmProviderId: string;
  scenarioType: ScenarioType | null;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  lastMessageAt: number | null;
  messageCount: number;
  branchCount: number;

  // 关联数据（前端扩展）
  agent?: AgentProfile;
  llm?: LLMProvider;
  tags?: Tag[];
  messages?: Message[];
  children?: Session[];
}

export interface SessionListItem {
  id: string;
  title: string;
  isPinned: boolean;
  isLocked: boolean;
  agentName: string;
  agentEmoji: string;
  llmName: string;
  llmIcon: string;
  branchLabel?: string;
  tags: string[];
  lastActiveAt: number;
  messageCount: number;
  hasParent: boolean;
  hasChildren: boolean;
}

// ============ 消息 ============

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  contentHtml?: string;
  tokenCount?: number;
  createdAt: number;

  // 分支相关
  isBranchPoint: boolean;
  branchPointLabel?: string;

  // 前端扩展
  isStreaming?: boolean;
  isError?: boolean;
  error?: string;
}

// ============ Agent Profile ============

export interface AgentProfile {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  isBuiltin: boolean;
  isActive: boolean;

  // 配置文件内容
  agentsMd?: string;
  soulMd?: string;
  identityMd?: string;
  userMd?: string;
  toolsMd?: string;

  createdAt: number;
  updatedAt: number;
}

// ============ LLM Provider ============

export interface LLMProvider {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl?: string;
  apiKey?: string;
  isEnabled: boolean;
  isDefault: boolean;
  config: LLMProviderConfig;
  createdAt: number;
  updatedAt: number;
}

export type LLMProviderType = 'openai_compatible' | 'anthropic' | 'ollama' | 'custom';

export interface LLMProviderConfig {
  models?: string[];
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
  [key: string]: unknown;
}

// ============ 标签 ============

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  sessionCount?: number;
  createdAt?: number;
  updatedAt?: number;
}

// ============ 设置 ============

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  autoGenerateTitle: boolean;
  preserveInputDraft: boolean;
  defaultSearchDimensions: SearchDimension[];
  exportPath?: string;
  defaultAgentProfileId?: string;
  defaultLLMProviderId?: string;
}

export type SearchDimension = 'name' | 'content' | 'tag' | 'agent' | 'llm';

// ============ 分支元数据 ============

export interface BranchMetadata {
  sessionId: string;
  rootSessionId: string;
  depth: number;
  path: string;
}

// ============ 导出类型 ============

export interface ExportOptions {
  format: 'markdown';
  includeBranches: boolean;
  includeMetadata: boolean;
  sessions: string[];
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

// ============ 搜索 ============

export interface SearchRequest {
  query: string;
  dimensions: SearchDimension[];
  limit?: number;
}

export interface SearchResult {
  sessions: SessionListItem[];
  total: number;
}