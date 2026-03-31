/**
 * ChatArea - 对话消息区域
 * 像素级对齐 UI Reference: stitch_askme_web-dark/4
 *
 * 设计规范:
 * - AI 消息: forum 图标 + "ASKME CURATOR" label + surface-container 容器 + 左侧 tertiary accent bar
 * - 用户消息: "YOU" label + primary 背景 capsule + rounded-tr-none
 * - 系统消息: ✨ annotation 样式 (居中)
 * - AI Thinking: 居中 pill 动画
 * - 无边框设计，300ms cubic-bezier 过渡
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
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
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
          {/* System Annotation */}
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className="text-sm italic text-tertiary">
              Academic context initialized: Ready to explore
            </p>
          </div>
          <h3 className="font-display text-2xl font-bold text-on-surface mb-3">
            Start your inquiry
          </h3>
          <p className="text-on-surface-variant max-w-md leading-relaxed">
            Type your first response or question. The AI will ask you thoughtful questions to guide your intellectual journey.
          </p>
        </div>
      )}

      {/* 消息列表 */}
      <div className="chat-messages flex-1 overflow-y-auto px-8 py-6 space-y-8">
        {/* System annotation at start of conversation */}
        {messages.length > 0 && (
          <div className="flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className="text-sm italic text-tertiary">
              Academic context initialized: Memory Safety focus
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'animate-message-enter',
              message.role === 'user' ? 'flex flex-col items-end' : ''
            )}
          >
            {/* AI 消息 */}
            {message.role === 'assistant' && (
              <div className="ai-message w-full max-w-[75%]">
                {/* 消息头部 - 图标 + 名称 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary text-sm">forum</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-widest">
                    AskMe Curator
                  </span>
                </div>

                {/* 消息内容 - 左侧 tertiary accent bar + 容器 */}
                <div className="relative pl-3">
                  {/* 2px tertiary accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-tertiary" />

                  <div className="bg-surface-container text-on-surface p-5 rounded-2xl rounded-tl-none transition-all duration-300">
                    {message.isStreaming ? (
                      <div className="text-base leading-relaxed">
                        {message.content}
                        <span className="inline-block w-0.5 h-5 bg-tertiary ml-1 animate-pulse" />
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
                    <p className="text-[10px] text-on-surface-variant mt-2 px-1 uppercase tracking-wider">
                      Sent via {agent?.name || 'Socrates Agent'} • {formatTime(message.createdAt)}
                    </p>
                  )}
                </div>

                {/* 消息操作 */}
                {!message.isStreaming && !message.isError && (
                  <div className="message-actions flex items-center gap-2 mt-3 pl-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200"
                      onClick={() => onCopyMessage(message.content)}
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200"
                      onClick={() => onReact(message.id, 'like')}
                    >
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                    </button>
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200"
                      onClick={() => onReact(message.id, 'dislike')}
                    >
                      <span className="material-symbols-outlined text-sm">thumb_down</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 用户消息 */}
            {message.role === 'user' && (
              <div className="user-message flex flex-col items-end max-w-[65%]">
                {/* 消息头部 */}
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 pr-1">
                  You
                </p>

                {/* 消息内容 - primary 背景 capsule */}
                <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10 transition-all duration-300">
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
                <p className="text-[10px] text-on-surface-variant mt-2 pr-1 uppercase tracking-wider">
                  Sent • {formatTime(message.createdAt)}
                </p>
              </div>
            )}

            {/* 错误状态 */}
            {message.isError && (
              <div className="mt-2 flex items-center gap-2 text-xs bg-surface-container rounded-lg px-3 py-2 text-tertiary">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{message.error || '发送失败'}</span>
              </div>
            )}
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-center my-4">
            <div className="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-sm animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                tips_and_updates
              </span>
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
        <div className="h-8" />
      </div>
    </div>
  );
}

export default ChatArea;
