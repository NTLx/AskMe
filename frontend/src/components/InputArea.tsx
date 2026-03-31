/**
 * 输入区域 - 用户输入回答或问题（手机版设计）
 * 采用"Digital Nocturne"深色主题设计
 * - 浮动底部输入框
 * - primary-container 发送按钮
 * - 聚焦时光晕效果
 * - 适配底部导航栏安全区域
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  isStreaming?: boolean;
  placeholder?: string;
}

export function InputArea({
  onSendMessage,
  isStreaming = false,
  placeholder = '输入你的回答或问题...',
}: InputAreaProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  // 发送消息
  const handleSend = () => {
    if (content.trim() && !isStreaming) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = content.trim() && !isStreaming;

  return (
    <div className="sticky bottom-[64px] left-0 right-0 z-30 bg-gradient-to-t from-surface via-surface to-transparent pb-4 safe-area-bottom">
      {/* 输入容器 */}
      <div className="max-w-lg mx-auto px-4">
        <div
          className={cn(
            'flex items-end gap-2 p-2 rounded-2xl',
            'bg-surface-container-lowest',
            'shadow-lg',
            'transition-all duration-200'
          )}
        >
          {/* 文本输入区 */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isStreaming}
              rows={1}
              className={cn(
                'w-full resize-none px-3 py-2.5 rounded-xl',
                'bg-transparent',
                'text-on-surface placeholder:text-on-surface-variant/60',
                'outline-none',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-primary/20',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{
                minHeight: '40px',
                maxHeight: '200px',
              }}
            />
          </div>

          {/* 发送按钮 - pill 形状 */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              'flex items-center justify-center flex-shrink-0',
              'h-10 w-10 rounded-full',
              'transition-all duration-200',
              canSend
                ? 'bg-primary-container text-on-primary hover:bg-primary-fixed active:scale-95'
                : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
            )}
            aria-label="发送消息"
          >
            <span className="text-lg font-semibold">+</span>
          </button>
        </div>

        {/* 底部提示 */}
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
            <span className="text-sm">💡</span>
            <span>AI 会向你提问</span>
          </div>
          <span className="text-xs text-on-surface-variant/40">
            Enter 发送
          </span>
        </div>
      </div>
    </div>
  );
}

export default InputArea;
