import { useState, useCallback, useEffect } from 'react';
import { useAppInit } from './hooks/useAppInit';
import { useAppStore } from './stores/appStore';
import { useSessionStore } from './stores/sessionStore';
import { useSettingsStore } from './stores/settingsStore';
import { LaunchPad } from './components/LaunchPad';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar, TopNavBarButton } from './components/layout/TopNavBar';
import { AgentPersonas } from './components/pages/Settings/AgentPersonas';
import { LLMConfiguration } from './components/pages/Settings/LLMConfiguration';
import { ScenarioType, Message } from './types';
import { getDefaultStorageProvider } from './storage';
import { sendMessageReal } from './services/chatService';
import { generateId } from './storage/web-crypto';

// 视图类型
type ViewType = 'timeline' | 'tags' | 'agents' | 'llm' | 'settings' | 'help';

export function App() {
  const { isInitialized, error } = useAppInit();
  const { setLaunchPadVisible } = useAppStore();
  const { messages, activeAgentProfile, addMessage, currentSessionId, setCurrentSessionId, addSession } = useSessionStore();
  const { settings } = useSettingsStore();
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


  // 处理启动会话
  const handleStartSession = useCallback((_scenarioType: ScenarioType | null, initialContent?: string) => {
    setLaunchPadVisible(false);
    setIsInChat(true);

    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    addSession({
      id: sessionId,
      title: '新对话',
      agentName: activeAgentProfile?.name || '温和引导者',
      agentEmoji: activeAgentProfile?.emoji || '🤗',
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
        id: generateId(),
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
          id: generateId(),
          sessionId,
          role: 'assistant',
          content: '很好！你已经理解了所有权的基本概念。那么让我问你：如果你有一个函数想要 \'借用\' 一个 String 而不是拿走它，你觉得 Rust 会提供什么样的机制？',
          createdAt: Date.now(),
          isBranchPoint: false,
        });
        setIsLoading(false);
      }, 1500);
    }
  }, [setLaunchPadVisible, addMessage, currentSessionId, setCurrentSessionId, addSession, activeAgentProfile]);

  // 处理复制消息
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  // 处理反应
  const handleReact = useCallback((_messageId: string, _reaction: 'like' | 'dislike') => {
    // TODO: implement reactions
  }, []);

  // 处理发送消息
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const { activeLLMProvider, activeAgentProfile } = useSessionStore.getState();
    if (!activeLLMProvider) {
      alert('请先在配置中选择 LLM Provider');
      return;
    }

    let sessionId = currentSessionId;
    const storage = await getDefaultStorageProvider();
    
    // 1. 如果是新会话，创建它
    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      
      const newSession = {
        id: sessionId,
        parentId: null,
        title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
        titleLocked: false,
        agentProfileId: activeAgentProfile?.id || 'gentle_guide',
        llmProviderId: activeLLMProvider.id,
        scenarioType: null,
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastMessageAt: Date.now(),
        messageCount: 0,
        branchCount: 0
      };
      
      await storage.createSession(newSession);
      
      addSession({
        id: sessionId,
        title: newSession.title,
        agentName: activeAgentProfile?.name || '温和引导者',
        agentEmoji: activeAgentProfile?.emoji || '🤗',
        llmName: activeLLMProvider.name,
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

    // 2. 保存并显示用户消息
    const userMessage: Message = {
      id: generateId(),
      sessionId,
      role: 'user',
      content,
      createdAt: Date.now(),
      isBranchPoint: false,
    };
    
    await storage.createMessage(userMessage);
    addMessage(userMessage);

    // 3. 创建 AI 消息占位符
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      sessionId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isBranchPoint: false,
      isStreaming: true,
    };
    addMessage(assistantMessage);
    setIsLoading(true);

    // 4. 调用真实 LLM 接口
    try {
      const currentMessages = useSessionStore.getState().messages;
      const historyMsg = currentMessages.slice(0, -2); // 排除刚才添加的用户消息和占位符
      
      const finalContent = await sendMessageReal(
        sessionId,
        content,
        // 这里提供 activeAgentProfile!, 我们在上面确保了它的存在
        activeAgentProfile || useSessionStore.getState().agentProfiles[0],
        activeLLMProvider,
        historyMsg,
        (chunk) => {
          // 在流式回调中更新消息内容
          const currentContent = useSessionStore.getState().messages.find(m => m.id === assistantMessageId)?.content || '';
          useSessionStore.getState().updateMessage(assistantMessageId, {
            content: currentContent + chunk
          });
        }
      );
      
      // 5. 完成并保存 AI 消息
      const finalMessage: Message = {
        ...assistantMessage,
        content: finalContent,
        isStreaming: false
      };
      
      await storage.createMessage(finalMessage);
      useSessionStore.getState().updateMessage(assistantMessageId, { 
        isStreaming: false, 
        content: finalContent 
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      useSessionStore.getState().updateMessage(assistantMessageId, { 
        isStreaming: false, 
        isError: true, 
        error: error instanceof Error ? error.message : '未知错误' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, setCurrentSessionId, addSession, addMessage]);

  // 处理选择会话
  const handleSelectSession = useCallback(async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsInChat(true);
    setActiveView('timeline');
    
    // 加载会话消息
    try {
      setIsLoading(true);
      const storage = await getDefaultStorageProvider();
      
      // We must clear messages first in the store if there's a setMessages function
      // If we don't have setMessages in the store, we should dispatch or reload
      const sessionMessages = await storage.getMessages(sessionId);
      
      // The instructions say: setMessages(sessionMessages);
      // Wait, let's see if sessionStore has setMessages...
      // The prompt suggests setMessages is from useSessionStore
      if ('setMessages' in useSessionStore.getState()) {
        (useSessionStore.getState() as any).setMessages(sessionMessages);
      } else {
        // Fallback or update multiple times depending on store impl
        // Usually Zustand lets us do this:
        useSessionStore.setState({ messages: sessionMessages });
      }
      
      const session = await storage.getSession(sessionId);
      if (session && session.agentProfileId) {
        // useSessionStore.getState().setActiveAgentProfile(session.agent); -- prompt has a typo "session.agent" vs "agentProfileId"
        const state = useSessionStore.getState();
        const profile = state.agentProfiles.find(p => p.id === session.agentProfileId);
        if (profile && state.setActiveAgentProfile) {
          state.setActiveAgentProfile(profile);
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-surface text-error">Initialization Error: {error.message}</div>;
  }
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen bg-surface flex-col gap-4 text-on-surface">
             <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
             <span className="text-sm tracking-widest uppercase font-bold text-on-surface-variant font-display">Initializing AskMe...</span>
           </div>;
  }
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
              agent={activeAgentProfile}
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
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-4xl mb-2">settings</span>
            <p>Settings Page (Work in Progress)</p>
          </div>
        )}
      </div>
    </div>
  );
}