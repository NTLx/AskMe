import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Button 组件变体定义
 * 基于 Material Design 3 + 新设计规范
 */
const buttonVariants = cva(
  // 基础样式：300ms cubic-bezier 过渡
  'inline-flex items-center justify-center whitespace-nowrap font-body transition-all duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // 变体样式
      variant: {
        /**
         * Primary - 线性渐变
         * background: linear-gradient(135deg, var(--primary), var(--primary-dim))
         * border-radius: 8px
         * hover: scale(1.02)
         * active: scale(0.98)
         */
        primary:
          'bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-lg font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]',
        /**
         * Secondary - ghost 样式
         * background: var(--secondary-container)
         * border: none
         */
        secondary:
          'bg-secondary-container text-on-secondary-container rounded-lg font-semibold hover:bg-secondary-container/80 active:scale-[0.98]',
        /**
         * Tertiary - 纯文本
         * background: transparent
         * border: none
         */
        tertiary:
          'bg-transparent text-primary rounded-lg font-semibold hover:bg-primary/10 active:scale-[0.98]',
        /**
         * Ghost 按钮 - 无背景，hover 时有背景
         */
        ghost:
          'bg-transparent text-on-surface rounded-lg hover:bg-surface-container-high active:bg-surface-container-highest',
        /**
         * Outline 按钮 - ghost border
         */
        outline:
          'bg-transparent text-on-surface rounded-lg border border-outline-variant/20 hover:bg-surface-container-high hover:border-primary/20',
        /**
         * 危险按钮
         */
        destructive:
          'bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 active:scale-[0.98]',
      },
      // 尺寸：padding 为 1rem 水平
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-4 text-base', // 1rem horizontal padding
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Button 组件接口
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 使用 Slot 作为子元素渲染 */
  asChild?: boolean;
}

/**
 * Button 组件 - 符合新设计规范
 *
 * 支持 6 种变体:
 * - primary: 线性渐变 + scale hover/active
 * - secondary: secondary-container 背景
 * - tertiary: 纯文本透明背景
 * - ghost: hover 时显示背景
 * - outline: ghost border
 * - destructive: 危险操作
 *
 * 支持 5 种尺寸 (sm, md, lg, icon, icon-sm)
 */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// 导出变体定义供其他组件使用
export { buttonVariants };