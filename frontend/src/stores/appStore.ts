// 应用状态管理 - 当前会话、Agent、LLM 和 UI 状态

import { create } from 'zustand';
import { AgentProfile, LLMProvider, Session } from '../types';

interface AppState {
  // 当前激活的数据
  currentSession: Session | null;
  currentAgent: AgentProfile | null;
  currentLLM: LLMProvider | null;

  // UI 状态
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isLaunchPadVisible: boolean;

  // 操作
  setCurrentSession: (session: Session | null) => void;
  setCurrentAgent: (agent: AgentProfile | null) => void;
  setCurrentLLM: (llm: LLMProvider | null) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  setLaunchPadVisible: (visible: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSession: null,
  currentAgent: null,
  currentLLM: null,

  isSidebarOpen: true,
  isSettingsOpen: false,
  isLaunchPadVisible: true,

  setCurrentSession: (session) => set({ currentSession: session }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setCurrentLLM: (llm) => set({ currentLLM: llm }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setLaunchPadVisible: (visible) => set({ isLaunchPadVisible: visible }),
}));