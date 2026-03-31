/**
 * 会话导出工具
 * 将会话导出为 Markdown 格式，支持分支树
 */

import type { Session, Message } from '../types';

/**
 * 导出配置选项
 */
export interface ExportConfig {
  includeMetadata: boolean;
  includeBranches: boolean;
  dateFormat: string;
}

const DEFAULT_CONFIG: ExportConfig = {
  includeMetadata: true,
  includeBranches: true,
  dateFormat: 'YYYY-MM-DD HH:mm',
};

/**
 * 格式化时间戳
 * @param timestamp Unix 时间戳 (ms)
 * @param format 格式字符串
 * @returns 格式化的时间字符串
 */
function formatTimestamp(timestamp: number, format: string = DEFAULT_CONFIG.dateFormat): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

/**
 * 生成单个会话的 Markdown 内容
 * @param session 会话对象
 * @param messages 消息列表
 * @param config 导出配置
 * @param depth 分支深度（用于标题层级）
 * @returns Markdown 字符串
 */
function generateSessionMarkdown(
  session: Session,
  messages: Message[],
  config: ExportConfig,
  depth: number = 0
): string {
  const lines: string[] = [];
  const headingPrefix = '#'.repeat(Math.min(depth + 2, 6)); // 最大 h6

  // 分支标记
  const branchMarker = session.parentId ? '🌿 ' : '';

  // 标题
  lines.push(`${headingPrefix} ${branchMarker}${session.title}`);
  lines.push('');

  // 元数据
  if (config.includeMetadata) {
    const agent = session.agent;
    const llm = session.llm;

    if (agent) {
      lines.push(`**Agent:** ${agent.emoji || '🤖'} ${agent.name}`);
    }

    if (llm) {
      lines.push(`**LLM:** ${llm.name}`);
    }

    lines.push(`**时间:** ${formatTimestamp(session.createdAt, config.dateFormat)}`);

    if (session.tags && session.tags.length > 0) {
      lines.push(`**标签:** ${session.tags.map(t => `#${t.name}`).join(' ')}`);
    }

    lines.push('');
  }

  // 消息内容
  for (const msg of messages) {
    if (msg.role === 'user') {
      lines.push('### 👤 你');
      lines.push('');
      lines.push(msg.content);
      lines.push('');
    } else if (msg.role === 'assistant') {
      lines.push('### 🤔 AskMe');
      lines.push('');
      lines.push(msg.content);
      lines.push('');
    } else if (msg.role === 'system') {
      // 系统消息可选择是否导出
      lines.push('### 📋 System');
      lines.push('');
      lines.push(msg.content);
      lines.push('');
    }

    // 分支点标记
    if (msg.isBranchPoint) {
      lines.push(`> 🌿 分支点${msg.branchPointLabel ? `: ${msg.branchPointLabel}` : ''}`);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * 导出单个会话为 Markdown
 * @param session 会话对象
 * @param messages 消息列表
 * @param config 导出配置
 * @returns Markdown 字符串
 */
export function exportSessionToMarkdown(
  session: Session,
  messages: Message[],
  config: Partial<ExportConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lines: string[] = [];

  // 文档头部
  lines.push('# AskMe 会话导出');
  lines.push('');
  lines.push(`导出时间：${formatTimestamp(Date.now(), finalConfig.dateFormat)}`);
  lines.push('');

  // 会话内容
  lines.push(generateSessionMarkdown(session, messages, finalConfig));

  return lines.join('\n');
}

/**
 * 导出多个会话（包含分支树）为 Markdown
 * @param sessions 会话列表（包含关联的 messages 和 children）
 * @param config 导出配置
 * @returns Markdown 字符串
 */
export function exportSessionsWithBranches(
  sessions: Session[],
  config: Partial<ExportConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lines: string[] = [];

  // 文档头部
  lines.push('# AskMe 会话导出');
  lines.push('');
  lines.push(`导出时间：${formatTimestamp(Date.now(), finalConfig.dateFormat)}`);
  lines.push('');

  // 递归导出会话和分支
  const exportSessionRecursive = (session: Session, depth: number = 0) => {
    // 导出当前会话
    if (session.messages && session.messages.length > 0) {
      lines.push(generateSessionMarkdown(session, session.messages, finalConfig, depth));
    }

    // 递归导出子分支
    if (finalConfig.includeBranches && session.children && session.children.length > 0) {
      for (const child of session.children) {
        exportSessionRecursive(child, depth + 1);
      }
    }
  };

  // 导出所有顶级会话
  for (const session of sessions) {
    exportSessionRecursive(session);
  }

  return lines.join('\n');
}

/**
 * 生成会话树的可视化 Markdown（仅结构，不含消息）
 * @param sessions 顶级会话列表
 * @param config 导出配置
 * @returns Markdown 字符串
 */
export function exportSessionTree(
  sessions: Session[],
  config: Partial<ExportConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const lines: string[] = [];

  lines.push('# AskMe 会话树');
  lines.push('');
  lines.push(`导出时间：${formatTimestamp(Date.now(), finalConfig.dateFormat)}`);
  lines.push('');

  const renderTreeNode = (session: Session, indent: string = '') => {
    const agent = session.agent;
    const llm = session.llm;
    const branchIcon = session.parentId ? '🌿' : '📌';
    const pinIcon = session.isPinned ? '⭐' : '';

    lines.push(`${indent}${branchIcon} ${pinIcon}${session.title}`);
    if (finalConfig.includeMetadata) {
      const meta = [];
      if (agent) meta.push(`${agent.emoji || ''}${agent.name}`);
      if (llm) meta.push(llm.name);
      lines.push(`${indent}   └─ ${meta.join(' | ')}`);
    }

    // 子分支
    if (session.children && session.children.length > 0) {
      for (const child of session.children) {
        renderTreeNode(child, indent + '   ');
      }
    }
  };

  for (const session of sessions) {
    renderTreeNode(session);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 触发浏览器下载 Markdown 文件
 * @param content Markdown 内容
 * @param filename 文件名
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成导出文件名
 * @param session 会话对象
 * @returns 文件名
 */
export function generateExportFilename(session: Session): string {
  const safeTitle = session.title
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 移除特殊字符，保留中文
    .replace(/\s+/g, '_')
    .slice(0, 50);

  const dateStr = formatTimestamp(session.createdAt, 'YYYY-MM-DD');
  return `AskMe_${safeTitle}_${dateStr}.md`;
}

export default {
  exportSessionToMarkdown,
  exportSessionsWithBranches,
  exportSessionTree,
  downloadMarkdown,
  generateExportFilename,
};