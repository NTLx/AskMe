// 用户设置状态管理 - 持久化配置

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppSettings, SearchDimension } from '../types';

interface SettingsState extends AppSettings {
  // 扩展设置
  inputDraft: string;

  // 操作
  settings: AppSettings; // getter，兼容 App.tsx
  setSettings: (settings: AppSettings) => void; // setter，兼容 App.tsx
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setAutoGenerateTitle: (value: boolean) => void;
  setPreserveInputDraft: (value: boolean) => void;
  setDefaultSearchDimensions: (dimensions: SearchDimension[]) => void;
  setExportPath: (path: string) => void;
  setDefaultAgentProfileId: (id: string) => void;
  setDefaultLLMProviderId: (id: string) => void;
  setInputDraft: (draft: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  autoGenerateTitle: true,
  preserveInputDraft: true,
  defaultSearchDimensions: ['name', 'content', 'tag', 'agent', 'llm'],
  exportPath: '',
  defaultAgentProfileId: undefined,
  defaultLLMProviderId: undefined,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      inputDraft: '',

      // 兼容 App.tsx 的 getter/setter
      settings: DEFAULT_SETTINGS,
      setSettings: (newSettings) => set(newSettings),

      setTheme: (theme) => set({ theme }),
      setAutoGenerateTitle: (value) => set({ autoGenerateTitle: value }),
      setPreserveInputDraft: (value) => set({ preserveInputDraft: value }),
      setDefaultSearchDimensions: (dimensions) => set({ defaultSearchDimensions: dimensions }),
      setExportPath: (path) => set({ exportPath: path }),
      setDefaultAgentProfileId: (id) => set({ defaultAgentProfileId: id }),
      setDefaultLLMProviderId: (id) => set({ defaultLLMProviderId: id }),
      setInputDraft: (draft) => set({ inputDraft: draft }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'askme-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        autoGenerateTitle: state.autoGenerateTitle,
        preserveInputDraft: state.preserveInputDraft,
        defaultSearchDimensions: state.defaultSearchDimensions,
        exportPath: state.exportPath,
        defaultAgentProfileId: state.defaultAgentProfileId,
        defaultLLMProviderId: state.defaultLLMProviderId,
        // inputDraft 根据 preserveInputDraft 配置决定是否持久化
        ...(state.preserveInputDraft && { inputDraft: state.inputDraft }),
      }),
    }
  )
);