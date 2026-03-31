import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Badge 组件变体定义
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        destructive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        outline: 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Badge 组件接口
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge 组件
 *
 * 用于标签、状态显示等
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// 导出变体定义
export { badgeVariants };