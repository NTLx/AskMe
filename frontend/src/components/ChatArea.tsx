/**
 * 对话区域 - 消息展示（手机版设计）
 * 采用"Digital Nocturne"深色主题设计
 * - AI 消息：无容器 + tertiary accent bar（左侧 2px 竖线）
 * - 用户消息：primary 背景 + asymmetric 圆角 (rounded-tr-none)
 * - 手机版优化布局
 * - 过渡动画 300ms cubic-bezier
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
          {/* System Annotation (Editorial Design) */}
          <div className="relative pl-12 mb-8">
            <div className="absolute left-0 top-0 text-tertiary">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <p className="text-xs italic text-tertiary mb-2">Academic context initialized: Ready to explore</p>
            <div className="h-px w-24 bg-tertiary/20"></div>
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
            {/* AI 消息 - 无容器 + tertiary accent bar */}
            {message.role === 'assistant' && (
              <div className="ai-message w-full max-w-[85%]">
                {/* 消息头部 */}
                <div className="flex items-center gap-3 mb-2 px-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-sm">forum</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-widest">
                    {agent?.name || 'AskMe Assistant'}
                  </span>
                </div>

                {/* 消息内容 - 左侧 tertiary accent bar */}
                <div className="relative pl-3">
                  {/* 左侧 2px tertiary 竖线 */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-tertiary" />

                  <div className="bg-surface-container text-on-surface p-5 rounded-2xl rounded-tl-none shadow-sm transition-all duration-[300ms] ease-spring">
                    {message.isStreaming ? (
                      <div className="text-base leading-relaxed">
                        {message.content}
                        <span className="streaming-cursor ml-1 opacity-70 animate-pulse">|</span>
                      </div>
                    ) : (
                      <p className="text-base leading-relaxed">
                        {message.content.split('\n').map((line, idx) => (
                          <span key={idx}>
                            {line}
                            {idx < message.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>

                  {/* 时间戳 */}
                  {!message.isStreaming && (
                    <span className="text-[10px] text-on-surface-variant mt-2 px-2">
                      Sent via {agent?.name || 'AskMe'} • {formatRelativeTime(message.createdAt)}
                    </span>
                  )}
                </div>

                {/* 消息操作 - 手机版简化 */}
                {!message.isStreaming && !message.isError && (
                  <div className="message-actions flex items-center gap-2 mt-3 pl-3">
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-[300ms] ease-spring"
                      onClick={() => onCopyMessage(message.content)}
                      title="复制"
                    >
                      复制
                    </button>
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-[300ms] ease-spring"
                      onClick={() => onReact(message.id, 'like')}
                      title="赞同"
                    >
                      👍
                    </button>
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-[300ms] ease-spring"
                      onClick={() => onReact(message.id, 'dislike')}
                      title="反对"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 用户消息 - primary 背景 + asymmetric 圆角 */}
            {message.role === 'user' && (
              <div className="user-message flex flex-col items-end max-w-[85%]">
                {/* 消息头部 */}
                <div className="flex items-center gap-3 mb-2 px-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    You
                  </span>
                </div>

                {/* 消息内容 - primary 背景 + rounded-tr-none */}
                <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10 transition-all duration-[300ms] ease-spring">
                  <p className="text-base leading-relaxed">
                    {message.content.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < message.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>

                {/* 时间戳 */}
                <span className="text-[10px] text-on-surface-variant mt-2 px-2">
                  Read • {formatTime(message.createdAt)}
                </span>
              </div>
            )}

            {/* 错误状态 */}
            {message.isError && (
              <div className="w-full mt-2 flex items-center gap-2 text-xs text-error bg-error/10 rounded-lg px-3 py-2 pl-3">
                <span className="text-error">⚠️</span>
                <span className="text-error">{message.error || '发送失败'}</span>
              </div>
            )}
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-center my-4">
            <div className="bg-surface-container-low px-6 py-3 rounded-full border border-outline-variant/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-sm animate-pulse">tips_and_updates</span>
              <p className="text-xs text-on-surface-variant font-medium">
                {agent?.name || 'Socrates'} is analyzing your response for accuracy...
              </p>
            </div>
          </div>
        )}

        {/* 加载状态（无消息时） */}
        {isLoading && messages.length === 0 && (
          <div className="loading-indicator flex items-center gap-3 justify-center py-8">
            <div className="animate-spin w-5 h-5 border-2 border-tertiary border-t-transparent rounded-full" />
            <span className="text-sm text-on-surface-variant">AI 正在思考...</span>
          </div>
        )}

        {/* 底部间距 */}
        <div className="h-32"></div>
      </div>
    </div>
  );
}

export default ChatArea;
