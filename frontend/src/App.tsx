import { useState, useCallback, useEffect } from 'react';
import { useAppInit } from './hooks/useAppInit';
import { useAppStore } from './stores/appStore';
import { useSessionStore } from './stores/sessionStore';
import { useSettingsStore } from './stores/settingsStore';
import { LaunchPad } from './components/LaunchPad';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { Settings } from './components/Settings';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar, TopNavBarButton } from './components/layout/TopNavBar';
import { AgentPersonas } from './components/pages/Settings/AgentPersonas';
import { LLMConfiguration } from './components/pages/Settings/LLMConfiguration';
import { ScenarioType } from './types';

// 视图类型
type ViewType = 'timeline' | 'tags' | 'agents' | 'llm' | 'settings' | 'help';

export function App() {
  const { isInitialized, error } = useAppInit();
  const { isSettingsOpen, setLaunchPadVisible, toggleSettings } = useAppStore();
  const { messages, currentAgent, addMessage, currentSessionId, setCurrentSessionId, addSession } = useSessionStore();
  const { settings, setSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('timeline');
  const [isInChat, setIsInChat] = useState(false);

  // 主题切换逻辑 - 正确映射到 web-dark / web-light
  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        root.setAttribute('data-theme', mediaQuery.matches ? 'web-dark' : 'web-light');
      };
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      root.setAttribute('data-theme', settings.theme === 'dark' ? 'web-dark' : 'web-light');
    }
  }, [settings.theme]);

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-surface text-error">Initialization Error: {error.message}</div>;
  }

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen bg-surface text-on-surface">Initializing AskMe...</div>;
  }

  // 处理启动会话
  const handleStartSession = useCallback((_scenarioType: ScenarioType | null, initialContent?: string) => {
    setLaunchPadVisible(false);
    setIsInChat(true);

    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    addSession({
      id: sessionId,
      title: '新对话',
      agentName: currentAgent?.name || '温和引导者',
      agentEmoji: currentAgent?.emoji || '🤗',
      llmName: 'GPT-4',
      llmIcon: '🟢',
      lastActiveAt: Date.now(),
      messageCount: 0,
      isPinned: false,
      isLocked: false,
      tags: [],
      hasParent: false,
      hasChildren: false,
    });

    if (initialContent) {
      addMessage({
        id: Date.now().toString(),
        sessionId,
        role: 'user',
        content: initialContent,
        createdAt: Date.now(),
        isBranchPoint: false,
      });

      // 模拟 AI 响应
      setIsLoading(true);
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          sessionId,
          role: 'assistant',
          content: '很好！你已经理解了所有权的基本概念。那么让我问你：如果你有一个函数想要 \'借用\' 一个 String 而不是拿走它，你觉得 Rust 会提供什么样的机制？',
          createdAt: Date.now(),
          isBranchPoint: false,
        });
        setIsLoading(false);
      }, 1500);
    }
  }, [setLaunchPadVisible, addMessage, currentSessionId, setCurrentSessionId, addSession, currentAgent]);

  // 处理复制消息
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  // 处理反应
  const handleReact = useCallback((_messageId: string, _reaction: 'like' | 'dislike') => {
    // TODO: implement reactions
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
        llmName: 'GPT-4',
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

    addMessage({
      id: Date.now().toString(),
      sessionId,
      role: 'user',
      content,
      createdAt: Date.now(),
      isBranchPoint: false,
    });

    setIsLoading(true);
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
    setIsInChat(true);
    setActiveView('timeline');
  }, [setCurrentSessionId]);

  // 处理新建会话
  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setLaunchPadVisible(true);
    setIsInChat(false);
    setActiveView('timeline');
  }, [setCurrentSessionId, setLaunchPadVisible]);

  // 处理视图切换
  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    if (view === 'settings') {
      // Settings 直接在主内容区显示
    } else if (view === 'agents' || view === 'llm') {
      setIsInChat(false);
    } else if (view === 'timeline') {
      if (!currentSessionId) {
        setIsInChat(false);
      }
    }
  }, [currentSessionId]);

  // 确定当前显示什么内容
  const showLaunchPad = !isInChat && activeView === 'timeline';
  const showChat = isInChat && activeView === 'timeline';
  const showAgents = activeView === 'agents';
  const showLLM = activeView === 'llm';
  const showSettings = activeView === 'settings';

  // 构建 TopNavBar 内容
  const getTopNavContent = () => {
    if (showLaunchPad) {
      return {
        brandName: 'LaunchPad',
        sessionName: undefined,
        actions: (
          <>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              <span className="text-[10px] tracking-widest uppercase">Sync Ready</span>
            </div>
            <span className="h-4 w-px bg-outline-variant/30" />
            <TopNavBarButton icon="ios_share" label="Share" />
            <TopNavBarButton icon="download" label="Export" />
            <span className="h-4 w-px bg-outline-variant/30" />
            <TopNavBarButton icon="more_vert" />
          </>
        ),
      };
    }
    if (showChat) {
      return {
        brandName: messages.length > 0 ? 'Learning Rust Memory Ownership' : 'New Session',
        sessionName: undefined,
        actions: (
          <>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-tertiary">psychology</span>
                Socrates (🧠)
              </span>
              <span className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                GPT-4
              </span>
            </div>
            <span className="h-4 w-px bg-outline-variant/30" />
            <TopNavBarButton icon="ios_share" label="Share" />
            <TopNavBarButton icon="download" label="Export" />
            <TopNavBarButton icon="more_vert" />
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
            </div>
          </>
        ),
      };
    }
    if (showAgents) {
      return {
        brandName: 'Settings',
        sessionName: 'Agent Personas',
        actions: (
          <>
            <TopNavBarButton icon="ios_share" label="Share" />
            <TopNavBarButton icon="download" label="Export" />
            <span className="h-4 w-px bg-outline-variant/30" />
            <TopNavBarButton icon="more_vert" />
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
            </div>
          </>
        ),
      };
    }
    if (showLLM) {
      return {
        brandName: 'Settings',
        sessionName: 'LLM Configuration',
        actions: (
          <>
            <TopNavBarButton icon="download" label="Export" />
            <button className="px-4 py-1.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
              Share
            </button>
            <span className="h-4 w-px bg-outline-variant/30" />
            <TopNavBarButton icon="more_vert" />
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
            </div>
          </>
        ),
      };
    }
    if (showSettings) {
      return {
        brandName: 'Settings',
        sessionName: 'General',
        actions: (
          <>
            <TopNavBarButton icon="more_vert" />
          </>
        ),
      };
    }
    return { brandName: 'AskMe AI', sessionName: undefined, actions: undefined };
  };

  const topNavContent = getTopNavContent();

  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden">
      {/* 侧边导航栏 - 固定 280px */}
      <SideNavBar
        activeView={activeView}
        onViewChange={handleViewChange}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-h-0 ml-[280px]">
        {/* 顶部导航栏 */}
        <TopNavBar
          brandName={topNavContent.brandName}
          sessionName={topNavContent.sessionName}
          actions={topNavContent.actions}
        />

        {/* 内容区域 */}
        {showLaunchPad && (
          <LaunchPad onStartSession={handleStartSession} />
        )}

        {showChat && (
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
              placeholder="Type your answer or ask for a hint..."
            />
          </>
        )}

        {showAgents && (
          <div className="flex-1 overflow-y-auto">
            <AgentPersonas
              activeAgentId={undefined}
              onActivateAgent={() => {}}
              onEditAgent={() => {}}
              onCopyAgent={() => {}}
              onDeleteAgent={() => {}}
              onCreateAgent={() => {}}
            />
          </div>
        )}

        {showLLM && (
          <div className="flex-1 overflow-y-auto">
            <LLMConfiguration
              providers={[]}
              onUpdateProvider={() => {}}
              onCreateProvider={() => {}}
              onDeleteProvider={() => {}}
              onTestConnection={async () => true}
            />
          </div>
        )}

        {showSettings && (
          <div className="flex-1 overflow-y-auto">
            <Settings
              isOpen={true}
              onClose={() => setActiveView('timeline')}
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
          </div>
        )}
      </div>

      {/* Legacy settings overlay - remove later */}
      {isSettingsOpen && !showSettings && (
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