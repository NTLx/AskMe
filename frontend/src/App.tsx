import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { useSessionStore } from './stores/sessionStore';
import { useSettingsStore } from './stores/settingsStore';
import { LaunchPad } from './components/LaunchPad';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { Settings } from './components/Settings';
import { BottomNav, type BottomNavItem } from './components/BottomNav';
import { ScenarioType } from './types';

export function App() {
  const { isLaunchPadVisible, isSidebarOpen, isSettingsOpen, setLaunchPadVisible, toggleSettings } = useAppStore();
  const { messages, currentAgent, addMessage, currentSessionId, setCurrentSessionId, addSession } = useSessionStore();
  const { settings, setSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<BottomNavItem>('chat');

  // 主题切换逻辑
  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      root.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // 处理启动会话
  const handleStartSession = useCallback((_scenarioType: ScenarioType | null, initialContent?: string) => {
    setLaunchPadVisible(false);
    if (initialContent) {
      // 添加用户消息
      addMessage({
        id: Date.now().toString(),
        sessionId: currentSessionId || 'default',
        role: 'user',
        content: initialContent,
        createdAt: Date.now(),
        isBranchPoint: false,
      });
    }
  }, [setLaunchPadVisible, addMessage, currentSessionId]);

  // 处理复制消息
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  // 处理反应
  const handleReact = useCallback((messageId: string, reaction: 'like' | 'dislike') => {
    console.log('React to message:', messageId, reaction);
  }, []);

  // 处理发送消息
  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const sessionId = currentSessionId || Date.now().toString();
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
      addSession({
        id: sessionId,
        title: '新对话',
        agentName: currentAgent?.name || '温和引导者',
        agentEmoji: currentAgent?.emoji || '🤗',
        llmName: 'Default',
        llmIcon: '🟢',
        lastActiveAt: Date.now(),
        messageCount: 0,
        isPinned: false,
        isLocked: false,
        tags: [],
        hasParent: false,
        hasChildren: false,
      });
    }

    // 添加用户消息
    addMessage({
      id: Date.now().toString(),
      sessionId,
      role: 'user',
      content,
      createdAt: Date.now(),
      isBranchPoint: false,
    });

    setIsLoading(true);

    // 模拟 AI 响应
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        sessionId,
        role: 'assistant',
        content: '这是一个很好的回答！让我继续向你提问...',
        createdAt: Date.now(),
        isBranchPoint: false,
      });
      setIsLoading(false);
    }, 1000);
  }, [currentSessionId, setCurrentSessionId, addSession, addMessage, currentAgent]);

  // 处理选择会话
  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, [setCurrentSessionId]);

  // 处理新建会话
  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setLaunchPadVisible(true);
  }, [setCurrentSessionId, setLaunchPadVisible]);

  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden">
      {/* 侧边栏 - 手机版隐藏 */}
      {isSidebarOpen && (
        <Sidebar
          onNewSession={handleNewSession}
          onSelectSession={handleSelectSession}
          onOpenSettings={toggleSettings}
        />
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-h-0">
        {isLaunchPadVisible ? (
          <LaunchPad onStartSession={handleStartSession} />
        ) : (
          <>
            <ChatArea
              messages={messages}
              agent={currentAgent}
              isLoading={isLoading}
              onCopyMessage={handleCopyMessage}
              onReact={handleReact}
            />
            <InputArea
              onSendMessage={handleSendMessage}
              isStreaming={isLoading}
              placeholder="输入你的回答或问题..."
            />
          </>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNav activeItem={activeNavItem} onNavigate={setActiveNavItem} />

      {/* 设置面板 */}
      {isSettingsOpen && (
        <Settings
          isOpen={isSettingsOpen}
          onClose={toggleSettings}
          agents={[]}
          llmProviders={[]}
          settings={settings}
          onUpdateAgent={() => {}}
          onCreateAgent={() => {}}
          onDeleteAgent={() => {}}
          onUpdateLLMProvider={() => {}}
          onCreateLLMProvider={() => {}}
          onDeleteLLMProvider={() => {}}
          onUpdateSettings={setSettings}
        />
      )}
    </div>
  );
}