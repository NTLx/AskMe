# AskMe 项目规范化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前全是模拟数据的应用层（App.tsx/Stores）连接到已完成的基础设施层（Storage/LLM/Agent），使应用具有真实数据持久化和 AI 对话功能。

**Architecture:** 采用"初始化挂载 -> 状态层改造 -> 业务逻辑接入"的三步走策略，先在应用启动时挂载 IndexedDB 和加载内置数据，然后修复 Zustand stores 中的重复/无用状态，最后将 App.tsx 中的 setTimeout 模拟替换为真实的 API 调用。

**Tech Stack:** React, Zustand, IndexedDB (Dexie), OpenAI Compatible API, Tailwind CSS

---

### Task 1: 初始化存储与默认数据加载

**Files:**
- Modify: `frontend/src/App.tsx:1-40`
- Create: `frontend/src/hooks/useAppInit.ts`

- [ ] **Step 1: 创建应用初始化 Hook**

```typescript
// frontend/src/hooks/useAppInit.ts
import { useState, useEffect } from 'react';
import { getDefaultStorageProvider } from '../storage';
import { getAgentLoader } from '../agent/loader';
import { getBuiltinAgentProfiles } from '../agent/builtins';
import { useSessionStore } from '../stores/sessionStore';
import { useSettingsStore } from '../stores/settingsStore';
import { generateId } from '../storage/web-crypto';

export function useAppInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setSessions, setAgentProfiles, setLLMProviders, setActiveAgentProfile, setActiveLLMProvider } = useSessionStore();
  const { settings, setDefaultAgentProfileId } = useSettingsStore();

  useEffect(() => {
    async function init() {
      try {
        const storage = await getDefaultStorageProvider();
        const loader = getAgentLoader();
        
        // 1. 初始化内置 Agent Profiles 到存储
        const builtins = getBuiltinAgentProfiles();
        const storedAgents = await storage.listAgentProfiles();
        
        if (storedAgents.length === 0) {
          for (const agent of builtins) {
            await storage.saveAgentProfile(agent);
            await loader.saveProfile(agent);
          }
        } else {
          for (const agent of storedAgents) {
            await loader.saveProfile(agent);
          }
        }

        // 2. 获取所有数据并更新 Store
        const profiles = await storage.listAgentProfiles();
        setAgentProfiles(profiles);
        
        const llmProviders = await storage.listLLMProviders();
        setLLMProviders(llmProviders);
        
        // 初始化一个默认的 OpenAI Provider (如果没有)
        if (llmProviders.length === 0) {
          const defaultProvider = {
            id: generateId(),
            name: 'OpenAI Compatible',
            type: 'openai_compatible' as const,
            baseUrl: 'https://api.openai.com/v1',
            apiKey: '',
            isEnabled: true,
            isDefault: true,
            config: {
              defaultModel: 'gpt-4o',
              maxTokens: 4096,
              temperature: 0.7
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await storage.saveLLMProvider(defaultProvider);
          setLLMProviders([defaultProvider]);
          setActiveLLMProvider(defaultProvider);
        } else {
          const defaultLLM = llmProviders.find(p => p.isDefault) || llmProviders[0];
          setActiveLLMProvider(defaultLLM);
        }
        
        // 3. 设置默认激活的 Agent
        const defaultAgentId = settings.defaultAgentProfileId || 'gentle_guide';
        const activeAgent = profiles.find(p => p.id === defaultAgentId) || profiles[0];
        setActiveAgentProfile(activeAgent);
        
        if (!settings.defaultAgentProfileId && activeAgent) {
          setDefaultAgentProfileId(activeAgent.id);
        }

        // 4. 加载会话列表
        const sessions = await storage.listSessions();
        setSessions(sessions);

        setIsInitialized(true);
      } catch (err) {
        console.error('App initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Unknown initialization error'));
      }
    }

    init();
  }, [setSessions, setAgentProfiles, setLLMProviders, setActiveAgentProfile, setActiveLLMProvider, settings.defaultAgentProfileId, setDefaultAgentProfileId]);

  return { isInitialized, error };
}
```

- [ ] **Step 2: 在 App.tsx 中引入并使用 Hook**

修改 `frontend/src/App.tsx` 的导入，添加刚才创建的 hook：
```typescript
import { useState, useCallback, useEffect } from 'react';
import { useAppInit } from './hooks/useAppInit';
// ... 其他导入
```

在组件内部添加：
```typescript
export function App() {
  const { isInitialized, error } = useAppInit();
  // ... 其他 hook

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-surface text-error">Initialization Error: {error.message}</div>;
  }

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen bg-surface text-on-surface">Initializing AskMe...</div>;
  }
```

- [ ] **Step 3: 运行并验证**

Run: `npm run build`
Expected: 编译通过，无类型错误。

- [ ] **Step 4: Commit**

```bash
git add frontend/src/hooks/useAppInit.ts frontend/src/App.tsx
git commit -m "feat: add app initialization logic and connect to stoarge"
```

