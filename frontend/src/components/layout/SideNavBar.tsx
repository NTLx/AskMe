/**
 * SideNavBar - 侧边导航栏 (桌面版)
 * 像素级对齐 UI Reference: stitch_askme_web-dark
 *
 * 设计规范:
 * - 固定宽度 280px, 全高 fixed 定位
 * - 背景 surface-container-low (#141317)
 * - 无边框设计 (No-Line Rule)
 * - Logo: 渐变图标 + "AskMe AI" + "Reverse Questioning"
 * - "New Session" 按钮: primary-container 背景, rounded-full
 * - 导航项: rounded-full pill, hover → surface-container-high
 * - 底部: Settings + Help + 用户资料卡片
 */

import { cn } from '../../utils/cn';
import { useSessionStore } from '../../stores/sessionStore';

// 导航视图类型
type ViewType = 'timeline' | 'tags' | 'agents' | 'llm' | 'settings' | 'help';

interface SideNavBarProps {
  /** 当前激活视图 */
  activeView?: ViewType;
  /** 视图切换回调 */
  onViewChange?: (view: ViewType) => void;
  /** 新建会话回调 */
  onNewSession?: () => void;
  /** 选择会话回调 */
  onSelectSession?: (sessionId: string) => void;
}

// 主导航项配置
const MAIN_NAV_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'timeline', label: 'Timeline', icon: 'history' },
  { id: 'tags', label: 'Tags', icon: 'sell' },
  { id: 'agents', label: 'Agents', icon: 'smart_toy' },
  { id: 'llm', label: 'LLM', icon: 'model_training' },
];

export function SideNavBar({
  activeView = 'timeline',
  onViewChange,
  onNewSession,
  onSelectSession,
}: SideNavBarProps) {
  const { sessions, currentSessionId } = useSessionStore();

  return (
    <aside
      className={cn(
        // 布局
        'fixed left-0 top-0 h-screen w-[280px]',
        'flex flex-col',
        // 背景 - surface-container-low (无边框设计)
        'bg-surface-container-low',
        'z-50'
      )}
    >
      {/* Logo 区域 */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
          <span
            className="material-symbols-outlined text-on-primary text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary font-display tracking-tight">
            AskMe AI
          </h1>
          <p className="text-xs text-on-surface-variant">
            Reverse Questioning
          </p>
        </div>
      </div>

      {/* New Session 按钮 */}
      <div className="px-4 mb-2">
        <button
          onClick={onNewSession}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'px-4 py-3',
            'bg-primary-container text-on-primary-container',
            'rounded-full',
            'font-bold text-sm',
            'transition-all duration-200',
            'hover:opacity-90 active:scale-[0.97]'
          )}
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Session
        </button>
      </div>

      {/* 主导航 */}
      <nav className="flex flex-col gap-1 px-4 mt-2">
        {MAIN_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange?.(item.id)}
            className={cn(
              'flex items-center gap-3',
              'px-4 py-2.5',
              'rounded-full',
              'text-sm font-medium',
              'transition-all duration-200 ease-in-out',
              'group',
              activeView === item.id
                ? 'bg-surface-container-lowest text-primary font-bold'
                : 'text-on-surface hover:bg-surface-container-high'
            )}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span className={cn(
              'material-symbols-outlined text-lg',
              activeView === item.id
                ? 'text-primary'
                : 'text-on-surface group-hover:text-primary'
            )}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* 会话列表区域 */}
      {sessions.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 mt-6">
          <h3 className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest px-4 mb-2">
            Recent Sessions
          </h3>
          <div className="space-y-0.5">
            {sessions.slice(0, 10).map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession?.(session.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left',
                  'text-sm transition-colors duration-150',
                  currentSessionId === session.id
                    ? 'text-primary bg-surface-container-lowest/50'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                )}
              >
                <span className="material-symbols-outlined text-sm opacity-60">
                  {session.isPinned ? 'push_pin' : 'chat_bubble_outline'}
                </span>
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 底部导航 + 用户信息 */}
      <div className="mt-auto flex flex-col gap-1 px-4 pt-4">
        {/* 分隔 - 使用透明度极低的线 (设计允许非常微妙的分隔) */}
        <div className="h-px bg-outline-variant/10 mx-2 mb-2" />

        <button
          onClick={() => onViewChange?.('settings')}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-full',
            'text-sm transition-colors duration-200 group',
            activeView === 'settings'
              ? 'bg-primary-container text-on-primary-container font-bold'
              : 'text-on-surface hover:bg-surface-container-high'
          )}
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Settings
        </button>

        <button
          className="flex items-center gap-3 px-4 py-2.5 rounded-full text-on-surface text-sm hover:bg-surface-container-high transition-colors duration-200 group"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          Help
        </button>

        {/* 用户资料卡片 */}
        <div className="flex items-center gap-3 px-4 py-4 mt-2 mb-4 bg-surface-container rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-on-secondary-container">person</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-on-surface truncate">
              Guest Curator
            </p>
            <p className="text-[10px] text-on-surface-variant">
              Free Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideNavBar;