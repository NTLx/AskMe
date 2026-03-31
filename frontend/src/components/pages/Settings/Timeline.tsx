/**
 * Timeline 时间线页面 - Material Design 3 设计规范
 * - 会话历史列表
 * - 时间分组（今天/昨天/更早）
 * - 会话预览
 */

import { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { BottomNav } from '../../BottomNav';
import type { SessionListItem } from '../../../types';

/**
 * 演示数据 - 会话列表
 */
const DEMO_SESSIONS: SessionListItem[] = [
  {
    id: '1',
    title: 'Exploring the Philosophy of Mind',
    lastActiveAt: Date.now() - 1000 * 60 * 30, // 30 分钟前
    isPinned: true,
    isLocked: false,
    messageCount: 12,
    agentName: 'Socratic Mentor',
    agentEmoji: '🧠',
    llmName: 'GPT-4',
    llmIcon: '🟢',
    tags: ['Philosophy', 'Research'],
    hasParent: false,
    hasChildren: true,
  },
  {
    id: '2',
    title: 'Understanding Neural Networks',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 2, // 2 小时前
    isPinned: false,
    isLocked: false,
    messageCount: 8,
    agentName: 'Gentle Guide',
    agentEmoji: '🌸',
    llmName: 'GPT-4 Turbo',
    llmIcon: '🟢',
    tags: ['AI', 'Learning'],
    hasParent: false,
    hasChildren: false,
  },
  {
    id: '3',
    title: 'Creative Writing Workshop',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 5, // 5 小时前
    isPinned: false,
    isLocked: false,
    messageCount: 15,
    agentName: 'Inspiration Catalyst',
    agentEmoji: '💡',
    llmName: 'Claude 3',
    llmIcon: '🔵',
    tags: ['Creative'],
    hasParent: false,
    hasChildren: true,
  },
  {
    id: '4',
    title: 'Deep Dive into Quantum Computing',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 24, // 1 天前
    isPinned: false,
    isLocked: true,
    messageCount: 20,
    agentName: 'Neutral Explorer',
    agentEmoji: '🔍',
    llmName: 'GPT-4',
    llmIcon: '🟢',
    tags: ['Science', 'Research'],
    hasParent: false,
    hasChildren: false,
  },
  {
    id: '5',
    title: 'Ethics in AI Development',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 天前
    isPinned: false,
    isLocked: false,
    messageCount: 6,
    agentName: 'Socratic Mentor',
    agentEmoji: '🧠',
    llmName: 'Claude 3 Sonnet',
    llmIcon: '🔵',
    tags: ['AI', 'Ethics'],
    hasParent: true,
    hasChildren: false,
    branchLabel: 'Branch from Quantum Computing',
  },
  {
    id: '6',
    title: 'Literary Analysis: Modern Poetry',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 天前
    isPinned: false,
    isLocked: false,
    messageCount: 10,
    agentName: 'Gentle Guide',
    agentEmoji: '🌸',
    llmName: 'GPT-4',
    llmIcon: '🟢',
    tags: ['Literature'],
    hasParent: false,
    hasChildren: false,
  },
  {
    id: '7',
    title: 'Strategic Thinking in Business',
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 天前
    isPinned: false,
    isLocked: false,
    messageCount: 14,
    agentName: 'Neutral Explorer',
    agentEmoji: '🔍',
    llmName: 'GPT-4 Turbo',
    llmIcon: '🟢',
    tags: ['Business'],
    hasParent: false,
    hasChildren: true,
  },
];

interface TimelineProps {
  sessions?: SessionListItem[];
  currentSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onPinSession?: (sessionId: string) => void;
  onContinueSession?: (sessionId: string) => void;
}

export function Timeline({
  sessions = DEMO_SESSIONS,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onPinSession,
  onContinueSession,
}: TimelineProps) {
  // 状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // 格式化时间
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
  const groupedSessions = useCallback(() => {
    const groups: Record<string, SessionListItem[]> = {
      'PINNED': [],
      'TODAY': [],
      'YESTERDAY': [],
      'THIS WEEK': [],
      'EARLIER': [],
    };

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 7 * 86400000;

    sessions
      .filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach((session) => {
        if (session.isPinned) {
          groups['PINNED'].push(session);
        } else if (session.lastActiveAt >= todayStart) {
          groups['TODAY'].push(session);
        } else if (session.lastActiveAt >= yesterdayStart) {
          groups['YESTERDAY'].push(session);
        } else if (session.lastActiveAt >= weekStart) {
          groups['THIS WEEK'].push(session);
        } else {
          groups['EARLIER'].push(session);
        }
      });

    return groups;
  }, [sessions, searchQuery]);

  // 处理选择会话
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    onSelectSession?.(sessionId);
  };

  // 计算统计数据
  const stats = {
    total: sessions.length,
    pinned: sessions.filter(s => s.isPinned).length,
    today: groupedSessions()['TODAY'].length,
    totalMessages: sessions.reduce((sum, s) => sum + (s.messageCount || 0), 0),
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
          {/* System Preferences 标签 */}
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-xs uppercase tracking-widest">System Preferences</span>
          </div>

          {/* 页面标题 */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface">
            Timeline
            <span className="text-on-surface-variant/40 font-normal ml-2">时间线</span>
          </h3>

          {/* 描述 */}
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed mt-3">
            Your intellectual journey, chronologically organized. Browse past conversations and continue where you left off.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 pb-32">
        {/* Search */}
        <section className="mb-8">
          <Input
            value={searchQuery}
            placeholder="Search conversations..."
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<span className="material-symbols-outlined text-sm">search</span>}
            className="w-full"
          />
        </section>

        {/* Statistics */}
        <section className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Total Sessions</span>
              <span className="text-2xl font-bold text-on-surface">{stats.total}</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Pinned</span>
              <span className="text-2xl font-bold text-primary">{stats.pinned}</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Today's Sessions</span>
              <span className="text-2xl font-bold text-on-surface">{stats.today}</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Total Messages</span>
              <span className="text-2xl font-bold text-on-surface">{stats.totalMessages}</span>
            </div>
          </div>
        </section>

        {/* Session Groups */}
        <section className="space-y-8">
          {Object.entries(groupedSessions()).map(([groupName, groupSessions]) => {
            if (groupSessions.length === 0) return null;

            return (
              <div key={groupName}>
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  {groupName === 'PINNED' && (
                    <span className="text-lg">📌</span>
                  )}
                  <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                    {groupName}
                  </h4>
                  <span className="text-xs text-on-surface-variant/60">
                    ({groupSessions.length})
                  </span>
                </div>

                {/* Session Cards */}
                <div className="space-y-3">
                  {groupSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={currentSessionId === session.id || selectedSessionId === session.id}
                      formatTime={formatTime}
                      onSelect={() => handleSelectSession(session.id)}
                      onContinue={() => onContinueSession?.(session.id)}
                      onPin={() => onPinSession?.(session.id)}
                      onDelete={() => onDeleteSession?.(session.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Empty State */}
        {searchQuery && Object.values(groupedSessions()).every(g => g.length === 0) && (
          <section className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">history_off</span>
            </div>
            <h5 className="text-lg font-semibold text-on-surface mb-2">No conversations found</h5>
            <p className="text-on-surface-variant">Try a different search term</p>
          </section>
        )}
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="chat" onNavigate={() => {}} />
    </div>
  );
}

/**
 * 单个会话卡片组件
 */
interface SessionCardProps {
  session: SessionListItem;
  isActive: boolean;
  formatTime: (timestamp: number) => string;
  onSelect: () => void;
  onContinue?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
}

function SessionCard({
  session,
  isActive,
  formatTime,
  onSelect,
  onContinue,
  onPin,
  onDelete,
}: SessionCardProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl border transition-all duration-300 cursor-pointer',
        isActive
          ? 'bg-primary-container/10 border-primary/20 ring-2 ring-primary/20'
          : 'bg-surface-container-lowest border-outline-variant/10 hover:bg-surface-container-high hover:shadow-md'
      )}
      onClick={onSelect}
    >
      {/* Header: Title + Time */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            isActive
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-high text-on-surface-variant'
          )}>
            <span className="material-symbols-outlined text-sm">
              {session.isPinned ? 'push_pin' : 'forum'}
            </span>
          </div>

          {/* Title */}
          <div>
            <h5 className={cn(
              'font-semibold',
              isActive ? 'text-primary' : 'text-on-surface'
            )}>
              {session.title}
            </h5>
            <span className="text-xs text-on-surface-variant mt-0.5 block">
              {formatTime(session.lastActiveAt)}
            </span>
          </div>
        </div>

        {/* Message Count */}
        <div className="text-right">
          <span className="text-sm font-semibold text-on-surface">
            {session.messageCount || 0}
          </span>
          <span className="text-xs text-on-surface-variant block">messages</span>
        </div>
      </div>

      {/* Tags */}
      {session.tags && session.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {session.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-full text-xs bg-surface-container-high text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        {/* Continue Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onContinue?.();
          }}
          className="text-on-surface-variant hover:text-primary"
        >
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Continue
          </span>
        </Button>

        {/* Quick Actions */}
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin?.();
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              session.isPinned
                ? 'text-primary bg-primary-container/20'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            )}
            title={session.isPinned ? 'Unpin' : 'Pin'}
          >
            <span className="material-symbols-outlined text-sm">
              {session.isPinned ? 'push_pin' : 'push_pin_outlined'}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Timeline;