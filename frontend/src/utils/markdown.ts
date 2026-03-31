/**
 * Markdown 渲染工具
 * 使用 marked 解析 Markdown，DOMPurify 过滤 XSS
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * DOMPurify 配置 - 允许安全的 HTML 标签
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'code', 'pre',
  'ul', 'ol', 'li', 'blockquote', 'a', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hr', 'span', 'div', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'img'
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'];

const FORBID_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'];

const FORBID_ATTR = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur', 'style'];

/**
 * 渲染 Markdown 为安全的 HTML
 * @param content Markdown 内容
 * @returns 安全的 HTML 字符串
 */
export function renderMarkdown(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    // 1. 使用 marked 解析 Markdown
    const rawHtml = marked.parse(content, {
      gfm: true,
      breaks: true,
      pedantic: false,
    }) as string;

    // 2. 使用 DOMPurify 过滤 XSS
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      FORBID_TAGS,
      FORBID_ATTR,
    });

    return safeHtml;
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    return content; // 返回原始内容作为 fallback
  }
}

/**
 * 渲染 Markdown 为安全的 HTML（异步版本）
 * @param content Markdown 内容
 * @returns 安全的 HTML 字符串
 */
export async function renderMarkdownAsync(content: string): Promise<string> {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    // 使用 marked 异步解析
    const rawHtml = await marked.parse(content, {
      gfm: true,
      breaks: true,
      pedantic: false,
    });

    // 使用 DOMPurify 过滤 XSS
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      FORBID_TAGS,
      FORBID_ATTR,
    });

    return safeHtml;
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    return content;
  }
}

/**
 * 提取纯文本内容（去除 Markdown 格式）
 * @param content Markdown 内容
 * @returns 纯文本
 */
export function extractPlainText(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    const html = marked.parse(content, {
      gfm: true,
      breaks: true,
    }) as string;
    // 使用 DOMPurify 清理后提取文本
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return cleanHtml;
  } catch (error) {
    console.error('提取纯文本错误:', error);
    return content;
  }
}

/**
 * 检查内容是否包含 Markdown 格式
 * @param content 内容
 * @returns 是否包含 Markdown
 */
export function hasMarkdownFormat(content: string): boolean {
  if (!content) return false;

  // 简单检测常见的 Markdown 语法
  const markdownPatterns = [
    /#{1,6}\s/, // 标题
    /\*\*.*?\*\*/, // 加粗
    /\*.*?\*/, // 斜体
    /`[^`]+`/, // 行内代码
    /```/, // 代码块
    /\[.*?\]\(.*?\)/, // 链接
    /^[-*+]\s/, // 无序列表
    /^\d+\.\s/, // 有序列表
    /^>\s/, // 引用
  ];

  return markdownPatterns.some(pattern => pattern.test(content));
}

/**
 * 配置链接添加 target="_blank" 和 rel="noopener noreferrer"
 */
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'href' && node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export default {
  renderMarkdown,
  renderMarkdownAsync,
  extractPlainText,
  hasMarkdownFormat,
};