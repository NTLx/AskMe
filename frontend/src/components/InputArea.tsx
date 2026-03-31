/**
 * InputArea - 对话输入区域
 * 像素级对齐 UI Reference: stitch_askme_web-dark/4
 *
 * 设计规范:
 * - 底部全宽区域, 非 sticky/fixed, 自然流
 * - 提示文字: "AI will ask you questions to guide your learning journey."
 * - 输入框: surface-container-lowest rounded-full, attachment/mic 图标 + primary 发送按钮
 * - 底部: SHORTCUTS / PARAMETERS 链接 + 版权信息
 * - Ghost Border focus 效果
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
  placeholder = 'Type your answer or ask for a hint...',
}: InputAreaProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (content.trim() && !isStreaming) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = content.trim() && !isStreaming;

  return (
    <div className="bg-surface px-8 pb-4 pt-2">
      {/* AI Hint */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary/40" />
        <p className="text-[11px] text-on-surface-variant tracking-tight font-medium">
          AI will ask you questions to guide your learning journey.
        </p>
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary/40" />
      </div>

      {/* 输入容器 */}
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            'flex items-end gap-2 p-2',
            'bg-surface-container-lowest rounded-2xl',
            'border border-outline-variant/10',
            'transition-all duration-300',
            isFocused && 'ring-2 ring-primary/20 border-primary/20'
          )}
        >
          {/* 附件按钮 */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Attach file"
          >
            <span className="material-symbols-outlined text-lg">attach_file</span>
          </button>

          {/* 语音按钮 */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Voice input"
          >
            <span className="material-symbols-outlined text-lg">mic</span>
          </button>

          {/* 文本输入区 */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isStreaming}
              rows={1}
              className={cn(
                'w-full resize-none px-3 py-2.5',
                'bg-transparent',
                'text-on-surface placeholder:text-on-surface-variant/50',
                'outline-none',
                'font-body text-sm',
                'transition-all duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{
                minHeight: '40px',
                maxHeight: '200px',
              }}
            />
          </div>

          {/* 发送按钮 */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              'flex items-center justify-center flex-shrink-0',
              'w-12 h-12 rounded-full',
              'transition-all duration-300 active:scale-95',
              canSend
                ? 'bg-primary hover:bg-primary-dim text-on-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
          </button>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">keyboard</span>
              Shortcuts
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              Parameters
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant/40">
            Powered by AskMe AI • Academic Engine v2.4
          </p>
        </div>
      </div>
    </div>
  );
}

export default InputArea;
