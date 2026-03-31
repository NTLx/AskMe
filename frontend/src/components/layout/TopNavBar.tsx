/**
 * TopNavBar - 顶部导航栏
 * 像素级对齐 UI Reference: stitch_askme_web-dark
 *
 * 设计规范:
 * - 高度 60px, sticky 定位
 * - 毛玻璃效果: bg-surface/80 + backdrop-blur-xl
 * - 无边框设计 (No-Line Rule)
 * - 左侧: 品牌名/页面名 + 分隔符 + 会话名或状态
 * - 右侧: 操作按钮
 */

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TopNavBarProps {
  /** Logo/品牌名 */
  brandName?: string;
  /** 当前会话名称或面包屑子项 */
  sessionName?: string;
  /** 右侧操作按钮区域 */
  actions?: React.ReactNode;
  /** 额外的类名 */
  className?: string;
}

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
 * TopNavBar 按钮
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
        'inline-flex items-center justify-center gap-2',
        'px-2 py-1.5',
        'rounded-lg',
        'text-sm font-medium',
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        active
          ? 'text-primary'
          : 'text-on-surface hover:text-primary',
        'cursor-pointer active:opacity-70',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {label && <span className="font-body">{label}</span>}
    </button>
  );
}

/**
 * TopNavBar 顶部导航栏组件
 */
export function TopNavBar({
  brandName = 'AskMe AI',
  sessionName,
  actions,
  className,
}: TopNavBarProps) {
  return (
    <header
      className={cn(
        // 布局
        'sticky top-0 z-40',
        'h-[60px] w-full',
        'flex items-center justify-between',
        'px-6',
        // 毛玻璃效果
        'bg-surface/80 backdrop-blur-xl',
        // 字体
        'font-display font-medium text-sm',
        className
      )}
    >
      {/* 左侧: 品牌名 + 会话名 */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-lg font-bold text-on-surface">
          {brandName}
        </span>

        {sessionName && (
          <>
            <span className="h-4 w-px bg-outline-variant/30" />
            <span className="text-sm font-semibold text-primary border-b-2 border-primary pb-0.5">
              {sessionName}
            </span>
          </>
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