### Task 2: 清理 Store 状态冗余

**Files:**
- Modify: `frontend/src/stores/sessionStore.ts`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: 清理 sessionStore 中的重复字段**

在 `frontend/src/stores/sessionStore.ts` 中删除 `currentAgent` 别名：

```typescript
interface SessionState {
  // ... 其他字段
  agentProfiles: AgentProfile[];
  activeAgentProfile: AgentProfile | null;
  // 删除 currentAgent
  
  // 操作
  // ... 其他操作
  setActiveAgentProfile: (profile: AgentProfile | null) => void;
  // ...
}

export const useSessionStore = create<SessionState>((set) => ({
  // ...
  agentProfiles: [],
  activeAgentProfile: null,
  // 删除 currentAgent
  
  // ...
  setActiveAgentProfile: (profile) => set({ activeAgentProfile: profile }), // 移除 currentAgent: profile
  // ...
}));
```

- [ ] **Step 2: 更新 App.tsx 使用正确的状态名**

在 `frontend/src/App.tsx` 中替换 `currentAgent` 为 `activeAgentProfile`：

```typescript
// 修改这一行
const { messages, activeAgentProfile, addMessage, currentSessionId, setCurrentSessionId, addSession, setMessages } = useSessionStore();

// 然后替换文件中所有的 currentAgent 为 activeAgentProfile
```

- [ ] **Step 3: 测试并验证**

Run: `npm run build`
Expected: PASS 编译无错误

- [ ] **Step 4: Commit**

```bash
git add frontend/src/stores/sessionStore.ts frontend/src/App.tsx
git commit -m "refactor: clean up duplicate store state currentAgent"
```

### Task 3: 实现真实的会话切换与加载

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: 在 App.tsx 中添加加载特定会话消息的逻辑**

修改 `handleSelectSession` 函数，并在组件中添加 useEffect：

```typescript
  // 引入依赖
  import { getDefaultStorageProvider } from './storage';
  
  // 修改选择会话逻辑
  const handleSelectSession = useCallback(async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsInChat(true);
    setActiveView('timeline');
    
    // 加载会话消息
    try {
      setIsLoading(true);
      const storage = await getDefaultStorageProvider();
      const sessionMessages = await storage.getMessages(sessionId);
      setMessages(sessionMessages);
      
      const session = await storage.getSession(sessionId);
      if (session && session.agent) {
        useSessionStore.getState().setActiveAgentProfile(session.agent);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentSessionId, setMessages]);
```

- [ ] **Step 2: 测试并验证**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: implement real session loading from storage"
```

### Task 4: 实现真实的 LLM 对话逻辑

**Files:**
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/services/chatService.ts`

- [ ] **Step 1: 创建真实的聊天服务**

```typescript
// frontend/src/services/chatService.ts
import { Message, AgentProfile, LLMProvider } from '../types';
import { createOpenAIAdapter } from '../llm/openai';
import { buildSystemPrompt } from '../agent/parser';
import { getDefaultStorageProvider } from '../storage';

export async function sendMessageReal(
  sessionId: string,
  content: string,
  agent: AgentProfile,
  provider: LLMProvider,
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<string> {
  if (!provider.apiKey) {
    throw new Error('API Key未设置，请在设置中配置');
  }

  const adapter = createOpenAIAdapter({
    baseUrl: provider.baseUrl || 'https://api.openai.com/v1',
    apiKey: provider.apiKey,
    defaultModel: provider.config.defaultModel || 'gpt-4o-mini',
    maxTokens: provider.config.maxTokens,
    temperature: provider.config.temperature,
  });

  const systemPrompt = buildSystemPrompt(agent);
  
  return await adapter.chatStream(
    {
      systemPrompt,
      history,
      userMessage: content,
    },
    onChunk
  );
}
```

- [ ] **Step 2: 将 mock 替换为真实聊天调用**

在 `frontend/src/App.tsx` 中修改 `handleSendMessage`：

```typescript
  import { sendMessageReal } from './services/chatService';
  import { getDefaultStorageProvider } from './storage';
  import { generateId } from './storage/web-crypto';
  
  // 处理发送消息
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const { activeLLMProvider } = useSessionStore.getState();
    if (!activeLLMProvider) {
      alert('请先在设置中配置 LLM Provider');
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
        activeAgentProfile!,
        activeLLMProvider,
        historyMsg,
        (chunk) => {
          // 在流式回调中更新消息内容
          useSessionStore.getState().updateMessage(assistantMessageId, {
            content: useSessionStore.getState().messages.find(m => m.id === assistantMessageId)?.content + chunk
          });
        }
      );
      
      // 5. 完成并保存 AI 消息
      const finalMessage = {
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
  }, [currentSessionId, setCurrentSessionId, addSession, addMessage, activeAgentProfile]);
```

- [ ] **Step 3: 测试并验证**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add frontend/src/services/chatService.ts frontend/src/App.tsx
git commit -m "feat: replace mock chat with real LLM api calls and persistance"
```
