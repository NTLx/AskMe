import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Card 组件变体定义
 * 基于 Material Design 3 表面层级系统 + 新设计规范
 */
const cardVariants = cva(
  // 基础样式：300ms cubic-bezier 过渡
  'rounded-xl transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        /**
         * default: 标准卡片
         * - background: surface-container-low
         * - hover: background 变化到 surface-container-highest (tonal，无位移)
         */
        default: 'bg-surface-container-low hover:bg-surface-container-highest',
        /**
         * elevated: 带阴影的提升表面
         * - background: surface-container-high + shadow-md
         */
        elevated: 'bg-surface-container-high shadow-md hover:bg-surface-container-highest hover:shadow-lg',
        /**
         * filled: 最高表面层
         */
        filled: 'bg-surface-container-highest',
        /**
         * interactive: 可交互卡片
         * - cursor: pointer
         * - hover: tonal 背景变化
         */
        interactive: 'bg-surface-container-low cursor-pointer hover:bg-surface-container-highest',
        /**
         * active: 激活状态
         * - border: 1px solid primary (opacity 0.2)
         * - ring: 0 0 0 2px primary (光晕效果)
         */
        active: 'bg-surface-container-low border border-primary/20 ring-2 ring-primary/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Card 组件接口
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** 激活状态 */
  active?: boolean;
}

/**
 * Card 容器组件
 *
 * 支持 5 种变体：
 * - default: bg-surface-container-low，hover 时 tonal 变化
 * - elevated: bg-surface-container-high + shadow-md
 * - filled: bg-surface-container-highest
 * - interactive: 可交互，hover 时 tonal 变化
 * - active: 激活状态，带 primary border + ring
 */
export function Card({ className, variant, active, ...props }: CardProps) {
  // 如果传入 active prop，自动使用 active variant
  const actualVariant = active ? 'active' : variant;
  return (
    <div
      className={cn(cardVariants({ variant: actualVariant, className }))}
      {...props}
    />
  );
}

/**
 * Card Header 组件
 * 用于放置标题和描述
 */
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
}

/**
 * Card Title 组件
 * 使用 Manrope 字体
 */
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-lg font-semibold leading-none tracking-tight text-on-surface', className)}
      {...props}
    />
  );
}

/**
 * Card Description 组件
 * 用于显示卡片描述文字
 */
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-on-surface-variant', className)}
      {...props}
    />
  );
}

/**
 * Card Content 组件
 * 用于显示卡片主要内容
 */
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

/**
 * Card Footer 组件
 * 用于显示卡片底部内容（如操作按钮）
 */
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
}

// 导出变体定义供其他组件使用
export { cardVariants };