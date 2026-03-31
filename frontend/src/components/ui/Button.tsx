import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Button 组件变体定义
 * 基于 Material Design 3 Tonal 配色系统
 */
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center whitespace-nowrap font-body transition-all duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // 变体样式
      variant: {
        // 主要按钮 - primary-container 背景
        primary:
          'bg-primary-container text-on-primary-container rounded-full font-semibold hover:scale-[1.02] active:scale-[0.95]',
        // 次要按钮 - ghost 样式
        secondary:
          'bg-surface-container text-on-surface rounded-full font-semibold hover:bg-surface-bright',
        // Ghost 按钮 - 无背景
        ghost:
          'bg-transparent text-on-surface rounded-full hover:bg-surface-bright',
        // Outline 按钮 - ghost border
        outline:
          'bg-transparent text-on-surface rounded-full border border-outline-variant/20 hover:bg-surface-bright',
        // 危险按钮
        destructive:
          'bg-red-500/20 text-red-400 rounded-full font-semibold hover:bg-red-500/30',
      },
      // 尺寸
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
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
 * Button 组件 - 符合 Material 3 Tonal 设计规范
 *
 * 支持 5 种变体 (primary, secondary, ghost, outline, destructive)
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