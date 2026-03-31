// 会话状态管理 - 会话列表和消息管理

import { create } from 'zustand';
import type { SessionListItem, Message, AgentProfile, LLMProvider } from '../types';

interface SessionState {
  // 会话列表
  sessions: SessionListItem[];
  isLoading: boolean;
  error: string | null;

  // 当前会话 ID
  currentSessionId: string | null;

  // 当前会话的消息
  messages: Message[];

  // Agent Profiles
  agentProfiles: AgentProfile[];
  activeAgentProfile: AgentProfile | null;

  // LLM Providers
  llmProviders: LLMProvider[];
  activeLLMProvider: LLMProvider | null;

  // 搜索状态
  searchQuery: string;

  // 操作
  setCurrentSessionId: (id: string | null) => void;
  setSessions: (sessions: SessionListItem[]) => void;
  addSession: (session: SessionListItem) => void;
  updateSession: (id: string, updates: Partial<SessionListItem>) => void;
  deleteSession: (id: string) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setAgentProfiles: (profiles: AgentProfile[]) => void;
  setActiveAgentProfile: (profile: AgentProfile | null) => void;
  setLLMProviders: (providers: LLMProvider[]) => void;
  setActiveLLMProvider: (provider: LLMProvider | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  currentSessionId: null,
  messages: [],

  agentProfiles: [],
  activeAgentProfile: null,

  llmProviders: [],
  activeLLMProvider: null,

  searchQuery: '',

  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  setAgentProfiles: (profiles) => set({ agentProfiles: profiles }),
  setActiveAgentProfile: (profile) => set({ activeAgentProfile: profile }),

  setLLMProviders: (providers) => set({ llmProviders: providers }),
  setActiveLLMProvider: (provider) => set({ activeLLMProvider: provider }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));