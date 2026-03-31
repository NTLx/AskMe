/**
 * 底部导航栏组件
 * 手机版应用的主要导航结构
 * 采用 tonal 层级设计，无边框，active 状态使用 primary 容器高亮
 */

import { cn } from '../utils/cn';

export type BottomNavItem = 'chat' | 'explore' | 'bookmarks' | 'profile';

interface BottomNavItemDef {
  id: BottomNavItem;
  label: string;
  icon: string;
  iconActive: string;
}

const NAV_ITEMS: BottomNavItemDef[] = [
  { id: 'chat', label: '对话', icon: '💬', iconActive: '🗨️' },
  { id: 'explore', label: '探索', icon: '🧭', iconActive: '🧭' },
  { id: 'bookmarks', label: '收藏', icon: '📑', iconActive: '🔖' },
  { id: 'profile', label: '我的', icon: '👤', iconActive: '👤' },
];

interface BottomNavProps {
  /** 当前激活的导航项 */
  activeItem: BottomNavItem;
  /** 切换导航项 */
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
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-2xl transition-all duration-200',
        'hover:bg-surface-container-low focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        isActive
          ? 'bg-primary-container text-on-primary-container scale-105'
          : 'text-on-surface-variant hover:text-on-surface'
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-2xl filter drop-shadow-sm">
        {isActive ? item.iconActive : item.icon}
      </span>
      <span className={cn(
        'text-[11px] font-display font-medium tracking-wide',
        isActive ? 'opacity-100' : 'opacity-70'
      )}>
        {item.label}
      </span>
    </button>
  );
}

/**
 * 底部导航栏主组件
 */
export function BottomNav({ activeItem, onNavigate }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-surface-container-lowest/90 backdrop-blur-xl',
        'border-t border-outline-variant/10',
        'safe-area-bottom'
      )}
      role="navigation"
      aria-label="底部导航"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
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
