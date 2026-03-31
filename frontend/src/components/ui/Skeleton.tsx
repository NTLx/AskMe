import { cn } from '../../utils/cn';

/**
 * Skeleton 组件接口
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否显示动画 */
  animate?: boolean;
}

/**
 * Skeleton 组件
 *
 * 用于加载状态的占位符
 */
export function Skeleton({
  className,
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gray-200 dark:bg-gray-700',
        animate && 'animate-pulse',
        className
      )}
      {...props}
    />
  );
}