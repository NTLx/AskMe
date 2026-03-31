/**
 * SideNavBar - 侧边导航栏 (桌面版)
 * 固定宽度 280px，全高 fixed 定位
 * 无边框设计，通过背景色区分层级
 * 激活状态：白色背景 + primary 文字 + 粗体
 */

import { cn } from '../../utils/cn';

// 导航视图类型
type ViewType = 'timeline' | 'tags' | 'agents' | 'llm' | 'settings' | 'help';

interface SideNavBarProps {
  /** 当前激活视图 */
  activeView?: ViewType;
  /** 视图切换回调 */
  onViewChange?: (view: ViewType) => void;
  /** 用户头像 URL */
  userAvatar?: string;
  /** 用户名称 */
  userName?: string;
  /** 会员等级 */
  memberTier?: string;
}

// 导航项配置
const NAV_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'timeline', label: 'Timeline', icon: 'event_note' },
  { id: 'tags', label: 'Tags', icon: 'label' },
  { id: 'agents', label: 'Agents', icon: 'smart_toy' },
  { id: 'llm', label: 'LLM', icon: 'cloud' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'help', label: 'Help', icon: 'help' },
];

/**
 * SideNavBar 侧边导航栏组件
 *
 * 设计规范:
 * - 宽度 280px，fixed 定位
 * - 背景 surface-container (无边框)
 * - Logo 区域：品牌名 + 角色类型
 * - 导航项：pill 形状，激活态白色背景 + primary 文字
 * - 用户信息：头像 + 名称 + 会员等级
 */
export function SideNavBar({
  activeView = 'timeline',
  onViewChange,
  userAvatar,
  userName = 'Explorer',
  memberTier = 'Free',
}: SideNavBarProps) {
  return (
    <aside
      className={cn(
        // 布局
        'fixed left-0 top-0 h-screen w-[280px]',
        'flex flex-col',
        // 背景 - surface-container (无边框设计)
        'bg-surface-container'
      )}
    >
      {/* Logo 区域 */}
      <div className="py-8 px-6">
        <h1 className="text-xl font-bold text-primary font-display tracking-tight">
          The Curator
        </h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 font-label">
          Academic Scholar
        </p>
      </div>

      {/* 导航区域 */}
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange?.(item.id)}
            className={cn(
              // 基础样式
              'flex items-center gap-3 px-4 py-3',
              'rounded-lg',
              'text-sm font-medium tracking-tight',
              'transition-all duration-200 ease-in-out',
              // 状态样式
              activeView === item.id
                ? 'bg-surface-container-lowest text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
            )}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="font-body">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 用户信息区域 */}
      <div className="py-6 px-4 mt-auto">
        {/* 无边框分隔 - 通过背景色区分 */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
          {/* 用户头像 */}
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-on-primary-container">
                person
              </span>
            )}
          </div>

          {/* 用户信息 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate font-body">
              {userName}
            </p>
            <p className="text-xs text-on-surface-variant font-label">
              {memberTier}
            </p>
          </div>

          {/* 展开按钮 */}
          <button
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="用户菜单"
          >
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SideNavBar;