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
