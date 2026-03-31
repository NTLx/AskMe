/**
 * Sidebar - 侧边导航栏（手机版）
 * 采用"Digital Nocturne"深色主题设计
 * - 无边框设计，使用 surface 层级区分
 * - PINNED/TODAY/YESTERDAY 分组
 * - 底部 Tab 导航
 */

import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { useSessionStore } from '../stores/sessionStore';
import type { SessionListItem } from '../types';
import { BottomNav } from './BottomNav';

interface SidebarProps {
  onNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onOpenSettings?: () => void;
}

export function Sidebar({
  onNewSession,
  onSelectSession,
}: SidebarProps) {
  const { sessions, currentSessionId } = useSessionStore();

  // 格式化时间显示
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;

    const date = new Date(timestamp);
    return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  };

  // 按时间分组会话
  const timeGroups = (() => {
    const groups: Record<string, SessionListItem[]> = {
      '已置顶': [],
      '今天': [],
      '昨天': [],
      '本周': [],
      '更早': [],
    };

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 7 * 86400000;

    sessions.forEach((session) => {
      if (session.isPinned) {
        groups['已置顶'].push(session);
      } else if (session.lastActiveAt >= todayStart) {
        groups['今天'].push(session);
      } else if (session.lastActiveAt >= yesterdayStart) {
        groups['昨天'].push(session);
      } else if (session.lastActiveAt >= weekStart) {
        groups['本周'].push(session);
      } else {
        groups['更早'].push(session);
      }
    });

    return groups;
  })();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[85%] max-w-[320px] bg-surface-container-low flex flex-col z-50">
      {/* Logo 区域 */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface">
            ☰
          </button>
          <span className="font-display text-xl font-bold text-primary">AskMe</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
      </div>

      {/* 新建会话按钮 */}
      <div className="px-4 mb-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center gap-2 bg-primary-container text-on-primary hover:bg-primary-fixed py-3 rounded-xl"
          onClick={onNewSession}
        >
          <span className="text-lg">+</span>
          <span className="font-display font-medium">NEW SESSION</span>
        </Button>
      </div>

      {/* 会话列表 */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-4">
          {/* PINNED */}
          {timeGroups['已置顶']?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant mb-3 px-2 uppercase tracking-wider">
                📌 Pinned
              </h3>
              <div className="space-y-1">
                {timeGroups['已置顶'].map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onSelect={() => onSelectSession?.(session.id)}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TODAY */}
          {timeGroups['今天']?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant mb-3 px-2 uppercase tracking-wider">
                Today
              </h3>
              <div className="space-y-1">
                {timeGroups['今天'].map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onSelect={() => onSelectSession?.(session.id)}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YESTERDAY */}
          {timeGroups['昨天']?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant mb-3 px-2 uppercase tracking-wider">
                Yesterday
              </h3>
              <div className="space-y-1">
                {timeGroups['昨天'].map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onSelect={() => onSelectSession?.(session.id)}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 更早 */}
          {Object.entries(timeGroups).some(([key, value]) => ['本周', '更早'].includes(key) && value.length > 0) && (
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant mb-3 px-2 uppercase tracking-wider">
                Earlier
              </h3>
              <div className="space-y-1">
                {['本周', '更早'].flatMap((key) => timeGroups[key] || []).map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onSelect={() => onSelectSession?.(session.id)}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部导航栏 */}
      <BottomNav activeItem="timeline" onNavigate={() => {}} />
    </aside>
  );
}

/**
 * 单个会话项组件
 */
interface SessionItemProps {
  session: SessionListItem;
  isActive: boolean;
  onSelect: () => void;
  formatTime?: (timestamp: number) => string;
}

function SessionItem({ session, isActive, onSelect, formatTime }: SessionItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
        isActive
          ? 'bg-primary-container/30 text-primary'
          : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
      )}
    >
      {/* 图标 */}
      <span className="text-base flex-shrink-0 opacity-70">
        {session.isPinned ? '📌' : '💬'}
      </span>

      {/* 标题和时间 */}
      <div className="flex-1 min-w-0">
        <span className="font-body text-sm block truncate">
          {session.title}
        </span>
        {formatTime && (
          <span className="text-xs text-on-surface-variant/60 mt-0.5 block">
            {formatTime(session.lastActiveAt)}
          </span>
        )}
      </div>
    </button>
  );
}

export default Sidebar;