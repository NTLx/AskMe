/**
 * 多维度搜索工具
 * 支持按名称、内容、标签、Agent、LLM 搜索会话
 */

import type { SessionListItem, SearchDimension, SearchRequest, SearchResult } from '../types';

/**
 * 搜索维度配置
 */
export const SEARCH_DIMENSIONS: Record<SearchDimension, {
  label: string;
  prefix: string;
  description: string;
}> = {
  name: { label: '会话名称', prefix: 'name:', description: '搜索会话标题' },
  content: { label: '消息内容', prefix: 'content:', description: '搜索消息正文' },
  tag: { label: '标签', prefix: 'tag:', description: '搜索标签名' },
  agent: { label: 'Agent', prefix: 'agent:', description: '搜索 Agent 名称' },
  llm: { label: 'LLM', prefix: 'llm:', description: '搜索 LLM 提供商' },
};

/**
 * 默认搜索维度（全部）
 */
export const DEFAULT_SEARCH_DIMENSIONS: SearchDimension[] = ['name', 'content', 'tag', 'agent', 'llm'];

/**
 * 解析搜索查询字符串
 * 支持维度限定语法：name:关键词 content:关键词 tag:学习 agent:苏格拉底 llm:claude
 * @param query 搜索查询字符串
 * @returns 解析后的搜索参数
 */
export function parseSearchQuery(query: string): {
  keywords: string[];
  dimensionFilters: Map<SearchDimension, string[]>;
} {
  const keywords: string[] = [];
  const dimensionFilters = new Map<SearchDimension, string[]>();

  if (!query || query.trim() === '') {
    return { keywords, dimensionFilters };
  }

  // 分词
  const tokens = query.trim().split(/\s+/);

  for (const token of tokens) {
    // 检查是否为维度限定
    let isDimensionFilter = false;

    for (const [dimension, config] of Object.entries(SEARCH_DIMENSIONS)) {
      if (token.startsWith(config.prefix)) {
        const value = token.slice(config.prefix.length);
        if (value) {
          const existing = dimensionFilters.get(dimension as SearchDimension) || [];
          existing.push(value.toLowerCase());
          dimensionFilters.set(dimension as SearchDimension, existing);
        }
        isDimensionFilter = true;
        break;
      }
    }

    // 普通关键词
    if (!isDimensionFilter) {
      keywords.push(token.toLowerCase());
    }
  }

  return { keywords, dimensionFilters };
}

/**
 * 检查会话是否匹配搜索条件
 * @param session 会话列表项
 * @param keywords 关键词列表
 * @param dimensionFilters 维度过滤条件
 * @param dimensions 搜索维度
 * @returns 是否匹配
 */
export function matchesSearch(
  session: SessionListItem,
  keywords: string[],
  dimensionFilters: Map<SearchDimension, string[]>,
  dimensions: SearchDimension[]
): boolean {
  // 1. 检查维度限定过滤
  for (const [dimension, values] of dimensionFilters) {
    const matchFound = values.some(value => {
      switch (dimension) {
        case 'name':
          return session.title.toLowerCase().includes(value);
        case 'tag':
          return session.tags.some(tag => tag.toLowerCase().includes(value));
        case 'agent':
          return session.agentName.toLowerCase().includes(value);
        case 'llm':
          return session.llmName.toLowerCase().includes(value);
        case 'content':
          // content 需要在实际搜索时处理，这里无法判断
          return true;
        default:
          return false;
      }
    });

    if (!matchFound) {
      return false;
    }
  }

  // 2. 如果没有关键词，直接返回 true（仅维度过滤）
  if (keywords.length === 0) {
    return true;
  }

  // 3. 检查关键词匹配
  return keywords.some(keyword => {
    return dimensions.some(dimension => {
      switch (dimension) {
        case 'name':
          return session.title.toLowerCase().includes(keyword);
        case 'tag':
          return session.tags.some(tag => tag.toLowerCase().includes(keyword));
        case 'agent':
          return session.agentName.toLowerCase().includes(keyword);
        case 'llm':
          return session.llmName.toLowerCase().includes(keyword);
        case 'content':
          // content 搜索需要额外的数据，这里跳过
          return false;
        default:
          return false;
      }
    });
  });
}

/**
 * 在会话列表中搜索（前端版本，不包含消息内容搜索）
 * @param sessions 会话列表
 * @param request 搜索请求
 * @returns 搜索结果
 */
export function searchSessions(
  sessions: SessionListItem[],
  request: SearchRequest
): SearchResult {
  const { keywords, dimensionFilters } = parseSearchQuery(request.query);
  const dimensions = request.dimensions.length > 0 ? request.dimensions : DEFAULT_SEARCH_DIMENSIONS;

  // 过滤会话
  const matchedSessions = sessions.filter(session =>
    matchesSearch(session, keywords, dimensionFilters, dimensions)
  );

  // 排序：置顶优先，然后按更新时间降序
  matchedSessions.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned ? 1 : -1;
    }
    return b.lastActiveAt - a.lastActiveAt;
  });

  // 分页
  const limit = request.limit || 100;
  const paginatedSessions = matchedSessions.slice(0, limit);

  return {
    sessions: paginatedSessions,
    total: matchedSessions.length,
  };
}

/**
 * 构建搜索查询字符串（从过滤条件反向生成）
 * @param filters 过滤条件
 * @returns 搜索查询字符串
 */
export function buildSearchQuery(filters: {
  keywords?: string[];
  dimensionFilters?: Partial<Record<SearchDimension, string[]>>;
}): string {
  const parts: string[] = [];

  // 维度限定
  if (filters.dimensionFilters) {
    for (const [dimension, values] of Object.entries(filters.dimensionFilters)) {
      if (values && values.length > 0) {
        const prefix = SEARCH_DIMENSIONS[dimension as SearchDimension].prefix;
        parts.push(...values.map(v => `${prefix}${v}`));
      }
    }
  }

  // 普通关键词
  if (filters.keywords && filters.keywords.length > 0) {
    parts.push(...filters.keywords);
  }

  return parts.join(' ');
}

/**
 * 获取搜索提示文本
 * @returns 提示文本
 */
export function getSearchHints(): string[] {
  return [
    '输入关键词搜索',
    '使用 name:关键词 仅搜索名称',
    '使用 tag:标签名 仅搜索标签',
    '使用 agent:名称 仅搜索 Agent',
    '使用 llm:名称 仅搜索 LLM',
    '组合使用：tag:学习 content:rust',
  ];
}

/**
 * 搜索历史记录（用于自动补全）
 */
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

const SEARCH_HISTORY_KEY = 'askme_search_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * 加载搜索历史
 * @returns 搜索历史列表
 */
export function loadSearchHistory(): SearchHistoryItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * 保存搜索历史
 * @param query 搜索查询
 * @param resultCount 结果数量
 */
export function saveSearchHistory(query: string, resultCount: number): void {
  if (!query || query.trim() === '') return;

  const history = loadSearchHistory();

  // 移除重复项
  const filtered = history.filter(item => item.query !== query);

  // 添加新项
  filtered.unshift({
    query,
    timestamp: Date.now(),
    resultCount,
  });

  // 限制数量
  const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // ignore
  }
}

export default {
  SEARCH_DIMENSIONS,
  DEFAULT_SEARCH_DIMENSIONS,
  parseSearchQuery,
  matchesSearch,
  searchSessions,
  buildSearchQuery,
  getSearchHints,
  loadSearchHistory,
  saveSearchHistory,
  clearSearchHistory,
};