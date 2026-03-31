import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  /** 显示标签 */
  label: string;
  /** 点击回调 */
  onClick?: () => void;
}

/**
 * TopNavBar 组件 Props
 */
export interface TopNavBarProps {
  /** 面包屑导航项 */
  breadcrumbs: BreadcrumbItem[];
  /** 右侧操作按钮区域 */
  actions?: React.ReactNode;
  /** 额外的类名 */
  className?: string;
}

/**
 * TopNavBarButton 组件 Props
 */
export interface TopNavBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 图标 */
  icon?: React.ReactNode;
  /** 按钮标签 */
  label: string;
  /** 是否显示为激活状态 */
  active?: boolean;
}

/**
 * TopNavBar 按钮 - 用于顶部导航栏的操作按钮
 *
 * 特点：
 * - Ghost 样式，透明背景
 * - 支持图标 + 文字
 * - 支持 active 状态高亮
 */
export function TopNavBarButton({
  icon,
  label,
  active = false,
  className,
  ...props
}: TopNavBarButtonProps) {
  return (
    <button
      className={cn(
        // 基础样式
        'inline-flex items-center justify-center gap-1.5',
        'h-9 px-3 rounded-full',
        'text-sm font-medium font-body',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none',
        // 状态样式
        active
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface hover:bg-surface-bright active:bg-surface-dim',
        className
      )}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

/**
 * TopNavBar 顶部导航栏组件
 *
 * 特点：
 * - 高度 60px，sticky 定位
 * - 毛玻璃效果 (background/80 + backdrop-blur-xl)
 * - 无边框设计
 * - 支持面包屑导航
 * - 右侧操作按钮区域
 *
 * @example
 * ```tsx
 * <TopNavBar
 *   breadcrumbs={[
 *     { label: '首页' },
 *     { label: '对话', onClick: () => navigate('/chat') },
 *     { label: '当前会话' }
 *   ]}
 *   actions={
 *     <>
 *       <TopNavBarButton icon={<IconShare />} label="分享" />
 *       <TopNavBarButton icon={<IconSettings />} label="设置" />
 *     </>
 *   }
 * />
 * ```
 */
export function TopNavBar({
  breadcrumbs,
  actions,
  className,
}: TopNavBarProps) {
  return (
    <header
      className={cn(
        // 布局
        'sticky top-0 z-50',
        'h-[60px] w-full',
        'flex items-center justify-between px-4',
        // 样式 - 毛玻璃效果
        'bg-background/80 backdrop-blur-xl',
        className
      )}
    >
      {/* 面包屑导航区域 */}
      <nav className="flex items-center gap-1 min-w-0">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {/* 面包屑项 */}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={cn(
                  'text-sm font-body truncate',
                  'text-on-surface/70 hover:text-on-surface',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:text-on-surface'
                )}
              >
                {item.label}
              </button>
            ) : (
              <span className="text-sm font-body text-on-surface truncate">
                {item.label}
              </span>
            )}

            {/* 分隔符 */}
            {index < breadcrumbs.length - 1 && (
              <span className="text-on-surface/30 text-sm select-none">/</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* 操作按钮区域 */}
      {actions && (
        <div className="flex items-center gap-1 shrink-0">{actions}</div>
      )}
    </header>
  );
}