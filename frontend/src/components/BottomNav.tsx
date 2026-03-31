/**
 * BottomNav - 底部导航栏 (手机版)
 * 高度: 80px + safe-area-bottom
 * 毛玻璃效果: surface-container-lowest 85% opacity + backdrop-blur-xl
 * 顶部圆角: rounded-t-3xl
 * 选中态: amber/secondary-container 背景高亮
 */

import { cn } from '../utils/cn';

export type BottomNavItem = 'timeline' | 'agents' | 'add' | 'llm' | 'settings' | 'chat' | 'explore' | 'bookmarks' | 'profile';

interface BottomNavItemDef {
  id: BottomNavItem;
  label: string;
  icon: string;
}

const NAV_ITEMS: BottomNavItemDef[] = [
  { id: 'timeline', label: 'Timeline', icon: 'event_note' },
  { id: 'agents', label: 'Agents', icon: 'smart_toy' },
  { id: 'add', label: 'Add', icon: 'add' },
  { id: 'llm', label: 'LLM', icon: 'cloud' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

interface BottomNavProps {
  /** 当前激活的导航项 */
  activeItem: BottomNavItem;
  /** 切换导航项回调 */
  onNavigate: (item: BottomNavItem) => void;
}

/**
 * 单个导航按钮
 */
interface NavButtonProps {
  item: BottomNavItemDef;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  // Add 按钮特殊处理 - FAB 样式
  const isAddButton = item.id === 'add';

  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className={cn(
          // FAB 样式
          'flex items-center justify-center',
          'w-14 h-14',
          'bg-secondary-container text-on-secondary-container',
          'rounded-2xl',
          'shadow-lg shadow-secondary-container/30',
          'transition-all duration-200 ease-in-out',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30'
        )}
        aria-label={item.label}
      >
        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        // 基础样式
        'flex flex-col items-center justify-center',
        'py-3 px-4',
        'rounded-2xl',
        'transition-all duration-200 ease-in-out',
        // 状态样式
        isActive
          ? 'bg-secondary-container/20 text-secondary' // amber 背景高亮
          : 'text-on-surface-variant hover:text-on-surface',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30'
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="material-symbols-outlined text-xl">{item.icon}</span>
      <span
        className={cn(
          'text-[11px] font-medium tracking-wide mt-1 font-label',
          isActive ? 'opacity-100' : 'opacity-70'
        )}
      >
        {item.label}
      </span>
    </button>
  );
}

/**
 * BottomNav 底部导航栏主组件
 *
 * 设计规范:
 * - 高度: 80px + safe-area-bottom
 * - 毛玻璃效果: surface-container-lowest 85% opacity + backdrop-blur-xl
 * - 顶部圆角: rounded-t-3xl
 * - 阴影: primary 调柔和阴影
 * - 选中态: amber/secondary-container 背景高亮
 * - Add 按钮: FAB 样式，secondary-container 背景
 */
export function BottomNav({ activeItem, onNavigate }: BottomNavProps) {
  return (
    <nav
      className={cn(
        // 布局 - 仅手机版显示
        'md:hidden',
        'fixed bottom-0 left-0 right-0 z-50',
        // 高度 + safe-area
        'h-20 pb-[env(safe-area-inset-bottom)]',
        // 毛玻璃效果 - surface-container-lowest 85% + backdrop-blur-xl
        'bg-surface-container-lowest/[0.85] backdrop-blur-xl',
        // 顶部圆角
        'rounded-t-3xl',
        // 阴影 - primary 调
        'shadow-[0_-12px_32px_-4px_rgba(0,79,81,0.08)]'
      )}
      role="navigation"
      aria-label="底部导航"
    >
      <div className="flex items-center justify-around h-full px-4">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;