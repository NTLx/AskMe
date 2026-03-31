/**
 * SideNavBar - 侧边导航栏
 * 固定宽度 280px，全高 fixed 定位
 * 无边框设计 (No-Line 规则)
 * pill 形状导航项
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { useSessionStore } from '../../stores/sessionStore';
import type { SessionListItem } from '../../types';

// 视图类型
type ViewType = 'timeline' | 'tags' | 'agents' | 'llm';

interface SideNavBarProps {
  onNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onOpenSettings?: () => void;
}

export function SideNavBar({
  onNewSession,
  onSelectSession,
  onOpenSettings,
}: SideNavBarProps) {
  const [activeView, setActiveView] = useState<ViewType>('timeline');
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
  const groupByTime = (sessionsList: SessionListItem[]): Record<string, SessionListItem[]> => {
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

    sessionsList.forEach((session) => {
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
  };

  // 导航项配置
  const navItems: { id: ViewType; label: string; emoji: string }[] = [
    { id: 'timeline', label: '时间线', emoji: '📅' },
    { id: 'tags', label: '标签', emoji: '🏷️' },
    { id: 'agents', label: 'Agents', emoji: '🤖' },
    { id: 'llm', label: 'LLM', emoji: '🟢' },
  ];

  const timeGroups = groupByTime(sessions);

  return (
    <nav className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container-low flex flex-col">
      {/* Logo 区域 */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h1 className="font-display font-semibold text-lg text-on-surface">
            AskMe
          </h1>
        </div>
      </div>

      {/* 新建会话按钮 */}
      <div className="px-4 mb-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center gap-2"
          onClick={onNewSession}
        >
          <span>✨</span>
          <span>新对话</span>
        </Button>
      </div>

      {/* 导航项 */}
      <div className="px-4 mb-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-full
                font-body text-sm transition-all duration-150
                ${activeView === item.id
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
                }
              `}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 分隔线 (无 border，使用背景色区分) */}
      <div className="mx-4 h-1 bg-surface-container rounded-full mb-4" />

      {/* Recent Sessions 列表 */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          {Object.entries(timeGroups).map(([groupName, groupSessions]) => {
            if (groupSessions.length === 0) return null;

            return (
              <div key={groupName}>
                {/* 分组标题 */}
                <h3 className="text-xs font-semibold text-on-surface-variant mb-2 px-2">
                  {groupName === '已置顶' ? `📌 ${groupName}` : groupName}
                </h3>

                {/* 会话项 */}
                <div className="space-y-1">
                  {groupSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => onSelectSession?.(session.id)}
                      className={`
                        w-full flex items-start gap-2 px-3 py-2 rounded-full
                        text-left transition-all duration-150
                        ${currentSessionId === session.id
                          ? 'bg-primary-container/40 text-on-primary-container'
                          : 'bg-transparent text-on-surface hover:bg-surface-container'
                        }
                      `}
                    >
                      {/* Agent Emoji */}
                      <span className="text-base flex-shrink-0">
                        {session.agentEmoji || '🤖'}
                      </span>

                      {/* 会话内容 */}
                      <div className="flex-1 min-w-0">
                        {/* 标题 */}
                        <div className="flex items-center gap-1">
                          <span className="font-body text-sm font-medium truncate">
                            {session.title}
                          </span>
                          {session.isPinned && (
                            <span className="text-xs">📌</span>
                          )}
                          {session.hasChildren && (
                            <span className="text-xs">🌿</span>
                          )}
                        </div>

                        {/* 元数据 */}
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                          <span className="truncate max-w-[80px]">
                            {session.agentName}
                          </span>
                          <span className="truncate">
                            {formatTime(session.lastActiveAt)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 空状态 */}
          {sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">💭</span>
              <p className="text-sm text-on-surface-variant">
                暂无会话
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                点击"新对话"开始探索
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Settings 按钮 */}
      <div className="px-4 py-4 mt-auto">
        <button
          onClick={onOpenSettings}
          className={`
            w-full flex items-center gap-3 px-4 py-2.5 rounded-full
            bg-transparent text-on-surface-variant hover:bg-surface-container
            font-body text-sm transition-all duration-150
          `}
        >
          <span>⚙️</span>
          <span>设置</span>
        </button>
      </div>
    </nav>
  );
}

export default SideNavBar;