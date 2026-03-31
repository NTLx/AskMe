import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Textarea 组件接口
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 错误状态 */
  error?: boolean;
  /** 自动调整高度 */
  autoResize?: boolean;
  /** 最大高度（配合 autoResize） */
  maxHeight?: number;
}

/**
 * Textarea 组件
 *
 * 支持自动调整高度
 */
export function Textarea({
  className,
  error = false,
  autoResize = false,
  maxHeight = 200,
  onChange,
  ...props
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
    onChange?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        // 基础样式
        'w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
        // Focus 样式
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        // 禁用样式
        'disabled:cursor-not-allowed disabled:opacity-50',
        // 错误状态
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-200 dark:border-gray-700',
        // 自动调整高度
        autoResize && 'resize-none overflow-y-auto',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}