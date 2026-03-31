/**
 * 对话区域 - 消息展示（手机版设计）
 * 采用"Digital Nocturne"深色主题设计
 * - AI 消息：无容器 + primary accent bar（左侧 4px 竖线）
 * - 用户消息：primary-container capsule 形式
 * - 手机版优化布局
 */

import React from 'react';
import { Message, AgentProfile } from '../types';
import { cn } from '../utils/cn';

interface ChatAreaProps {
  messages: Message[];
  agent: AgentProfile | null;
  isLoading?: boolean;
  onCopyMessage: (content: string) => void;
  onReact: (messageId: string, reaction: 'like' | 'dislike') => void;
}

export function ChatArea({
  messages,
  agent,
  isLoading,
  onCopyMessage,
  onReact,
}: ChatAreaProps) {
  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 格式化相对时间
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return formatTime(timestamp);
  };

  // 滚动到底部
  React.useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-area flex-1 flex flex-col overflow-hidden bg-surface">
      {/* 空状态 */}
      {messages.length === 0 && !isLoading && (
        <div className="chat-empty flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-3xl bg-primary-container/20 flex items-center justify-center mb-6">
            <span className="text-4xl opacity-60">?</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-on-surface mb-2">
            AskMe 正在等待
          </h3>
          <p className="text-sm text-on-surface-variant max-w-[280px] leading-relaxed">
            输入你的第一个回答，让 AI 开始向你提问
          </p>
        </div>
      )}

      {/* 消息列表 */}
      <div className="chat-messages flex-1 overflow-y-auto px-4 py-4 space-y-4 with-bottom-nav">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'message animate-message-enter flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {/* AI 消息 - 无容器 + primary accent bar */}
            {message.role === 'assistant' && (
              <div className="ai-message w-full flex gap-3">
                {/* 左侧 primary accent bar */}
                <div className="w-1 rounded-full bg-primary-container self-stretch flex-shrink-0" />

                {/* 消息内容区域 */}
                <div className="flex-1 min-w-0">
                  {/* 消息头部 */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-lg" aria-hidden>
                      {agent?.emoji || '?'}
                    </span>
                    <span className="font-display text-sm font-semibold text-on-surface">
                      {agent?.name || 'AskMe'}
                    </span>
                    <span className="text-xs text-on-surface-variant/60">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>

                  {/* 消息内容 */}
                  <div className="message-content text-sm leading-relaxed text-on-surface">
                    {message.isStreaming ? (
                      <div className="inline">
                        {message.content}
                        <span className="streaming-cursor ml-1 opacity-70">|</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {message.content.split('\n').map((line, idx) => (
                          <p key={idx} className="mb-2 last:mb-0">{line || <br />}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 消息操作 - 手机版简化 */}
                  {!message.isStreaming && (
                    <div className="message-actions flex items-center gap-2 mt-3">
                      <button
                        className="action-btn text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                        onClick={() => onCopyMessage(message.content)}
                        title="复制"
                      >
                        复制
                      </button>
                      <button
                        className="action-btn text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                        onClick={() => onReact(message.id, 'like')}
                        title="赞同"
                      >
                        👍
                      </button>
                      <button
                        className="action-btn text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                        onClick={() => onReact(message.id, 'dislike')}
                        title="反对"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 用户消息 - capsule 形式 */}
            {message.role === 'user' && (
              <div className="user-message flex flex-col items-end gap-1 max-w-[85%]">
                {/* 消息头部 */}
                <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                  <span>You</span>
                  <span>{formatTime(message.createdAt)}</span>
                </div>

                {/* 消息内容 - capsule */}
                <div className="message-content bg-primary-container text-on-primary rounded-2xl px-4 py-2.5 text-sm leading-relaxed">
                  {message.content.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* 错误状态 */}
            {message.isError && (
              <div className="w-full mt-2 flex items-center gap-2 text-xs text-error-container bg-error-container/20 rounded-lg px-3 py-2">
                <span className="text-error">⚠️</span>
                <span className="text-error">{message.error || '发送失败'}</span>
              </div>
            )}
          </div>
        ))}

        {/* 加载状态 */}
        {isLoading && messages.length === 0 && (
          <div className="loading-indicator flex items-center gap-3 justify-center py-8">
            <div className="animate-spin w-5 h-5 border-2 border-primary-container border-t-transparent rounded-full" />
            <span className="text-sm text-on-surface-variant">AI 正在思考...</span>
          </div>
        )}

        {/* AI 思考中状态（有消息时） */}
        {isLoading && messages.length > 0 && (
          <div className="message flex gap-3">
            <div className="w-1 rounded-full bg-primary-container self-stretch flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent?.emoji || '?'}</span>
                <span className="font-display text-sm font-semibold text-on-surface">
                  {agent?.name || 'AskMe'}
                </span>
              </div>
              <div className="flex items-center gap-1 py-3">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatArea;
