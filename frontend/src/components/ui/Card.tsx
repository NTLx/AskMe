import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Card 组件变体定义
 * 基于 Material Design 3 表面层级系统
 */
const cardVariants = cva(
  // 基础样式
  'rounded-xl transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-surface-container',
        elevated: 'bg-surface-container-high shadow-md',
        filled: 'bg-surface-container-highest',
        interactive: 'bg-surface-container cursor-pointer hover:bg-surface-bright',
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
    VariantProps<typeof cardVariants> {}

/**
 * Card 容器组件
 *
 * 支持 4 种变体：
 * - default: bg-surface-container (默认表面层)
 * - elevated: bg-surface-container-high (带阴影的提升表面)
 * - filled: bg-surface-container-highest (最高表面层)
 * - interactive: 可交互，hover 时变亮
 */
export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, className }))}
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