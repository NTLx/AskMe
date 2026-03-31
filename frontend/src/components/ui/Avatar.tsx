import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Avatar 组件接口
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 图片 URL */
  src?: string;
  /** 备用文本 */
  alt?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** Emoji 文本（用于 Agent 显示） */
  emoji?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-xl',
};

/**
 * Avatar 组件
 *
 * 支持图片、Emoji 或默认头像
 */
export function Avatar({
  className,
  src,
  alt,
  size = 'md',
  emoji,
  children,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // 获取显示内容
  const getContent = () => {
    // Emoji 优先
    if (emoji) {
      return <span className="text-inherit">{emoji}</span>;
    }

    // 图片
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      );
    }

    // 默认头像（首字母或占位符）
    if (children) {
      return children;
    }

    if (alt) {
      return alt.charAt(0).toUpperCase();
    }

    return '?';
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {getContent()}
    </div>
  );
}

/**
 * Avatar Group 组件
 *
 * 用于显示多个头像（堆叠）
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 最大显示数量 */
  max?: number;
}

export function AvatarGroup({
  className,
  children,
  max = 4,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-800 rounded-full">
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium ring-2 ring-white dark:ring-gray-800',
            sizeClasses.sm
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}