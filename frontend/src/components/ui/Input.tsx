import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Input 组件接口
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 错误状态 */
  error?: boolean;
  /** 图标前缀 */
  startIcon?: React.ReactNode;
  /** 图标后缀 */
  endIcon?: React.ReactNode;
}

/**
 * Input 组件
 *
 * 基础文本输入框，遵循新设计规范：
 * - pill 形状 (rounded-full / radius-full)
 * - 无边框设计 (No-Line 规则)
 * - Focus 时显示 ghost border + glow 效果
 * - 背景使用 surface-container-high
 */
export function Input({
  className,
  type = 'text',
  error = false,
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {startIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          // 基础样式：pill 形状、无边框
          'w-full px-4 py-2.5 text-sm rounded-full',
          // 默认背景：surface-container-high
          'bg-surface-container-high',
          'border-0',
          // 文字颜色
          'text-on-surface',
          // Placeholder 颜色
          'placeholder:text-on-surface-variant/50',
          // Focus 样式：ghost border + glow
          'focus:outline-none',
          'focus:bg-surface-container-lowest',
          'focus:border focus:border-primary/20',
          'focus:shadow-[0_0_4px_var(--primary)]',
          // 过渡动画：200ms ease-out
          'transition-all duration-200 ease-out',
          // 禁用样式
          'disabled:cursor-not-allowed disabled:opacity-50',
          'disabled:bg-surface-container-low',
          // 错误状态
          error && 'border border-red-500/50 focus:border-red-500 focus:shadow-[0_0_4px_rgba(239,68,68,0.5)]',
          // 图标偏移
          startIcon && 'pl-11',
          endIcon && 'pr-11',
          className
        )}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {endIcon}
        </div>
      )}
    </div>
  );
}