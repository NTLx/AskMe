/**
 * TopNavBar - 顶部导航栏
 * 高度 64px，sticky 定位
 * 毛玻璃效果: surface 70% opacity + backdrop-blur-xl (20px)
 * 阴影: 使用 primary 色调的柔和阴影
 * 无边框设计
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * TopNavBar 组件 Props
 */
export interface TopNavBarProps {
  /** 当前会话名称 */
  sessionName?: string;
  /** Logo/品牌名 */
  brandName?: string;
  /** 右侧操作按钮区域 */
  actions?: React.ReactNode;
  /** 是否为简化模式 (手机版) */
  simplified?: boolean;
  /** 额外的类名 */
  className?: string;
}

/**
 * TopNavBarButton 组件 Props
 */
export interface TopNavBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 图标 (Material Symbols 名称) */
  icon?: string;
  /** 按钮标签 */
  label?: string;
  /** 是否显示为激活状态 */
  active?: boolean;
}

/**
 * TopNavBar 按钮 - 用于顶部导航栏的操作按钮
 *
 * 特点:
 * - Ghost 样式，透明背景
 * - Material Symbols 图标
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
        // 布局
        'inline-flex items-center justify-center gap-2',
        'p-2 rounded-full',
        // 过渡
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        // 状态样式
        active
          ? 'text-primary'
          : 'text-on-surface-variant hover:text-primary',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-lg">{icon}</span>
      )}
      {label && <span className="text-sm font-medium font-body">{label}</span>}
    </button>
  );
}

/**
 * TopNavBar 顶部导航栏组件
 *
 * 设计规范:
 * - 高度 64px，sticky 定位
 * - 毛玻璃效果: bg-surface/70 + backdrop-blur-xl (20px)
 * - 阴影: 柔和的 primary 调阴影
 * - 水平内边距: 40px (desktop) / 24px (mobile)
 * - Logo + 当前会话名 + 操作按钮
 *
 * @example
 * ```tsx
 * <TopNavBar
 *   sessionName="探索人工智能伦理"
 *   actions={
 *     <>
 *       <TopNavBarButton icon="share" label="分享" />
 *       <TopNavBarButton icon="settings" />
 *     </>
 *   }
 * />
 * ```
 */
export function TopNavBar({
  sessionName,
  brandName = 'AskMe AI',
  actions,
  simplified = false,
  className,
}: TopNavBarProps) {
  return (
    <header
      className={cn(
        // 布局
        'sticky top-0 z-50',
        'h-16 w-full', // 64px 高度
        'flex items-center justify-between',
        // 水平内边距: 40px (desktop) / 24px (mobile)
        simplified ? 'px-6' : 'px-10',
        // 毛玻璃效果 - surface 70% opacity + backdrop-blur-xl
        'bg-surface/70 backdrop-blur-xl',
        // 阴影 - 使用 primary 调的柔和阴影
        'shadow-[0_8px_32px_0_rgba(var(--shadow-rgb),0.06)]',
        className
      )}
    >
      {/* 左侧: Logo + 当前会话 */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Logo */}
        <h1 className="text-lg font-extrabold tracking-tight text-on-surface font-display">
          {brandName}
        </h1>

        {/* 分隔线 (非简化模式) */}
        {!simplified && sessionName && (
          <span className="h-4 w-px bg-outline-variant/30" />
        )}

        {/* 当前会话名 (非简化模式) */}
        {!simplified && sessionName && (
          <nav className="hidden md:flex">
            <span className="text-sm font-semibold text-primary border-b-2 border-primary font-body">
              {sessionName}
            </span>
          </nav>
        )}
      </div>

      {/* 右侧: 操作按钮 */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}

export default TopNavBar;